from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView

from django.contrib.auth.models import User
from django.db.models import Avg
from django.http import HttpResponse

import zipfile
from collections import Counter
from pathlib import Path
import urllib.parse
import os

from .models import Project, Task, AnalysisResult, ActivityLog
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    AnalysisResultSerializer,
    ActivityLogSerializer,
)
from .ai_utils import (
    analyze_code_with_openai,
    analyze_task_with_openai,
    fix_code_with_ai,
)


# ==========================================================
# ACTIVITY LOG HELPER
# ==========================================================
def create_activity_log(request, action, status_code=200, message="", project_name=""):
    try:
        ActivityLog.objects.create(
            user=request.user if request.user.is_authenticated else None,
            action=action,
            method=request.method,
            path=request.path,
            status_code=status_code,
            message=message,
            project_name=project_name,
        )
    except Exception:
        pass


# ==========================================================
# PROJECT LIST / CREATE
# ==========================================================
class ProjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_superuser:
            projects = Project.objects.all().order_by("-created_at")
        else:
            projects = Project.objects.filter(user=request.user).order_by("-created_at")

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get("name")
        file = request.FILES.get("file")

        if not name or not file:
            return Response(
                {"error": "Project name and file required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project = Project.objects.create(
            user=request.user,
            name=name,
            file=file,
        )

        create_activity_log(
            request,
            "PROJECT_UPLOADED",
            status_code=201,
            message=f"Project uploaded: {project.name}",
            project_name=project.name,
        )

        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ==========================================================
# PROJECT DETAIL
# ==========================================================
class ProjectDetailView(RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Project.objects.all()

        return Project.objects.filter(user=self.request.user)


# ==========================================================
# TASK LIST / CREATE
# ==========================================================
class TaskListCreateView(ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]

        if self.request.user.is_superuser:
            return Task.objects.filter(project_id=project_id).order_by("-created_at")

        return Task.objects.filter(
            project_id=project_id,
            project__user=self.request.user,
        ).order_by("-created_at")

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]

        if self.request.user.is_superuser:
            project = Project.objects.get(id=project_id)
        else:
            project = Project.objects.get(id=project_id, user=self.request.user)

        task = serializer.save(project=project)

        create_activity_log(
            self.request,
            "TASK_CREATED",
            status_code=201,
            message=f"Task created: {task.name}",
            project_name=project.name,
        )


# ==========================================================
# ANALYZE PROJECT
# ==========================================================
class AnalyzeProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            if request.user.is_superuser:
                project = Project.objects.get(id=pk)
            else:
                project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        zip_path = project.file.path

        if not zipfile.is_zipfile(zip_path):
            return Response(
                {"error": "Uploaded file is not a valid ZIP file"},
                status=400,
            )

        code_extensions = [
            ".py",
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".java",
            ".cs",
            ".cpp",
            ".c",
            ".html",
            ".css",
        ]

        total_files = 0
        all_lines = []
        file_structure = []

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            for file_name in zip_ref.namelist():
                if file_name.endswith("/"):
                    continue

                file_structure.append(file_name)

                ext = Path(file_name).suffix.lower()

                if ext not in code_extensions:
                    continue

                try:
                    content = zip_ref.read(file_name).decode("utf-8", errors="ignore")
                except Exception:
                    continue

                total_files += 1

                lines = []

                for line in content.splitlines():
                    clean = line.strip()

                    if (
                        not clean
                        or len(clean) < 15
                        or clean in ["{", "}", "(", ")", ";"]
                        or clean.startswith("import")
                        or clean.startswith("package")
                        or clean.startswith("@")
                        or clean.startswith("//")
                        or clean.startswith("#")
                    ):
                        continue

                    lines.append(clean)

                all_lines.extend(lines)

        total_lines = len(all_lines)

        line_counts = Counter(all_lines)
        duplicate_lines = sum(count - 1 for count in line_counts.values() if count > 1)

        duplicate_percentage = 0
        if total_lines > 0:
            duplicate_percentage = round((duplicate_lines / total_lines) * 100, 2)

        top_duplicates = []

        for line, count in line_counts.items():
            if count > 1:
                if (
                    len(line) < 25
                    or line in ["{", "}", "(", ")", ";"]
                    or "private" in line
                    or "public" in line
                    or "import" in line
                    or "package" in line
                    or line.startswith("@")
                    or line.endswith(";")
                ):
                    continue

                top_duplicates.append({"line": line, "count": count})

        top_duplicates = sorted(
            top_duplicates,
            key=lambda x: x["count"],
            reverse=True,
        )[:5]

        ai_suggestions = analyze_code_with_openai(zip_path)

        AnalysisResult.objects.update_or_create(
            project=project,
            defaults={
                "total_files": total_files,
                "total_lines": total_lines,
                "duplicate_lines": duplicate_lines,
                "duplicate_percentage": duplicate_percentage,
                "ai_suggestions": ai_suggestions,
            },
        )

        create_activity_log(
            request,
            "PROJECT_ANALYZED",
            status_code=201,
            message=(
                f"Project analyzed. Files: {total_files}, "
                f"Lines: {total_lines}, Duplicates: {duplicate_lines}"
            ),
            project_name=project.name,
        )

        return Response(
            {
                "total_files": total_files,
                "total_lines": total_lines,
                "duplicate_lines": duplicate_lines,
                "duplicate_percentage": duplicate_percentage,
                "files": file_structure,
                "top_duplicates": top_duplicates,
                "ai_suggestions": ai_suggestions,
            },
            status=status.HTTP_201_CREATED,
        )


# ==========================================================
# PROJECT ANALYSIS RESULT
# ==========================================================
class ProjectAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            if request.user.is_superuser:
                project = Project.objects.get(id=pk)
            else:
                project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        zip_path = project.file.path

        if not zipfile.is_zipfile(zip_path):
            return Response({"error": "Invalid ZIP"}, status=400)

        code_extensions = [
            ".py",
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".java",
            ".cs",
            ".cpp",
            ".c",
            ".html",
            ".css",
        ]

        all_lines = []
        file_structure = []

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            for file_name in zip_ref.namelist():
                if file_name.endswith("/"):
                    continue

                file_structure.append(file_name)

                ext = Path(file_name).suffix.lower()

                if ext not in code_extensions:
                    continue

                try:
                    content = zip_ref.read(file_name).decode("utf-8", errors="ignore")
                except Exception:
                    continue

                lines = []

                for line in content.splitlines():
                    clean = line.strip()

                    if (
                        not clean
                        or len(clean) < 15
                        or clean in ["{", "}", "(", ")", ";"]
                        or clean.startswith("import")
                        or clean.startswith("package")
                        or clean.startswith("@")
                        or clean.startswith("//")
                        or clean.startswith("#")
                    ):
                        continue

                    lines.append(clean)

                all_lines.extend(lines)

        total_lines = len(all_lines)

        line_counts = Counter(all_lines)
        duplicate_lines = sum(count - 1 for count in line_counts.values() if count > 1)

        duplicate_percentage = (
            round((duplicate_lines / total_lines) * 100, 2) if total_lines > 0 else 0
        )

        top_duplicates = []

        for line, count in line_counts.items():
            if count > 1:
                if (
                    len(line) < 25
                    or line in ["{", "}", "(", ")", ";"]
                    or "private" in line
                    or "public" in line
                    or "import" in line
                    or "package" in line
                    or line.startswith("@")
                    or line.endswith(";")
                ):
                    continue

                top_duplicates.append({"line": line, "count": count})

        top_duplicates = sorted(
            top_duplicates,
            key=lambda x: x["count"],
            reverse=True,
        )[:5]

        analysis = AnalysisResult.objects.filter(project=project).last()

        return Response(
            {
                "total_files": len(file_structure),
                "total_lines": total_lines,
                "duplicate_lines": duplicate_lines,
                "duplicate_percentage": duplicate_percentage,
                "files": file_structure,
                "top_duplicates": top_duplicates,
                "ai_suggestions": analysis.ai_suggestions if analysis else "",
            }
        )


# ==========================================================
# ADMIN DASHBOARD
# ==========================================================
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_projects = Project.objects.count()
        total_reports = AnalysisResult.objects.count()

        avg_duplication = (
            AnalysisResult.objects.aggregate(avg=Avg("duplicate_percentage"))["avg"]
            or 0
        )

        ai_usage = AnalysisResult.objects.count()

        return Response(
            {
                "users": total_users,
                "projects": total_projects,
                "reports": total_reports,
                "avg_duplication": round(avg_duplication, 2),
                "ai_usage": ai_usage,
            }
        )


# ==========================================================
# ADMIN REPORTS
# ==========================================================
class AdminReportsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        logs = ActivityLog.objects.all().order_by("-created_at")[:100]

        total_requests = ActivityLog.objects.count()
        project_uploads = ActivityLog.objects.filter(action="PROJECT_UPLOADED").count()
        project_deleted = ActivityLog.objects.filter(action="PROJECT_DELETED").count()
        project_analyzed = ActivityLog.objects.filter(action="PROJECT_ANALYZED").count()
        task_created = ActivityLog.objects.filter(action="TASK_CREATED").count()
        task_analyzed = ActivityLog.objects.filter(action="TASK_ANALYZED").count()
        code_fixed = ActivityLog.objects.filter(action="CODE_FIXED").count()
        file_opened = ActivityLog.objects.filter(action="FILE_OPENED").count()
        file_downloaded = ActivityLog.objects.filter(action="FILE_DOWNLOADED").count()
        failed_requests = ActivityLog.objects.filter(status_code__gte=400).count()

        serializer = ActivityLogSerializer(logs, many=True)

        return Response(
            {
                "stats": {
                    "total_requests": total_requests,
                    "project_uploads": project_uploads,
                    "project_deleted": project_deleted,
                    "project_analyzed": project_analyzed,
                    "task_created": task_created,
                    "task_analyzed": task_analyzed,
                    "code_fixed": code_fixed,
                    "file_opened": file_opened,
                    "file_downloaded": file_downloaded,
                    "failed_requests": failed_requests,
                },
                "logs": serializer.data,
            }
        )


# ==========================================================
# DELETE PROJECT
# ==========================================================
class ProjectDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            project = Project.objects.get(id=pk)

            if not request.user.is_superuser and project.user != request.user:
                return Response({"error": "Unauthorized"}, status=403)

            project_name = project.name

            create_activity_log(
                request,
                "PROJECT_DELETED",
                status_code=200,
                message=f"Project deleted: {project_name}",
                project_name=project_name,
            )

            project.delete()

            return Response({"message": "Project deleted successfully"})

        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)


