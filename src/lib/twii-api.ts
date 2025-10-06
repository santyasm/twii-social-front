import { User } from "@/@types/users";
import { API_CONFIG, getApiUrl } from "./config";

interface ApiOptions extends RequestInit {
  body?: any;
  isFormData?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers, isFormData, ...rest } = options;

  const response = await fetch(getApiUrl(endpoint), {
    ...rest,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },

    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      throw new Error("Sessão expirada. Redirecionando para login.");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro na requisição");
  }

  return response.json().catch(() => ({})) as Promise<T>;
}

export const twiiApi = {
  register: (data: { username: string; email: string; password: string }) =>
    apiFetch(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: data,
    }),

  login: (data: { usernameOrEmail: string; password: string }) =>
    apiFetch<void>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: data,
    }),

  logout: () =>
    apiFetch<void>(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: "POST",
    }),

  me: () => apiFetch<User>(API_CONFIG.ENDPOINTS.ME, { method: "GET" }),

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

  findAllUsers: () =>
    apiFetch<User[]>(API_CONFIG.ENDPOINTS.FIND_ALL_USERS, { method: "GET" }),

  findAllPosts: () =>
    apiFetch(API_CONFIG.ENDPOINTS.FIND_ALL_POSTS, { method: "GET" }),

  createPost: (data: FormData) =>
    apiFetch(API_CONFIG.ENDPOINTS.CREATE_POST, {
      method: "POST",
      body: data,
      isFormData: true,
    }),
};
