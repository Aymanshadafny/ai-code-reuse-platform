import os
import shutil
import tempfile
import zipfile
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status

from .models import Project, Task, AnalysisResult, ActivityLog

MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ProjectsTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="student1",
            email="student1@gmail.com",
            password="testpass123",
        )

        self.other_user = User.objects.create_user(
            username="student2",
            email="student2@gmail.com",
            password="testpass123",
        )

        self.admin = User.objects.create_superuser(
            username="admin",
            email="admin@gmail.com",
            password="adminpass123",
        )

        self.projects_url = "/api/projects/"
        self.admin_dashboard_url = "/api/projects/admin/dashboard/"
        self.admin_users_url = "/api/projects/admin/users/"
        self.admin_reports_url = "/api/projects/admin/reports/"

    # =========================
    # HELPERS
    # =========================

    def authenticate_student(self):
        self.client.force_authenticate(user=self.user)

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.admin)

    def create_test_zip_file(self, filename="test_project.zip"):
        zip_buffer_path = os.path.join(MEDIA_ROOT, filename)

        duplicate_line = "function calculateReusableScore(value) { return value * 10; }"

        with zipfile.ZipFile(zip_buffer_path, "w") as zip_file:
            zip_file.writestr(
                "src/file1.js",
                f"""
                const name = "AI Reuse";
                {duplicate_line}
                console.log(calculateReusableScore(2));
                """,
            )
            zip_file.writestr(
                "src/file2.js",
                f"""
                const title = "Code Analysis";
                {duplicate_line}
                console.log(calculateReusableScore(3));
                """,
            )
            zip_file.writestr(
                "README.md",
                "# Test Project",
            )

        with open(zip_buffer_path, "rb") as file:
            uploaded_file = SimpleUploadedFile(
                filename,
                file.read(),
                content_type="application/zip",
            )

        return uploaded_file

    def create_invalid_file(self):
        return SimpleUploadedFile(
            "not_zip.txt",
            b"This is not a zip file",
            content_type="text/plain",
        )

    def create_project(self, user=None, name="Test Project"):
        if user is None:
            user = self.user

        return Project.objects.create(
            user=user,
            name=name,
            file=self.create_test_zip_file(),
        )

    # =========================
    # PROJECT LIST / CREATE
    # =========================

    def test_student_can_create_project_with_zip_file(self):
        self.authenticate_student()

        data = {
            "name": "Student ZIP Project",
            "file": self.create_test_zip_file(),
        }

        response = self.client.post(self.projects_url, data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Student ZIP Project")
        self.assertEqual(response.data["user"], "student1")

        self.assertTrue(Project.objects.filter(name="Student ZIP Project").exists())
        self.assertTrue(ActivityLog.objects.filter(action="PROJECT_UPLOADED").exists())

    def test_create_project_without_name_or_file_fails(self):
        self.authenticate_student()

        response = self.client.post(self.projects_url, {}, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Project name and file required")

    def test_student_can_list_only_own_projects(self):
        self.authenticate_student()

        Project.objects.create(
            user=self.user,
            name="My Project",
            file=self.create_test_zip_file("my_project.zip"),
        )

        Project.objects.create(
            user=self.other_user,
            name="Other User Project",
            file=self.create_test_zip_file("other_project.zip"),
        )

        response = self.client.get(self.projects_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "My Project")

    def test_admin_can_list_all_projects(self):
        self.authenticate_admin()

        Project.objects.create(
            user=self.user,
            name="Student Project",
            file=self.create_test_zip_file("student_project.zip"),
        )

        Project.objects.create(
            user=self.other_user,
            name="Other Project",
            file=self.create_test_zip_file("other_user_project.zip"),
        )

        response = self.client.get(self.projects_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_unauthenticated_user_cannot_list_projects(self):
        response = self.client.get(self.projects_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # =========================
    # PROJECT DETAIL
    # =========================

    def test_student_can_view_own_project_detail(self):
        self.authenticate_student()

        project = self.create_project(user=self.user, name="Own Project")

        response = self.client.get(f"/api/projects/{project.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Own Project")

    def test_student_cannot_view_other_user_project_detail(self):
        self.authenticate_student()

        project = self.create_project(user=self.other_user, name="Other Project")

        response = self.client.get(f"/api/projects/{project.id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_view_any_project_detail(self):
        self.authenticate_admin()

        project = self.create_project(user=self.user, name="Any Project")

        response = self.client.get(f"/api/projects/{project.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Any Project")

    # =========================
    # TASK LIST / CREATE / DETAIL / DELETE
    # =========================

    def test_student_can_create_task_for_own_project(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        data = {
            "name": "Fix Login",
            "description": "Fix login validation",
            "code_snippet": "console.log('hello');",
        }

        response = self.client.post(
            f"/api/projects/{project.id}/tasks/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Fix Login")
        self.assertTrue(Task.objects.filter(name="Fix Login").exists())
        self.assertTrue(ActivityLog.objects.filter(action="TASK_CREATED").exists())

    def test_student_can_list_own_project_tasks(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        Task.objects.create(
            project=project,
            name="Task One",
            description="Test task",
            code_snippet="print('hello')",
        )

        response = self.client.get(f"/api/projects/{project.id}/tasks/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Task One")

    def test_student_cannot_list_other_user_project_tasks(self):
        self.authenticate_student()

        project = self.create_project(user=self.other_user)

        Task.objects.create(
            project=project,
            name="Other Task",
            description="Other task",
            code_snippet="print('other')",
        )

        response = self.client.get(f"/api/projects/{project.id}/tasks/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_student_can_view_own_task_detail(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        task = Task.objects.create(
            project=project,
            name="Task Detail",
            description="Details",
            code_snippet="print('detail')",
        )

        response = self.client.get(f"/api/projects/{project.id}/tasks/{task.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Task Detail")

    def test_student_cannot_view_other_user_task_detail(self):
        self.authenticate_student()

        project = self.create_project(user=self.other_user)

        task = Task.objects.create(
            project=project,
            name="Other Task",
            description="Other",
            code_snippet="print('other')",
        )

        response = self.client.get(f"/api/projects/{project.id}/tasks/{task.id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_student_can_delete_own_task(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        task = Task.objects.create(
            project=project,
            name="Delete Task",
            description="Delete this",
            code_snippet="print('delete')",
        )

        response = self.client.delete(
            f"/api/projects/{project.id}/tasks/{task.id}/delete/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Task deleted successfully")
        self.assertFalse(Task.objects.filter(id=task.id).exists())

    # =========================
    # ANALYZE TASK / FIX CODE
    # =========================

    @patch("projects.views.analyze_task_with_openai")
    def test_analyze_task_success(self, mock_ai):
        self.authenticate_student()

        mock_ai.return_value = "AI analysis response"

        project = self.create_project(user=self.user)

        task = Task.objects.create(
            project=project,
            name="Analyze Task",
            description="Old description",
            code_snippet="old code",
        )

        data = {
            "description": "Analyze this code",
            "code_snippet": "function test() { return true; }",
        }

        response = self.client.post(
            f"/api/projects/{project.id}/tasks/{task.id}/analyze/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["ai_response"], "AI analysis response")

        task.refresh_from_db()
        self.assertEqual(task.description, "Analyze this code")
        self.assertEqual(task.ai_response, "AI analysis response")
        self.assertTrue(ActivityLog.objects.filter(action="TASK_ANALYZED").exists())

    @patch("projects.views.fix_code_with_ai")
    def test_fix_task_code_success(self, mock_fix_ai):
        self.authenticate_student()

        mock_fix_ai.return_value = "console.log('fixed code');"

        project = self.create_project(user=self.user)

        task = Task.objects.create(
            project=project,
            name="Fix Code Task",
            description="Fix code",
            code_snippet="console.log('bad code');",
        )

        data = {
            "description": "Fix this",
            "code_snippet": "console.log('bad code');",
        }

        response = self.client.post(
            f"/api/projects/{project.id}/tasks/{task.id}/fix/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["fixed_code"], "console.log('fixed code');")
        self.assertTrue(ActivityLog.objects.filter(action="CODE_FIXED").exists())

    # =========================
    # ANALYZE PROJECT / ANALYSIS RESULT
    # =========================

    @patch("projects.views.analyze_code_with_openai")
    def test_analyze_project_success(self, mock_ai):
        self.authenticate_student()

        mock_ai.return_value = "AI project suggestions"

        project = self.create_project(user=self.user)

        response = self.client.post(f"/api/projects/{project.id}/analyze/")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("total_files", response.data)
        self.assertIn("total_lines", response.data)
        self.assertIn("duplicate_lines", response.data)
        self.assertIn("duplicate_percentage", response.data)
        self.assertIn("files", response.data)
        self.assertIn("top_duplicates", response.data)
        self.assertEqual(response.data["ai_suggestions"], "AI project suggestions")

        self.assertTrue(AnalysisResult.objects.filter(project=project).exists())
        self.assertTrue(ActivityLog.objects.filter(action="PROJECT_ANALYZED").exists())

    def test_analyze_project_invalid_zip_fails(self):
        self.authenticate_student()

        project = Project.objects.create(
            user=self.user,
            name="Invalid ZIP Project",
            file=self.create_invalid_file(),
        )

        response = self.client.post(f"/api/projects/{project.id}/analyze/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"], "Uploaded file is not a valid ZIP file"
        )

    @patch("projects.views.analyze_code_with_openai")
    def test_get_project_analysis_success(self, mock_ai):
        self.authenticate_student()

        mock_ai.return_value = "AI project suggestions"

        project = self.create_project(user=self.user)

        self.client.post(f"/api/projects/{project.id}/analyze/")

        response = self.client.get(f"/api/projects/{project.id}/analysis/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_files", response.data)
        self.assertIn("total_lines", response.data)
        self.assertIn("duplicate_lines", response.data)
        self.assertIn("duplicate_percentage", response.data)
        self.assertIn("files", response.data)
        self.assertIn("top_duplicates", response.data)

    def test_get_project_analysis_other_user_fails(self):
        self.authenticate_student()

        project = self.create_project(user=self.other_user)

        response = self.client.get(f"/api/projects/{project.id}/analysis/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # =========================
    # PROJECT FILE VIEW / DOWNLOAD
    # =========================

    def test_open_project_file_success(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        response = self.client.get(
            f"/api/projects/{project.id}/file/",
            {"file": "src/file1.js"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["file"], "src/file1.js")
        self.assertIn("calculateReusableScore", response.data["content"])
        self.assertTrue(ActivityLog.objects.filter(action="FILE_OPENED").exists())

    def test_open_project_file_without_file_name_fails(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        response = self.client.get(f"/api/projects/{project.id}/file/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "File name is required")

    def test_open_project_file_not_found_fails(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        response = self.client.get(
            f"/api/projects/{project.id}/file/",
            {"file": "src/missing.js"},
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "File not found")

    def test_download_project_file_success(self):
        self.authenticate_student()

        project = self.create_project(user=self.user)

        response = self.client.get(
            f"/api/projects/{project.id}/file/download/",
            {"file": "src/file1.js"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/octet-stream")
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertTrue(ActivityLog.objects.filter(action="FILE_DOWNLOADED").exists())

    # =========================
    # DELETE PROJECT
    # =========================

    def test_student_can_delete_own_project(self):
        self.authenticate_student()

        project = self.create_project(user=self.user, name="Delete Project")

        response = self.client.delete(f"/api/projects/{project.id}/delete/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Project deleted successfully")
        self.assertFalse(Project.objects.filter(id=project.id).exists())
        self.assertTrue(ActivityLog.objects.filter(action="PROJECT_DELETED").exists())

    def test_student_cannot_delete_other_user_project(self):
        self.authenticate_student()

        project = self.create_project(user=self.other_user, name="Other Project")

        response = self.client.delete(f"/api/projects/{project.id}/delete/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["error"], "Unauthorized")
        self.assertTrue(Project.objects.filter(id=project.id).exists())

    def test_admin_can_delete_any_project(self):
        self.authenticate_admin()

        project = self.create_project(user=self.user, name="Admin Delete Project")

        response = self.client.delete(f"/api/projects/{project.id}/delete/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Project.objects.filter(id=project.id).exists())

    # =========================
    # ADMIN DASHBOARD / USERS / REPORTS
    # =========================

    def test_admin_dashboard_success(self):
        self.authenticate_admin()

        self.create_project(user=self.user)

        AnalysisResult.objects.create(
            project=Project.objects.first(),
            total_files=2,
            total_lines=20,
            duplicate_lines=5,
            duplicate_percentage=25.0,
            ai_suggestions="Improve reuse",
        )

        response = self.client.get(self.admin_dashboard_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("users", response.data)
        self.assertIn("projects", response.data)
        self.assertIn("reports", response.data)
        self.assertIn("avg_duplication", response.data)
        self.assertIn("ai_usage", response.data)

    def test_student_cannot_access_admin_dashboard(self):
        self.authenticate_student()

        response = self.client.get(self.admin_dashboard_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_users_success(self):
        self.authenticate_admin()

        response = self.client.get(self.admin_users_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 3)
        self.assertIn("username", response.data[0])
        self.assertIn("email", response.data[0])
        self.assertIn("projects_count", response.data[0])

    def test_admin_reports_success(self):
        self.authenticate_admin()

        ActivityLog.objects.create(
            user=self.user,
            action="PROJECT_UPLOADED",
            method="POST",
            path="/api/projects/",
            status_code=201,
            message="Project uploaded",
            project_name="Test Project",
        )

        response = self.client.get(self.admin_reports_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("stats", response.data)
        self.assertIn("logs", response.data)
        self.assertEqual(response.data["stats"]["project_uploads"], 1)

    # =========================
    # TOGGLE USER STATUS
    # =========================

    def test_admin_can_toggle_user_status(self):
        self.authenticate_admin()

        response = self.client.patch(
            f"/api/projects/users/{self.user.id}/toggle-status/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User status updated successfully.")

        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

    def test_admin_cannot_disable_superuser(self):
        self.authenticate_admin()

        response = self.client.patch(
            f"/api/projects/users/{self.admin.id}/toggle-status/"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "You cannot disable a superuser.")
