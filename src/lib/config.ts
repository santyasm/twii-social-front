export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_TWII_API_URL || "http://localhost:3000",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
  },
} as const;

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

