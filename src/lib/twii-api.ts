import { User } from "@/@types/users";
import { API_CONFIG, getApiUrl } from "./config";

interface ApiOptions extends RequestInit {
  body?: any;
  isFormData?: boolean;
  skipAuthRedirect?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers, isFormData, skipAuthRedirect, ...rest } = options;

  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...rest,
      credentials: "include", // 👈 garante envio de cookies no mesmo domínio
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        if (!skipAuthRedirect) {
          localStorage.removeItem("twii-user");
          window.location.href = "/";
        }
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    return {} as T;
  } catch (error) {
    console.error(`[twiiApi] ${endpoint} →`, error);
    throw error instanceof Error ? error : new Error("Erro desconhecido na API");
  }
}

/* -------------------------------------------------------------------------- */
/*                                   API CALLS                                */
/* -------------------------------------------------------------------------- */

export const twiiApi = {
  register: (data: { username: string; email: string; password: string }) =>
    apiFetch(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: data,
      skipAuthRedirect: true,
    }),

  login: (data: { usernameOrEmail: string; password: string }) =>
    apiFetch<void>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: data,
      skipAuthRedirect: true,
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
      skipAuthRedirect: true,
    }),

  resendVerification: (email: string) =>
    apiFetch(API_CONFIG.ENDPOINTS.RESEND_VERIFICATION, {
      method: "POST",
      body: { email },
      skipAuthRedirect: true,
    }),

  findAllUsers: () =>
    apiFetch<User[]>(API_CONFIG.ENDPOINTS.FIND_ALL_USERS, { method: "GET" }),

  findUserByUsername: (username: string) =>
    apiFetch<User>(API_CONFIG.ENDPOINTS.FIND_USER_BY_USERNAME(username), {
      method: "GET",
    }),

  findAllPosts: () =>
    apiFetch(API_CONFIG.ENDPOINTS.FIND_ALL_POSTS, { method: "GET" }),

  createPost: (data: FormData) =>
    apiFetch(API_CONFIG.ENDPOINTS.CREATE_POST, {
      method: "POST",
      body: data,
      isFormData: true,
    }),
};