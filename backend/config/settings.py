from datetime import timedelta
import os
from dotenv import load_dotenv

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()

SECRET_KEY = "django-insecure-=+#%$$(2y&gi3*yp@f!sf^0dz+&4+wdsaj3wg3ztdv1f#hsk9h"

DEBUG = True
ALLOWED_HOSTS = []

# =========================
# APPS
# =========================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 🔥 Third-party
    "rest_framework",
    "corsheaders",
    # 🔥 Your apps
    "accounts.apps.AccountsConfig",
    "projects",  # ✅ IMPORTANT (Sprint 2)
]

# =========================
# MIDDLEWARE
# =========================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# =========================
# DATABASE (PostgreSQL)
# =========================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ai_code_reuse",
        "USER": "postgres",
        "PASSWORD": "12345",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# =========================
# PASSWORD VALIDATION
# =========================
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# =========================
# INTERNATIONAL
# =========================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# =========================
# STATIC & MEDIA (VERY IMPORTANT)
# =========================
STATIC_URL = "static/"

# 🔥 FILE UPLOAD (ZIP FILES)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# =========================
# DRF + JWT
# =========================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

# =========================
# CORS
# =========================
CORS_ALLOW_ALL_ORIGINS = True


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# =========================
# EMAIL SETTINGS - GMAIL SMTP
# =========================

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = f"AI Code Reuse Platform <{EMAIL_HOST_USER}>"

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", EMAIL_HOST_USER)
