"""
Project Service with Gemini AI integration
Teaches: API integration, error handling, JSON parsing
"""

import json
import os
import re
from typing import Dict, Any
from app.schemas.project import ProjectResponse
from app.services.prompt_generator import generate_project_prompt
from google import genai


def has_valid_gemini_key() -> bool:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    # Accept any non-empty API key rather than relying on a specific prefix
    return len(api_key) > 0


# Configure Gemini API
# def get_gemini_client():
#     """Initialize Gemini API with configuration"""
#     api_key = os.getenv("GEMINI_API_KEY", "").strip()
#     if not has_valid_gemini_key():
#         raise ValueError("GEMINI_API_KEY not found in environment variables")
#     genai.configure(api_key=api_key)
#     return genai

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not has_valid_gemini_key():
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    return genai.Client(api_key=api_key)



def get_fallback_project(role: str, experience: str) -> ProjectResponse:
    normalized_role = role.lower()

    if "frontend" in normalized_role:
        sample = {
            "project_name": "Interactive Component Playground",
            "description": "A frontend-focused application for building, previewing, and organizing reusable UI components. It helps practice React component architecture, state management, responsive layouts, accessibility, and polished user interactions without requiring a backend.",
            "difficulty": experience,
            "tech_stack": ["React", "TypeScript", "Vite", "Tailwind CSS", "Vitest"],
            "features": [
                "Component gallery with searchable cards and category filters",
                "Live preview panel for editing component props and visual states",
                "Theme switcher with light, dark, and custom accent color modes",
                "Responsive layout with keyboard-friendly navigation and accessible controls"
            ],
            "database_schema": [],
            "api_endpoints": [],
            "tasks": [
                "Set up the Vite React TypeScript project with Tailwind CSS",
                "Create reusable layout, button, input, card, and modal components",
                "Build the component gallery with filtering and local state",
                "Add the live preview panel and theme controls",
                "Write component tests for key interactions and accessibility behavior",
                "Deploy the app and document the component system in the README"
            ],
            "resume_bullets": [
                "Built an interactive React component playground with TypeScript, Vite, and Tailwind CSS.",
                "Implemented searchable component previews with editable props, local state, and responsive layouts.",
                "Improved frontend reliability by adding component tests for core UI interactions.",
                "Designed accessible keyboard-friendly controls and theme switching for a polished user experience."
            ]
        }
        return ProjectResponse(**sample)

    if "backend" in normalized_role:
        sample = {
            "project_name": "Job Application Tracker API",
            "description": "A backend API for tracking job applications, interview stages, reminders, and notes. It focuses on database modeling, REST API design, validation, authentication, and production-ready backend structure.",
            "difficulty": experience,
            "tech_stack": ["FastAPI", "PostgreSQL", "SQLAlchemy", "Redis", "Docker"],
            "features": [
                "REST endpoints for managing companies, applications, interview stages, and notes",
                "JWT authentication for protecting user-specific application data",
                "Filtering and sorting by status, company, date, and priority",
                "Background reminder workflow for follow-ups and interview preparation"
            ],
            "database_schema": [
                {
                    "table_name": "applications",
                    "description": "Stores job application records and current pipeline status",
                    "fields": [
                        {"name": "id", "type": "UUID", "constraints": "PRIMARY KEY"},
                        {"name": "company_name", "type": "VARCHAR(255)", "constraints": "NOT NULL"},
                        {"name": "role_title", "type": "VARCHAR(255)", "constraints": "NOT NULL"},
                        {"name": "status", "type": "VARCHAR(50)", "constraints": "NOT NULL"}
                    ]
                },
                {
                    "table_name": "interview_notes",
                    "description": "Stores notes and preparation details for interviews",
                    "fields": [
                        {"name": "id", "type": "UUID", "constraints": "PRIMARY KEY"},
                        {"name": "application_id", "type": "UUID", "constraints": "FOREIGN KEY REFERENCES applications(id)"},
                        {"name": "note", "type": "TEXT", "constraints": "NOT NULL"}
                    ]
                }
            ],
            "api_endpoints": [
                {
                    "method": "GET",
                    "path": "/api/applications",
                    "description": "List applications with filtering and sorting",
                    "request_body": {},
                    "response": {"applications": "array"}
                },
                {
                    "method": "POST",
                    "path": "/api/applications",
                    "description": "Create a tracked job application",
                    "request_body": {"company_name": "string", "role_title": "string", "status": "string"},
                    "response": {"id": "uuid", "company_name": "string", "role_title": "string"}
                }
            ],
            "tasks": [
                "Set up FastAPI, SQLAlchemy, PostgreSQL, and Docker",
                "Design the application and interview notes database models",
                "Build validated REST endpoints for application tracking",
                "Add authentication and user-specific data access",
                "Write API tests for success and error cases",
                "Document the API and deployment steps"
            ],
            "resume_bullets": [
                "Built a FastAPI job application tracking API with PostgreSQL and SQLAlchemy.",
                "Designed relational models for applications, interview notes, and pipeline status changes.",
                "Implemented validated REST endpoints with authentication and user-specific data access.",
                "Added API tests and Docker-based setup documentation for local development."
            ]
        }
        return ProjectResponse(**sample)

    sample = {
        "project_name": f"Starter {role} Project",
        "description": "A compact, buildable project tailored to the selected role that practices core skills and demonstrates fundamentals.",
        "difficulty": experience,
        "tech_stack": ["React", "TypeScript", "FastAPI", "PostgreSQL"],
        "features": [
            "Role-relevant core workflow",
            "Clean data flow between major parts of the app",
            "Search, filtering, or organization feature",
            "Testing and deployment-ready documentation"
        ],
        "database_schema": [],
        "api_endpoints": [],
        "tasks": [
            "Set up the project structure and tooling",
            "Build the first role-relevant core feature",
            "Build the second role-relevant core feature",
            "Add testing and validation",
            "Deploy the project and document usage"
        ],
        "resume_bullets": [
            f"Built a role-focused {role} project using a practical modern tech stack.",
            "Implemented concrete project features with clear user or technical value.",
            "Added testing, documentation, and deployment preparation for a portfolio-ready result."
        ]
    }

    return ProjectResponse(**sample)


