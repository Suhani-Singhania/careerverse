import { API_BASE_URL } from "./apiConfig";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface OTPResponse {
  message: string;
  requires_otp: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(data: AuthRequest) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to register");
  }

  return response.json();
}

export async function loginUser(data: AuthRequest): Promise<OTPResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to login");
  }

  return response.json();
}

export async function verifyOtp(data: OTPVerifyRequest): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Invalid OTP");
  }

  return response.json();
}

export async function resendOtp(email: string): Promise<OTPResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to resend OTP");
  }

  return response.json();
}

export function saveToken(token: string) {
  localStorage.setItem("careerverse_token", token);
}

export function getToken() {
  return localStorage.getItem("careerverse_token");
}

export function logout() {
  localStorage.removeItem("careerverse_token");
}

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to send reset code");
  }

  return response.json();
}

export async function resetPassword(data: {
  email: string;
  otp: string;
  new_password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to reset password");
  }

  return response.json();
}
