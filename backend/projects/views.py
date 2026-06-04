from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from .models import Project, Task
from .serializers import ProjectSerializer
from rest_framework.generics import ListCreateAPIView
from .serializers import TaskSerializer
import zipfile
from collections import Counter
from pathlib import Path
import urllib.parse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Project, AnalysisResult
from .serializers import AnalysisResultSerializer
from .ai_utils import (
    analyze_code_with_openai,
    analyze_task_with_openai,
    fix_code_with_ai,
)


class ProjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # 🔥 GET → List projects
    def get(self, request):
        # ✅ Admin sees ALL projects
        if request.user.is_superuser:
            projects = Project.objects.all().order_by("-created_at")
        else:
            # ✅ Student sees ONLY their projects
            projects = Project.objects.filter(user=request.user).order_by("-created_at")

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    # 🔥 POST → Create project
    def post(self, request):
        name = request.data.get("name")
        file = request.FILES.get("file")

        # ❌ Validation
        if not name or not file:
            return Response(
                {"error": "Project name and file required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Create project
        project = Project.objects.create(
            user=request.user,
            name=name,
            file=file,
        )

        serializer = ProjectSerializer(project)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectDetailView(RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]


class TaskListCreateView(ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]

        return Task.objects.filter(
            project_id=project_id, project__user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(project_id=self.kwargs["project_id"])


class AnalyzeProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        zip_path = project.file.path

        if not zipfile.is_zipfile(zip_path):
            return Response(
                {"error": "Uploaded file is not a valid ZIP file"}, status=400
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

        # 🔥 READ ZIP FILE
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            for file_name in zip_ref.namelist():
                if file_name.endswith("/"):
                    continue

                # ✅ SAVE FILE STRUCTURE
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

                    # ❌ ignore useless lines
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

        # 🔥 DUPLICATE LOGIC
        line_counts = Counter(all_lines)

        duplicate_lines = sum(count - 1 for count in line_counts.values() if count > 1)

        duplicate_percentage = 0
        if total_lines > 0:
            duplicate_percentage = round((duplicate_lines / total_lines) * 100, 2)

        # 🔥 SMART TOP DUPLICATES (IMPORTANT FIX)
        top_duplicates = []

        for line, count in line_counts.items():
            if count > 1:
                # ❌ Skip useless / common patterns
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

        # ✅ Sort by most repeated
        top_duplicates = sorted(top_duplicates, key=lambda x: x["count"], reverse=True)[
            :5
        ]

        # 🔥 AI ANALYSIS
        ai_suggestions = analyze_code_with_openai(zip_path)

        # 🔥 SAVE TO DATABASE (same as before)
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

        # 🔥 RETURN ENHANCED RESPONSE (IMPORTANT)
        return Response(
            {
                "total_files": total_files,
                "total_lines": total_lines,
                "duplicate_lines": duplicate_lines,
                "duplicate_percentage": duplicate_percentage,
                # 🚀 NEW DATA FOR FRONTEND
                "files": file_structure,
                "top_duplicates": top_duplicates,
                "ai_suggestions": ai_suggestions,
            },
            status=status.HTTP_201_CREATED,
        )


class ProjectAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
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
                except:
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

        top_duplicates = sorted(top_duplicates, key=lambda x: x["count"], reverse=True)[
            :5
        ]

        # ✅ Get AI from DB (already saved)
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


from django.contrib.auth.models import User
from django.db.models import Avg, Count


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_projects = Project.objects.count()
        total_reports = AnalysisResult.objects.count()

        # ✅ NEW: average duplication
        avg_duplication = (
            AnalysisResult.objects.aggregate(avg=Avg("duplicate_percentage"))["avg"]
            or 0
        )

        # ✅ NEW: AI usage (how many analyzed)
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


class ProjectDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            project = Project.objects.get(id=pk)

            # ❌ only admin can delete
            if not request.user.is_superuser:
                return Response({"error": "Unauthorized"}, status=403)

            project.delete()

            return Response({"message": "Project deleted successfully"})

        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)


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


class ToggleUserStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)

            # Do not allow disabling super admin
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


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id, task_id):
        try:
            task = Task.objects.get(
                id=task_id, project_id=project_id, project__user=request.user
            )
            serializer = TaskSerializer(task)
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)


class AnalyzeTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, task_id):
        try:
            task = Task.objects.get(
                id=task_id, project_id=project_id, project__user=request.user
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

        serializer = TaskSerializer(task)
        return Response(serializer.data)


class FixTaskCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, task_id):
        try:
            task = Task.objects.get(
                id=task_id, project_id=project_id, project__user=request.user
            )
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        from .ai_utils import analyze_task_with_openai

        # 🔥 Ask AI to FIX code
        fixed_code = analyze_task_with_openai(
            task.name, "Fix and improve this code", task.code_snippet
        )

        return Response({"fixed_code": fixed_code})


class ProjectFileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        file_name = urllib.parse.unquote(request.query_params.get("file"))

        try:
            project = Project.objects.get(id=pk, user=request.user)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)

        zip_path = project.file.path

        with zipfile.ZipFile(zip_path, "r") as zip_ref:

            content = None

            for zip_file in zip_ref.namelist():
                if zip_file.strip() == file_name.strip():
                    content = zip_ref.read(zip_file).decode("utf-8", errors="ignore")
                    break

            if not content:
                return Response({"error": "File not found"}, status=404)

            return Response({"file": file_name, "content": content})
