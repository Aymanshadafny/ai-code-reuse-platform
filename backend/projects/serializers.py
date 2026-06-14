from rest_framework import serializers
from .models import Project, Task, AnalysisResult, ActivityLog

class ProjectSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    total_files = serializers.SerializerMethodField()
    total_lines = serializers.SerializerMethodField()
    duplicate_lines = serializers.SerializerMethodField()
    duplication_percentage = serializers.SerializerMethodField()
    experiments_count = serializers.SerializerMethodField()
    has_analysis = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "file",
            "created_at",
            "user",
            # Dashboard extra fields
            "total_files",
            "total_lines",
            "duplicate_lines",
            "duplication_percentage",
            "experiments_count",
            "has_analysis",
        ]

    def get_latest_analysis(self, obj):
        try:
            return AnalysisResult.objects.filter(project=obj).order_by("-id").first()
        except Exception:
            return None

    def get_total_files(self, obj):
        analysis = self.get_latest_analysis(obj)

        if not analysis:
            return 0

        return getattr(analysis, "total_files", 0) or 0

    def get_total_lines(self, obj):
        analysis = self.get_latest_analysis(obj)

        if not analysis:
            return 0

        return getattr(analysis, "total_lines", 0) or 0

    def get_duplicate_lines(self, obj):
        analysis = self.get_latest_analysis(obj)

        if not analysis:
            return 0

        return getattr(analysis, "duplicate_lines", 0) or 0

    def get_duplication_percentage(self, obj):
        analysis = self.get_latest_analysis(obj)

        if not analysis:
            return 0

        return getattr(analysis, "duplication_percentage", 0) or 0

    def get_experiments_count(self, obj):
        try:
            return Task.objects.filter(project=obj).count()
        except Exception:
            return 0

    def get_has_analysis(self, obj):
        analysis = self.get_latest_analysis(obj)
        return analysis is not None


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "description",
            "code_snippet",
            "ai_response",
            "created_at",
        ]


class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = "__all__"


class ActivityLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "user",
            "action",
            "method",
            "path",
            "status_code",
            "message",
            "project_name",
            "created_at",
        ]
