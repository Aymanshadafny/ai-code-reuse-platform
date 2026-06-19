from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Profile(models.Model):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("admin", "Admin"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    image = models.ImageField(upload_to="images/", null=True, blank=True)

    def __str__(self):
        return self.user.username


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="password_reset_otps"
    )
    otp = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"
