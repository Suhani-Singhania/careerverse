// services/projectService.ts
import { getToken } from "./authService";

const API_BASE_URL = "http://localhost:8000";

export interface ProjectRequest {
  role: string;
  experience: string;
}

export interface ProjectResponse {
  project_name: string;
  description: string;
  difficulty: string;
  tech_stack: string[];
  features: string[];
  database_schema: Array<{
    table_name: string;
    description?: string;
    fields: Array<{
      name: string;
      type: string;
      constraints?: string;
    }>;
  }>;
  api_endpoints: Array<{
    method: string;
    path: string;
    description: string;
    request_body: Record<string, any>;
    response: Record<string, any>;
  }>;
  tasks: string[];
  resume_bullets: string[];
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function generateProject(
  request: ProjectRequest
): Promise<ProjectResponse> {
  const response = await fetch(`${API_BASE_URL}/api/projects/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to generate project");
  }

  return response.json();
}

export interface ProjectHistoryItem {
  id: string;
  role: string;
  experience: string;
  project_name: string;
  project_data: ProjectResponse;
  created_at: string;
}

export async function getProjectHistory(): Promise<ProjectHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects/history`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project history");
  }

  return response.json();
}