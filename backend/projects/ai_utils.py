import zipfile
from pathlib import Path
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_code_sample_from_zip(zip_path, max_chars=12000):
    code_extensions = [
        ".py",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".java",
        ".cs",
        ".cpp",
        ".c",
        ".html",
        ".css",
    ]

    collected_code = ""

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        for file_name in zip_ref.namelist():
            if file_name.endswith("/"):
                continue

            ext = Path(file_name).suffix.lower()

            if ext not in code_extensions:
                continue

            try:
                content = zip_ref.read(file_name).decode("utf-8", errors="ignore")
            except:
                continue

            collected_code += f"\n\n--- FILE: {file_name} ---\n"
            collected_code += content[:3000]

            if len(collected_code) >= max_chars:
                break

    return collected_code[:max_chars]


def analyze_code_with_openai(zip_path):
    code_sample = get_code_sample_from_zip(zip_path)

    if not code_sample.strip():
        return "No readable code files found."

    prompt = f"""
You are a senior software engineer analyzing a real-world project for code reuse.

IMPORTANT RULES:
- Ignore common patterns like:
  imports, annotations, getters/setters, simple variable declarations
- Focus ONLY on meaningful logic duplication
- Be specific to THIS project (mention file names)

Analyze and return:

### 1. REAL Duplicate Logic (IMPORTANT)
Find repeated logic patterns (not small lines)
Example:
- similar validation logic
- repeated try-catch blocks
- repeated API handling

### 2. Reusable Components
Identify functions/classes that can be reused

### 3. Refactoring Suggestions
Give real improvements based on THIS code

### 4. Improved Code Example (VERY IMPORTANT)
Show 1 clean reusable function from this project

### 5. Simple Summary
Explain in 2–3 lines what to improve

CODE:
{code_sample}
"""

    response = client.responses.create(
        model="gpt-4o-mini",  # ✅ safer model
        input=prompt,
    )

    return response.output_text


def analyze_task_with_openai(task_name, description, code_snippet):
    prompt = f"""
You are an AI Code Reuse Expert.

Analyze this task:

Task Name:
{task_name}

Description:
{description}

Code:
{code_snippet}

IMPORTANT:
- Ignore small syntax duplication
- Focus on logic reuse

Return:

### 1. Repeated Logic
(real duplication, not small lines)

### 2. Reuse Opportunities
(where we can create reusable functions)

### 3. Refactoring Plan
(step by step improvement)

### 4. Improved Code Example
(show better version)

### 5. Simple Summary
"""

    response = client.responses.create(
        model="gpt-4o-mini",
        input=prompt,
    )

    return response.output_text


def fix_code_with_ai(code_snippet):
    prompt = f"""
You are an expert software engineer.

Fix and improve this code with focus on:
- removing duplication
- improving structure
- making reusable functions
{code_snippet}

Return:
- Clean improved version
- Use best practices
- Make reusable functions
"""

    response = client.responses.create(
        model="gpt-4o-mini",
        input=prompt,
    )

    return response.output_text
