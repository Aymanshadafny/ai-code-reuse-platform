import os
import zipfile
import tempfile
from collections import Counter


CODE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".cs",
    ".cpp",
    ".c",
    ".h",
    ".html",
    ".css",
    ".php",
    ".rb",
    ".go",
}


IGNORE_DIRS = {
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    ".git",
    "dist",
    "build",
    ".idea",
    ".vscode",
}


def is_code_file(filename):
    _, ext = os.path.splitext(filename)
    return ext.lower() in CODE_EXTENSIONS


def analyze_zip_project(zip_path):
    total_files = 0
    total_lines = 0
    all_lines = []

    with tempfile.TemporaryDirectory() as temp_dir:
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)

        for root, dirs, files in os.walk(temp_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file_name in files:
                if not is_code_file(file_name):
                    continue

                file_path = os.path.join(root, file_name)
                total_files += 1

                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()

                    clean_lines = [line.strip() for line in lines if line.strip()]

                    total_lines += len(clean_lines)
                    all_lines.extend(clean_lines)

                except Exception:
                    continue

    line_counts = Counter(all_lines)

    duplicate_lines = sum(count - 1 for count in line_counts.values() if count > 1)

    duplication_percentage = 0
    if total_lines > 0:
        duplication_percentage = round((duplicate_lines / total_lines) * 100, 2)

    return {
        "total_files": total_files,
        "total_lines": total_lines,
        "duplicate_lines": duplicate_lines,
        "duplication_percentage": duplication_percentage,
    }