# ==========================================================
# ADMIN USERS
# ==========================================================
class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.all()

        data = []

        for user in users:
            data.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_active": user.is_active,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                    "projects_count": user.projects.count(),
                }
            )

        return Response(data)


# ==========================================================
# TOGGLE USER STATUS
# ==========================================================
class ToggleUserStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)

            if user.is_superuser:
                return Response(
                    {"error": "You cannot disable a superuser."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.is_active = not user.is_active
            user.save()

            return Response(
                {
                    "message": "User status updated successfully.",
                    "id": user.id,
                    "username": user.username,
                    "is_active": user.is_active,
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


# ==========================================================
# TASK DETAIL
# ==========================================================
class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id, task_id):
        try:
            if request.user.is_superuser:
                task = Task.objects.get(id=task_id, project_id=project_id)
            else:
                task = Task.objects.get(
                    id=task_id,
                    project_id=project_id,
                    project__user=request.user,
                )

            serializer = TaskSerializer(task)
            return Response(serializer.data)

        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)


# ==========================================================
# ANALYZE TASK
# ==========================================================
class AnalyzeTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, task_id):
        try:
            if request.user.is_superuser:
                task = Task.objects.get(id=task_id, project_id=project_id)
            else:
                task = Task.objects.get(
                    id=task_id,
                    project_id=project_id,
                    project__user=request.user,
                )
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        description = request.data.get("description", "")
        code_snippet = request.data.get("code_snippet", "")

        task.description = description
        task.code_snippet = code_snippet

        ai_response = analyze_task_with_openai(task.name, description, code_snippet)

        task.ai_response = ai_response
        task.save()

        create_activity_log(
            request,
            "TASK_ANALYZED",
            status_code=200,
            message=f"Task analyzed: {task.name}",
            project_name=task.project.name,
        )

        serializer = TaskSerializer(task)
        return Response(serializer.data)


# ==========================================================
# FIX TASK CODE
# ==========================================================
class FixTaskCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, task_id):
        try:
            if request.user.is_superuser:
                task = Task.objects.get(id=task_id, project_id=project_id)
            else:
                task = Task.objects.get(
                    id=task_id,
                    project_id=project_id,
                    project__user=request.user,
                )
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        description = request.data.get("description", task.description or "")
        code_snippet = request.data.get("code_snippet", task.code_snippet or "")

        task.description = description
        task.code_snippet = code_snippet
        task.save()

        fixed_code = fix_code_with_ai(code_snippet)

        create_activity_log(
            request,
            "CODE_FIXED",
            status_code=200,
            message=f"Improved code generated for task: {task.name}",
            project_name=task.project.name,
        )

        return Response({"fixed_code": fixed_code})


