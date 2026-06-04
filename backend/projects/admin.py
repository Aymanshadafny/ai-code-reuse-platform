from django.contrib import admin
from .models import Project, AnalysisResult, Task

admin.site.register(Project)
admin.site.register(AnalysisResult)
admin.site.register(Task)
