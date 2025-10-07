export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_TWII_API_URL || "http://localhost:3000",
  ENDPOINTS: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/users/me",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    FIND_ALL_USERS: "/users",
    FIND_USER_BY_USERNAME: (username: string) => `/users/${username}`,

    FIND_ALL_POSTS: "/posts",
    CREATE_POST: "/posts",
  },
} as const;

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
