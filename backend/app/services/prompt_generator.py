"""
Prompt Engineering Module for Gemini
Teaches: How to structure effective prompts for AI models
"""


def _role_guidance(role: str) -> str:
    normalized_role = role.lower()

    if "frontend" in normalized_role:
        return """
Role-specific guidance for Frontend Developer:
- Generate a frontend-focused project with strong UI, state management, accessibility, responsive design, and component architecture.
- Prefer React, TypeScript, Vite, Tailwind CSS, component libraries, browser APIs, testing tools, and deployment.
- Avoid backend APIs, authentication, and databases unless they are clearly necessary for the project idea.
- If no backend is needed, set "api_endpoints" to [] and "database_schema" to [].
- Use client-side storage, mock data, static JSON, or public APIs when appropriate.
"""

    if "backend" in normalized_role:
        return """
Role-specific guidance for Backend Developer:
- Generate a backend API project with data modeling, REST or GraphQL endpoints, validation, background jobs, caching, observability, and deployment.
- Prefer FastAPI, Node.js/Express, Spring Boot, PostgreSQL, Redis, Docker, message queues, and API testing.
- Include authentication only when it naturally fits the product.
- Include database tables only when persistent data is required.
- Keep frontend work minimal or omit it entirely.
"""

    if "full" in normalized_role and "stack" in normalized_role:
        return """
Role-specific guidance for Full Stack Developer:
- Generate a balanced project with frontend screens, backend APIs, database design, and deployment workflow.
- Prefer React or Next.js, TypeScript, Tailwind CSS, FastAPI or Node.js, PostgreSQL, Docker, and testing.
- Include authentication only when it improves the project concept.
- Make the frontend and backend features connect through realistic user flows.
"""

    if any(keyword in normalized_role for keyword in ["ai", "ml", "machine learning", "data scientist"]):
        return """
Role-specific guidance for AI/ML Engineer:
- Generate an AI-powered application with data processing, model inference, evaluation, and a usable interface or API.
- Prefer Python, pandas, scikit-learn, PyTorch or TensorFlow, FastAPI, vector databases, notebooks, and model serving.
- Include datasets, preprocessing, model evaluation, and inference tasks.
- Include APIs or databases only when needed for serving, storing predictions, or managing user inputs.
"""

    if "mobile" in normalized_role:
        return """
Role-specific guidance for Mobile Developer:
- Generate a mobile-first project with screens, navigation, local state, device APIs, offline behavior, and polished UX.
- Prefer React Native, Flutter, Kotlin, Swift, Expo, local storage, notifications, and mobile testing.
- Include backend APIs or databases only when they are essential to the app.
"""

    return """
Role-specific guidance:
- Personalize the project strongly around the selected role.
- Choose technologies, features, data storage, APIs, and tasks that fit the role instead of defaulting to a full-stack CRUD app.
- Include backend APIs, authentication, and databases only when the project genuinely needs them.
"""


def generate_project_prompt(role: str, experience: str) -> str:
    """
    Generate a detailed prompt for Gemini LLM.

    The output schema stays stable for the app, but the content should adapt
    to the selected role and experience level.
    """

    role_guidance = _role_guidance(role)

    prompt = f"""You are an expert tech mentor creating personalized portfolio projects for developers.

Generate one COMPLETE, BUILDABLE project for this profile:
- Role: {role}
- Experience level: {experience}

{role_guidance}

Experience-level guidance:
- Beginner: small scope, clear setup, common tools, simple architecture, guided tasks, no unnecessary infrastructure.
- Intermediate: production-like structure, testing, realistic integrations, moderate complexity, thoughtful tradeoffs.
- Advanced: deeper architecture, scalability, security, performance, observability, CI/CD, and deployment concerns.

Output rules:
- Return ONLY one valid JSON object.
- Do not include markdown, code blocks, greetings, explanations, or text outside the JSON.
- Keep all required top-level keys exactly as shown in the schema.
- Use [] for "database_schema" when the project does not need a database.
- Use [] for "api_endpoints" when the project does not need custom backend APIs.
- Do not force authentication, CRUD, users tables, projects tables, or databases unless they naturally fit the project.
- Do not use placeholders like [project_name], [tech_stack], [metric], or X%.
- Resume bullets must be fully written and realistic.
- Resume bullets should describe concrete technical accomplishments without inventing fake metrics.
- Make the project realistic to complete in 3-4 weeks.
- Make the project specific, not generic.

JSON schema to follow:
{{
    "project_name": "Specific project name tailored to the role",
    "description": "2-3 sentences explaining what the project does, who it helps, and why it is valuable for learning",
    "difficulty": "{experience}",
    "tech_stack": [
        "Technology appropriate for {role}",
        "Technology appropriate for {role}",
        "Technology appropriate for {role}",
        "Technology appropriate for {role}"
    ],
    "features": [
        "Specific feature with a clear user or technical purpose",
        "Specific feature with a clear user or technical purpose",
        "Specific feature with a clear user or technical purpose",
        "Specific feature with a clear user or technical purpose"
    ],
    "database_schema": [
        {{
            "table_name": "table_name_if_needed",
            "description": "Why this table exists",
            "fields": [
                {{"name": "id", "type": "INTEGER or UUID", "constraints": "PRIMARY KEY"}},
                {{"name": "field_name", "type": "DATA_TYPE", "constraints": "Relevant constraints"}}
            ]
        }}
    ],
    "api_endpoints": [
        {{
            "method": "GET",
            "path": "/api/example",
            "description": "What this endpoint does",
            "request_body": {{}},
            "response": {{"example": "shape of response"}}
        }}
    ],
    "tasks": [
        "Set up the project structure and development tooling",
        "Build the first core feature",
        "Build the second core feature",
        "Add testing and validation",
        "Polish the user experience or developer experience",
        "Deploy the project and document it"
    ],
    "resume_bullets": [
        "Built a specific project using named technologies to solve a clear problem.",
        "Implemented a concrete feature or technical workflow relevant to the selected role.",
        "Designed a practical architecture, interface, data flow, model pipeline, or deployment workflow.",
        "Added testing, accessibility, performance, security, or documentation improvements appropriate to the project."
    ]
}}

Important schema notes:
- If "database_schema" is not needed, return "database_schema": [].
- If "api_endpoints" is not needed, return "api_endpoints": [].
- If APIs are included, make them relevant to the project and role.
- If database tables are included, make them relevant to the project domain.
- For frontend-only projects, focus on screens, components, state, accessibility, animations, public APIs, browser storage, and tests.
- For backend projects, focus on endpoints, schemas, services, data persistence, background processing, auth when useful, tests, Docker, and docs.
- For AI/ML projects, focus on dataset handling, model workflow, inference, evaluation, and a useful product wrapper.

Generate the perfect project for this profile.
Return ONLY the JSON object."""

    return prompt
