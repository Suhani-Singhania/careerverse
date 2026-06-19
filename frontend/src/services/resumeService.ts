import { getToken } from "./authService";
import { API_BASE_URL } from "./apiConfig";

export interface ResumeAnalysisResponse {
  score: number;
  level: string;
  skills: string[];
  suggestions: string[];
  summary: string;
}

export async function analyzeResume(
  file: File
): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze resume");
  }

  return response.json();
}
