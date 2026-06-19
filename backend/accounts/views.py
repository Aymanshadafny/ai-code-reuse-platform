from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView

import random

from .models import PasswordResetOTP
from .serializers import (
    EmailOrUsernameTokenObtainPairSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    ResetPasswordOTPSerializer,
)


class EmailOrUsernameLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        confirm_password = request.data.get("confirm_password", "").strip()
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()

        if not username or not email or not password or not confirm_password:
            return Response(
                {"error": "All required fields are missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != confirm_password:
            return Response(
                {"error": "Password and confirm password do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username__iexact=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        send_mail(
            subject="Welcome to AI Code Reuse Platform",
            message=(
                f"Hello {user.first_name or user.username},\n\n"
                f"Your account has been created successfully.\n\n"
                f"You registered with this email: {user.email}\n\n"
                f"You can now login and start using AI Code Reuse Platform.\n\n"
                f"Thank you!"
            ),
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "User created successfully. Welcome email sent.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": (
                        user.profile.role if hasattr(user, "profile") else "student"
                    ),
                    "image": (
                        request.build_absolute_uri(user.profile.image.url)
                        if hasattr(user, "profile") and user.profile.image
                        else None
                    ),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        image_url = None

        if hasattr(user, "profile") and user.profile.image:
            image_url = request.build_absolute_uri(user.profile.image.url)

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.profile.role if hasattr(user, "profile") else "student",
                "image": image_url,
            },
            status=status.HTTP_200_OK,
        )


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If this email exists, OTP has been sent."},
                status=status.HTTP_200_OK,
            )

        otp = str(random.randint(100000, 999999))

        PasswordResetOTP.objects.filter(
            user=user,
            is_used=False,
        ).update(is_used=True)

        PasswordResetOTP.objects.create(
            user=user,
            otp=otp,
        )

        send_mail(
            subject="Your Password Reset OTP",
            message=(
                f"Your password reset OTP is: {otp}\n\n"
                f"This OTP will expire in 10 minutes."
            ),
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {"message": "If this email exists, OTP has been sent."},
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "OTP verified successfully"},
            status=status.HTTP_200_OK,
        )


class ResetPasswordOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordOTPSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        otp_obj = serializer.validated_data["otp_obj"]
        new_password = serializer.validated_data["new_password"]

        user.set_password(new_password)
        user.save()

        otp_obj.is_used = True
        otp_obj.save()

        return Response(
            {
                "message": "Password reset successful. Please login with your new password."
            },
            status=status.HTTP_200_OK,
        )


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        username = request.data.get("username")
        email = request.data.get("email")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")

        if username:
            if (
                User.objects.filter(username__iexact=username)
                .exclude(id=user.id)
                .exists()
            ):
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.username = username

        if email:
            if User.objects.filter(email__iexact=email).exclude(id=user.id).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.email = email

        if first_name is not None:
            user.first_name = first_name

        if last_name is not None:
            user.last_name = last_name

        user.save()

        image_url = None
        if hasattr(user, "profile") and user.profile.image:
            image_url = request.build_absolute_uri(user.profile.image.url)

        return Response(
            {
                "message": "Profile updated successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": (
                        user.profile.role if hasattr(user, "profile") else "student"
                    ),
                    "image": image_url,
                },
            },
            status=status.HTTP_200_OK,
        )


class ProfileImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        image = request.FILES.get("image")

        if not image:
            return Response(
                {"error": "No image file provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not image.content_type.startswith("image/"):
            return Response(
                {"error": "Please upload a valid image file"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile = request.user.profile
        profile.image = image
        profile.save()

        image_url = request.build_absolute_uri(profile.image.url)

        return Response(
            {
                "message": "Profile image updated successfully",
                "image": image_url,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name,
                    "role": profile.role,
                    "image": image_url,
                },
            },
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not old_password or not new_password or not confirm_password:
            return Response(
                {"error": "All password fields are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"error": "New password and confirm password do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK,
        )


class ContactMessageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()
        email = request.data.get("email", "").strip()
        subject = request.data.get("subject", "").strip()
        message = request.data.get("message", "").strip()

        if not first_name or not last_name or not email or not subject or not message:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        full_name = f"{first_name} {last_name}"

        admin_subject = f"New Contact Message: {subject}"

        admin_message = (
            f"You received a new contact message from AI Code Reuse Platform.\n\n"
            f"Name: {full_name}\n"
            f"Email: {email}\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message}"
        )

        send_mail(
            subject=admin_subject,
            message=admin_message,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
            recipient_list=[getattr(settings, "ADMIN_EMAIL", settings.EMAIL_HOST_USER)],
            fail_silently=False,
        )

        return Response(
            {"message": "Message sent successfully"},
            status=status.HTTP_200_OK,
        )