def get_available_models(client) -> list:
    """
    Discover models available for generateContent from the Gemini API.
    Returns list of model names that support generateContent.
    """
    try:
        print("Discovering available Gemini models...")
        available = []
        for model in client.models.list():
            available.append(model.name)
            print(f"  Found: {model.name}")
        return available
    except Exception as e:
        print(f"Error listing models: {e}")
        return []


def generate_project(role: str, experience: str) -> ProjectResponse:
    print("Has valid Gemini key:", has_valid_gemini_key())
    """
    Generate a detailed project using Google's Gemini API.
    Falls back to local sample data if Gemini is unavailable.
    """
    if not has_valid_gemini_key():
        return get_fallback_project(role, experience)

    try:
        # Step 1: Initialize Gemini
        client = get_gemini_client()

        # Step 2: Generate the prompt
        prompt = generate_project_prompt(role, experience)

        # Step 3: Get available models or use explicitly set one
        gemini_model = os.getenv("GEMINI_MODEL", "").strip()
        
        if not gemini_model:
            # Auto-discover available models
            available_models = get_available_models(client)
            if not available_models:
                print("No available models found. Using fallback project.")
                return get_fallback_project(role, experience)
            gemini_model = available_models[0]
            print(f"Selected first available model: {gemini_model}")
        else:
            print(f"Using GEMINI_MODEL from env: {gemini_model}")

        # Step 4: Call Gemini API
        response = client.models.generate_content(
            model=gemini_model,
            contents=prompt,
            config={
                "temperature": 0.7,
                "top_p": 0.95,
                "max_output_tokens": 8192,
            },
        )

        # Step 5: Extract the response text
        response_text = response.text
        print("Gemini raw response:", response_text)

        # Step 6: Parse JSON from response
        project_data = parse_json_from_response(response_text)

        # Step 7: Validate and return as Pydantic model
        return ProjectResponse(**project_data)

    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse project response: {str(e)}")
    except Exception as e:
        msg = str(e)
        if "quota" in msg.lower():
            print(f"Gemini quota error: You've exceeded your API quota. {e}")
        elif "not found" in msg.lower() or "not supported" in msg.lower():
            print(f"Gemini model error: {e}")
        else:
            print(f"Gemini failed: {e}")
        raise RuntimeError("Failed to generate project. Please try again.") from e


def parse_json_from_response(text: str) -> Dict[str, Any]:
    """
    Extract JSON from Gemini response (may contain extra text)
    
    Learning Point: Real-world APIs often need data cleaning
    """

    raw_text = text.strip()
    print(f"DEBUG - Original response length: {len(raw_text)} chars")
    print(f"DEBUG - First 200 chars: {raw_text[:200]}")

    # Remove markdown fences
    raw_text = re.sub(r'```json\s*', '', raw_text, flags=re.IGNORECASE)
    raw_text = re.sub(r'```\s*', '', raw_text, flags=re.IGNORECASE)

    # Remove common prefixes that Gemini might add
    prefixes = [
        r"^(?:here is|here's|sure|okay|sure!|sure\s*!|here you go|here's the|let me|i'll|perfect|absolutely)[:\s]*",
        r"^[^{]*?(?:json|object|project):\s*",
        r"^[^{]*?(?:here's|here is)[:\s]*",
    ]
    
    for prefix in prefixes:
        raw_text = re.sub(prefix, '', raw_text, flags=re.IGNORECASE)
    
    raw_text = raw_text.strip()
    print(f"DEBUG - After cleanup: {raw_text[:200]}")

    # Find first JSON object or array
    start_idx = raw_text.find('{')
    end_idx = raw_text.rfind('}') + 1

    if start_idx == -1:
        print(f"DEBUG - No opening brace found. Full response: {raw_text}")
        raise ValueError("No JSON found in response - no opening brace '{'")
    
    if end_idx == 0 or start_idx >= end_idx:
        print(f"DEBUG - Invalid JSON boundaries. Start: {start_idx}, End: {end_idx}")
        raise ValueError("No JSON found in response - invalid JSON structure")

    json_str = raw_text[start_idx:end_idx]
    print(f"DEBUG - Extracted JSON length: {len(json_str)} chars")

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"DEBUG - First parse attempt failed: {str(e)}")
        # Attempt to clean up extra trailing characters
        cleaned = json_str.rstrip("\n \t\r,")
        try:
            print(f"DEBUG - Trying cleaned version...")
            return json.loads(cleaned)
        except json.JSONDecodeError as e2:
            print(f"DEBUG - Failed to parse JSON: {json_str[:500]}...")
            raise ValueError(f"Invalid JSON in response: {str(e2)}")