# ==========================================================
# OPEN PROJECT FILE
# ==========================================================
class ProjectFileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        file_name = urllib.parse.unquote(request.query_params.get("file", ""))

        if not file_name:
            return Response({"error": "File name is required"}, status=400)

        try:
            if request.user.is_superuser:
                project = Project.objects.get(id=pk)
            else:
                project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        zip_path = project.file.path

        if not zipfile.is_zipfile(zip_path):
            return Response({"error": "Invalid ZIP file"}, status=400)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            content = None

            for zip_file in zip_ref.namelist():
                if zip_file.strip() == file_name.strip():
                    content = zip_ref.read(zip_file).decode("utf-8", errors="ignore")
                    break

            if not content:
                return Response({"error": "File not found"}, status=404)

            create_activity_log(
                request,
                "FILE_OPENED",
                status_code=200,
                message=f"File opened: {file_name}",
                project_name=project.name,
            )

            return Response({"file": file_name, "content": content})


# ==========================================================
# DOWNLOAD PROJECT FILE
# ==========================================================
class ProjectFileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        file_name = urllib.parse.unquote(request.query_params.get("file", ""))

        if not file_name:
            return Response({"error": "File name is required"}, status=400)

        try:
            if request.user.is_superuser:
                project = Project.objects.get(id=pk)
            else:
                project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        zip_path = project.file.path

        if not zipfile.is_zipfile(zip_path):
            return Response({"error": "Invalid ZIP file"}, status=400)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            matched_file = None

            for zip_file in zip_ref.namelist():
                if zip_file.strip() == file_name.strip():
                    matched_file = zip_file
                    break

            if not matched_file:
                return Response({"error": "File not found"}, status=404)

            file_content = zip_ref.read(matched_file)
            download_name = os.path.basename(matched_file)

            response = HttpResponse(
                file_content,
                content_type="application/octet-stream",
            )

            response["Content-Disposition"] = f'attachment; filename="{download_name}"'

            create_activity_log(
                request,
                "FILE_DOWNLOADED",
                status_code=200,
                message=f"File downloaded: {download_name}",
                project_name=project.name,
            )

            return response


# ==========================================================
# DELETE TASK
# ==========================================================
class TaskDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, project_id, task_id):
        try:
            if request.user.is_superuser:
                task = Task.objects.get(id=task_id, project_id=project_id)
            else:
                task = Task.objects.get(
                    id=task_id,
                    project_id=project_id,
                    project__user=request.user,
                )
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        task_name = task.name
        project_name = task.project.name

        task.delete()

        return Response({"message": "Task deleted successfully"})
