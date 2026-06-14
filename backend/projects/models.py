from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="projects/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    code_snippet = models.TextField(blank=True)
    ai_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class AnalysisResult(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="analysis_results"
    )
    total_files = models.IntegerField(default=0)
    total_lines = models.IntegerField(default=0)
    duplicate_lines = models.IntegerField(default=0)
    duplicate_percentage = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    ai_suggestions = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Analysis for {self.project.name}"


class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ("PROJECT_UPLOADED", "Project Uploaded"),
        ("PROJECT_DELETED", "Project Deleted"),
        ("PROJECT_ANALYZED", "Project Analyzed"),
        ("TASK_CREATED", "Task Created"),
        ("TASK_ANALYZED", "Task Analyzed"),
        ("CODE_FIXED", "Code Fixed"),
        ("FILE_OPENED", "File Opened"),
        ("FILE_DOWNLOADED", "File Downloaded"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activity_logs",
    )

    action = models.CharField(max_length=100, choices=ACTION_CHOICES)
    method = models.CharField(max_length=10, blank=True)
    path = models.TextField(blank=True)
    status_code = models.IntegerField(default=200)
    message = models.TextField(blank=True)
    project_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.username if self.user else "Unknown"
        return f"{username} - {self.action}"
