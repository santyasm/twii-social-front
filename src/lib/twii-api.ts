import { User } from "@/@types/users";
import { API_CONFIG, getApiUrl } from "./config";
import { toast } from "sonner";

interface ApiOptions extends RequestInit {
  body?: any;
  isFormData?: boolean;
  skipAuthRedirect?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers, isFormData, ...rest } = options;

  try {
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
      if (response.status === 401) {
        toast.info("Sessão expirada. Faça login novamente.");
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
    throw error instanceof Error
      ? error
      : new Error("Erro desconhecido na API");
  }
}

/* -------------------------------------------------------------------------- */
/*                                   API CALLS                                */
/* -------------------------------------------------------------------------- */

let cachedUser: User | null = null;

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

  me: async () => {
    if (cachedUser) return cachedUser;
    const user = await apiFetch<User>(API_CONFIG.ENDPOINTS.ME, {
      method: "GET",
    });
    cachedUser = user;
    return user;
  },

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

  getFeed: (onlyFollowing?: boolean) =>
    apiFetch(API_CONFIG.ENDPOINTS.GET_FEED(onlyFollowing), {
      method: "GET"

    })
};
