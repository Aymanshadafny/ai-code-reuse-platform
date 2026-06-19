from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    ContactMessageView,
    ProfileImageUploadView,
    RegisterView,
    MeView,
    EmailOrUsernameLoginView,
    SendOTPView,
    UpdateProfileView,
    VerifyOTPView,
    ResetPasswordOTPView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", EmailOrUsernameLoginView.as_view(), name="login"),
    path("contact/", ContactMessageView.as_view(), name="contact-message"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("profile/update/", UpdateProfileView.as_view(), name="profile-update"),
    path("password/change/", ChangePasswordView.as_view(), name="password-change"),
    path("profile/image/", ProfileImageUploadView.as_view(), name="profile-image"),
    path(
        "reset-password-otp/", ResetPasswordOTPView.as_view(), name="reset-password-otp"
    ),
]
