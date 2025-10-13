import { cache } from "react";
import { twiiApi } from "@/lib/twii-api";
import { User } from "@/@types/users";
import { cookies } from "next/headers";

export const getCachedUserByUsername = cache(
  async (username: string): Promise<User | null> => {
    const cookiesStore = cookies() as any;
    const authToken = cookiesStore.get("auth_token")?.value;

    const authHeaders: Record<string, string> | undefined = authToken
      ? { Cookie: `auth_token=${authToken}` }
      : undefined;

    try {
      const user = await twiiApi.findUserByUsername(username, authHeaders);
      return user;
    } catch (error) {
      return null;
    }
  }
);
