from django.urls import path
from .views import (
    FixTaskCodeView,
    ProjectFileView,
    ProjectListCreateView,
    ProjectDetailView,
    TaskListCreateView,
    AnalyzeProjectView,
    ProjectAnalysisView,
    AdminUsersView,
    AdminDashboardView,
    ProjectDeleteView,
    TaskDetailView,
    TaskDeleteView,
    AnalyzeTaskView,
    ToggleUserStatusView,
    ProjectFileDownloadView,
    AdminReportsView,
)

urlpatterns = [
    path("", ProjectListCreateView.as_view()),
    path("<int:pk>/", ProjectDetailView.as_view()),
    path("<int:project_id>/tasks/", TaskListCreateView.as_view()),
    path("<int:project_id>/tasks/<int:task_id>/", TaskDetailView.as_view()),
    path("<int:project_id>/tasks/<int:task_id>/delete/", TaskDeleteView.as_view()),
    path("<int:project_id>/tasks/<int:task_id>/analyze/", AnalyzeTaskView.as_view()),
    path("<int:project_id>/tasks/<int:task_id>/fix/", FixTaskCodeView.as_view()),
    path("<int:pk>/analyze/", AnalyzeProjectView.as_view()),
    path("<int:pk>/analysis/", ProjectAnalysisView.as_view()),
    path("<int:pk>/file/", ProjectFileView.as_view()),
    path("<int:pk>/file/download/", ProjectFileDownloadView.as_view()),
    # 🔥 ADMIN ROUTES
    path("admin/users/", AdminUsersView.as_view()),
    path("admin/dashboard/", AdminDashboardView.as_view()),
    path("admin/reports/", AdminReportsView.as_view()),
    path("<int:pk>/delete/", ProjectDeleteView.as_view()),
    path("users/<int:user_id>/toggle-status/", ToggleUserStatusView.as_view()),
]
