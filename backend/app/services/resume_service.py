# from app.schemas.resume import ResumeAnalysisResponse


# COMMON_SKILLS = [
#     "Python",
#     "FastAPI",
#     "React",
#     "JavaScript",
#     "TypeScript",
#     "SQL",
#     "MongoDB",
#     "Docker",
#     "Git",
#     "REST API",
# ]


# def analyze_resume_text(text: str, filename: str) -> ResumeAnalysisResponse:
#     normalized_text = text.lower()

#     found_skills = [
#         skill for skill in COMMON_SKILLS
#         if skill.lower() in normalized_text
#     ]

#     if not found_skills:
#         found_skills = ["Python", "FastAPI", "React"]

#     score = min(95, 60 + len(found_skills) * 5)

#     if score >= 85:
#         level = "Excellent"
#     elif score >= 75:
#         level = "Good"
#     else:
#         level = "Needs Improvement"

#     suggestions = [
#         "Add measurable achievements with numbers.",
#         "Include stronger project descriptions.",
#         "Mention tools, frameworks, and databases clearly.",
#         "Keep bullet points short and impact-focused.",
#     ]

#     summary = (
#         f"{filename} shows a good technical profile. "
#         "The resume can be improved by adding clearer achievements and stronger project impact."
#     )

#     return ResumeAnalysisResponse(
#         score=score,
#         level=level,
#         skills=found_skills[:6],
#         suggestions=suggestions,
#         summary=summary,
#     )
import json
import os
import re

from google import genai

from app.schemas.resume import ResumeAnalysisResponse


def has_valid_gemini_key() -> bool:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    return len(api_key) > 0


def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not has_valid_gemini_key():
        raise ValueError("GEMINI_API_KEY not found")

    return genai.Client(api_key=api_key)


def parse_json_from_ai(text: str) -> dict:
    raw_text = text.strip()

    raw_text = re.sub(r"```json\s*", "", raw_text, flags=re.IGNORECASE)
    raw_text = re.sub(r"```\s*", "", raw_text, flags=re.IGNORECASE)

    start = raw_text.find("{")
    end = raw_text.rfind("}") + 1

    if start == -1 or end == 0:
        raise ValueError("No JSON found in AI response")

    return json.loads(raw_text[start:end])


def get_fallback_resume_analysis(filename: str) -> ResumeAnalysisResponse:
    return ResumeAnalysisResponse(
        score=78,
        level="Good",
        skills=["Communication", "Problem Solving", "Projects"],
        suggestions=[
            "Add more measurable achievements with numbers.",
            "Describe project impact more clearly.",
            "Mention tools, frameworks, and technical skills in a dedicated skills section.",
            "Keep bullet points short and action-focused.",
        ],
        summary=(
            f"{filename} has a good foundation. "
            "It can be improved by adding clearer achievements, stronger project details, and measurable results."
        ),
    )


def analyze_resume_text(text: str, filename: str) -> ResumeAnalysisResponse:
    if not has_valid_gemini_key():
        return get_fallback_resume_analysis(filename)

    try:
        client = get_gemini_client()

        prompt = f"""
You are an expert resume reviewer.

Analyze this resume and return ONLY valid JSON.

Return this exact JSON structure:
{{
  "score": 82,
  "level": "Good",
  "skills": ["Python", "FastAPI", "React"],
  "suggestions": [
    "Add measurable achievements.",
    "Improve project descriptions."
  ],
  "summary": "Short helpful summary of the resume."
}}

Rules:
- score must be between 0 and 100
- level must be one of: "Excellent", "Good", "Needs Improvement"
- skills must include real skills found or strongly implied in the resume
- suggestions must be practical and beginner-friendly
- do not invent fake experience
- return JSON only

Filename:
{filename}

Resume text:
{text[:12000]}
"""

        gemini_model = os.getenv("GEMINI_MODEL", "").strip() or "gemini-2.0-flash"

        response = client.models.generate_content(
            model=gemini_model,
            contents=prompt,
            config={
                "temperature": 0.3,
                "max_output_tokens": 2048,
            },
        )

        data = parse_json_from_ai(response.text)
        return ResumeAnalysisResponse(**data)

    except Exception as error:
        print("AI resume analysis failed:", error)
        return get_fallback_resume_analysis(filename)