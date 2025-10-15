export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_TWII_API_URL || "http://localhost:3000",
  ENDPOINTS: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/users/me",
    USER_UPDATE: (userId: string) => `users/${userId}`,
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    FIND_ALL_USERS: "/users",
    FIND_USER_BY_USERNAME: (username: string) => `/users/${username}`,

    FIND_ALL_POSTS: "/posts",
    FIND_POST_BY_ID: (postId: string) => `/posts/${postId}`,
    CREATE_POST: "/posts",

    GET_FEED: (onlyFollowing?: boolean) =>
      `/posts/feed?onlyFollowing=${onlyFollowing}`,

    FOLLOW: (userId: string) => `/users/${userId}/follow`,
    UNFOLLOW: (userId: string) => `/users/${userId}/unfollow`,

    LIKE_POST: (postId: string) => `/posts/${postId}/like`,
    UNLIKE_POST: (postId: string) => `/posts/${postId}/unlike`,

    COMMENT_POST: (postId: string) => `/posts/${postId}/comments`,

    REMOVE_POST: (postId: string) => `/posts/${postId}`,
  },
} as const;

export const getApiUrl = (endpoint: string) => {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};
