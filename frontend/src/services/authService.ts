import { API_BASE_URL } from "./apiConfig";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
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

export async function registerUser(data: RegisterRequest) {
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

export function saveUserProfile(user: UserProfile) {
  localStorage.setItem("careerverse_user", JSON.stringify(user));
}

export function getUserProfile(): UserProfile | null {
  const raw = localStorage.getItem("careerverse_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to load profile");
  }

  const user = await response.json();
  saveUserProfile(user);
  return user;
}

export function getToken() {
  return localStorage.getItem("careerverse_token");
}

export function logout() {
  localStorage.removeItem("careerverse_token");
  localStorage.removeItem("careerverse_user");
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
