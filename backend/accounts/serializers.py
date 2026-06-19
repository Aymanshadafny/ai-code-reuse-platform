from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import PasswordResetOTP


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "username"

    def validate(self, attrs):
        login_value = attrs.get("username", "").strip()
        password = attrs.get("password", "").strip()

        if not login_value or not password:
            raise serializers.ValidationError(
                {"detail": "Username/email and password are required"}
            )

        # ✅ User can login with email or username
        if "@" in login_value:
            try:
                user_obj = User.objects.get(email__iexact=login_value)
                username = user_obj.username
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"detail": "Invalid username/email or password"}
                )
        else:
            username = login_value

        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                {"detail": "Invalid username/email or password"}
            )

        if not user.is_active:
            raise serializers.ValidationError({"detail": "User account is disabled"})

        refresh = self.get_token(user)

        # ✅ Send login notification to the user's registered email
        if user.email:
            send_mail(
                subject="New Login to Your AI Code Reuse Account",
                message=(
                    f"Hello {user.first_name or user.username},\n\n"
                    f"Your AI Code Reuse account was logged in successfully.\n\n"
                    f"Login email: {user.email}\n\n"
                    f"If this was you, no action is needed.\n"
                    f"If this was not you, please reset your password immediately.\n\n"
                    f"Thank you!"
                ),
                from_email=getattr(
                    settings,
                    "DEFAULT_FROM_EMAIL",
                    "noreply@example.com",
                ),
                recipient_list=[user.email],
                fail_silently=False,
            )

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.profile.role if hasattr(user, "profile") else "student",
        }


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid email or OTP"})

        otp_obj = (
            PasswordResetOTP.objects.filter(
                user=user,
                otp=otp,
                is_used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_obj:
            raise serializers.ValidationError({"error": "Invalid email or OTP"})

        if otp_obj.is_expired():
            raise serializers.ValidationError({"error": "OTP expired"})

        attrs["user"] = user
        attrs["otp_obj"] = otp_obj

        return attrs


class ResetPasswordOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {"error": "New password and confirm password do not match"}
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid email or OTP"})

        otp_obj = (
            PasswordResetOTP.objects.filter(
                user=user,
                otp=otp,
                is_used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_obj:
            raise serializers.ValidationError({"error": "Invalid email or OTP"})

        if otp_obj.is_expired():
            raise serializers.ValidationError({"error": "OTP expired"})

        attrs["user"] = user
        attrs["otp_obj"] = otp_obj

        return attrs
