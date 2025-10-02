import { API_CONFIG, getApiUrl } from "./config";

interface ApiOptions extends RequestInit {
  body?: any;
}

async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(getApiUrl(endpoint), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro na requisição");
  }

  return response.json();
}

export const twiiApi = {
  login: (data: { usernameOrEmail: string; password: string }) =>
    apiFetch<{ token: string }>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: data,
    }),

  register: (data: { username: string; email: string; password: string }) =>
    apiFetch(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: data,
    }),

  verifyEmail: (token: string) =>
    apiFetch(API_CONFIG.ENDPOINTS.VERIFY_EMAIL, {
      method: "POST",
      body: { token },
    }),

  resendVerification: (email: string) =>
    apiFetch(API_CONFIG.ENDPOINTS.RESEND_VERIFICATION, {
      method: "POST",
      body: { email },
    }),
};
