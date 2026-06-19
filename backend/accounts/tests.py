from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from django.core import mail
from rest_framework.test import APIClient
from rest_framework import status

from .models import Profile, PasswordResetOTP


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="AI Code Reuse Platform <noreply@aicodereuse.com>",
)
class AccountsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.me_url = "/api/auth/me/"
        self.send_otp_url = "/api/auth/send-otp/"
        self.verify_otp_url = "/api/auth/verify-otp/"
        self.reset_password_url = "/api/auth/reset-password-otp/"

        self.user = User.objects.create_user(
            username="student1",
            email="student1@gmail.com",
            password="oldpass123",
            first_name="Student",
            last_name="One",
        )

    # =========================
    # REGISTER TESTS
    # =========================

    def test_register_user_success(self):
        data = {
            "username": "student2",
            "email": "student2@gmail.com",
            "password": "testpass123",
            "first_name": "Student",
            "last_name": "Two",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User created")
        self.assertEqual(response.data["role"], "STUDENT")
        self.assertTrue(User.objects.filter(username="student2").exists())

    def test_register_creates_profile_with_student_role(self):
        data = {
            "username": "student3",
            "email": "student3@gmail.com",
            "password": "testpass123",
            "first_name": "Student",
            "last_name": "Three",
        }

        response = self.client.post(self.register_url, data, format="json")

        user = User.objects.get(username="student3")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Profile.objects.filter(user=user).exists())
        self.assertEqual(user.profile.role, "STUDENT")

    def test_register_missing_fields(self):
        data = {
            "username": "",
            "email": "missing@gmail.com",
            "password": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Missing fields")

    def test_register_duplicate_username(self):
        data = {
            "username": "student1",
            "email": "newemail@gmail.com",
            "password": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Username already exists")

    def test_register_duplicate_email(self):
        data = {
            "username": "newstudent",
            "email": "student1@gmail.com",
            "password": "testpass123",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Email already exists")

    # =========================
    # LOGIN TESTS
    # =========================

    def test_login_with_username_success(self):
        data = {
            "username": "student1",
            "password": "oldpass123",
        }

        response = self.client.post(self.login_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["username"], "student1")
        self.assertEqual(response.data["email"], "student1@gmail.com")
        self.assertEqual(response.data["role"], "STUDENT")

    def test_login_with_email_success(self):
        data = {
            "username": "student1@gmail.com",
            "password": "oldpass123",
        }

        response = self.client.post(self.login_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["username"], "student1")
        self.assertEqual(response.data["email"], "student1@gmail.com")
        self.assertEqual(response.data["role"], "STUDENT")

    def test_login_wrong_password_fails(self):
        data = {
            "username": "student1",
            "password": "wrongpass123",
        }

        response = self.client.post(self.login_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # =========================
    # ME API TESTS
    # =========================

    def test_me_authenticated_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "student1")
        self.assertEqual(response.data["email"], "student1@gmail.com")
        self.assertEqual(response.data["role"], "STUDENT")

    def test_me_without_login_fails(self):
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # =========================
    # OTP SEND TESTS
    # =========================

    def test_send_otp_success(self):
        data = {
            "email": "student1@gmail.com",
        }

        response = self.client.post(self.send_otp_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"],
            "If this email exists, OTP has been sent.",
        )

        self.assertTrue(
            PasswordResetOTP.objects.filter(user=self.user, is_used=False).exists()
        )

        otp_obj = PasswordResetOTP.objects.filter(user=self.user).latest("created_at")
        self.assertEqual(len(otp_obj.otp), 6)
        self.assertTrue(otp_obj.otp.isdigit())

        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Your Password Reset OTP", mail.outbox[0].subject)
        self.assertIn(otp_obj.otp, mail.outbox[0].body)

    def test_send_otp_unknown_email_still_returns_success(self):
        data = {
            "email": "unknown@gmail.com",
        }

        response = self.client.post(self.send_otp_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"],
            "If this email exists, OTP has been sent.",
        )

        self.assertEqual(len(mail.outbox), 0)

    def test_send_otp_missing_email_fails(self):
        data = {
            "email": "",
        }

        response = self.client.post(self.send_otp_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # =========================
    # OTP VERIFY TESTS
    # =========================

    def test_verify_otp_success(self):
        otp_obj = PasswordResetOTP.objects.create(
            user=self.user,
            otp="123456",
        )

        data = {
            "email": "student1@gmail.com",
            "otp": otp_obj.otp,
        }

        response = self.client.post(self.verify_otp_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "OTP verified successfully")

    def test_verify_wrong_otp_fails(self):
        PasswordResetOTP.objects.create(
            user=self.user,
            otp="123456",
        )

        data = {
            "email": "student1@gmail.com",
            "otp": "999999",
        }

        response = self.client.post(self.verify_otp_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # =========================
    # RESET PASSWORD TESTS
    # =========================

    def test_reset_password_success(self):
        otp_obj = PasswordResetOTP.objects.create(
            user=self.user,
            otp="123456",
        )

        data = {
            "email": "student1@gmail.com",
            "otp": otp_obj.otp,
            "new_password": "newpass123",
            "confirm_password": "newpass123",
        }

        response = self.client.post(self.reset_password_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"],
            "Password reset successful. Please login with your new password.",
        )

        self.user.refresh_from_db()
        otp_obj.refresh_from_db()

        self.assertTrue(self.user.check_password("newpass123"))
        self.assertTrue(otp_obj.is_used)

    def test_reset_password_mismatch_fails(self):
        otp_obj = PasswordResetOTP.objects.create(
            user=self.user,
            otp="123456",
        )

        data = {
            "email": "student1@gmail.com",
            "otp": otp_obj.otp,
            "new_password": "newpass123",
            "confirm_password": "different123",
        }

        response = self.client.post(self.reset_password_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("oldpass123"))

    def test_reset_password_wrong_otp_fails(self):
        PasswordResetOTP.objects.create(
            user=self.user,
            otp="123456",
        )

        data = {
            "email": "student1@gmail.com",
            "otp": "999999",
            "new_password": "newpass123",
            "confirm_password": "newpass123",
        }

        response = self.client.post(self.reset_password_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("oldpass123"))

    def test_reset_password_used_otp_fails(self):
        PasswordResetOTP.objects.create(
            user=self.user,
            otp="123456",
            is_used=True,
        )

        data = {
            "email": "student1@gmail.com",
            "otp": "123456",
            "new_password": "newpass123",
            "confirm_password": "newpass123",
        }

        response = self.client.post(self.reset_password_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("oldpass123"))
