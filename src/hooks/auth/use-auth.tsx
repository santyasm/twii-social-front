"use client";

import { User } from "@/@types/users";
import { twiiApi } from "@/lib/twii-api";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface UserCredentials {
  usernameOrEmail: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("twii-user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (credentials: UserCredentials) => {
    setIsLoading(true);

    try {
      await twiiApi.login(credentials);
      await fetchCurrentUser();

      toast.success("Login realizado com sucesso!");
      window.location.href = "/home";
    } catch (error) {
      toast.info("Erro ao fazer login. Verifique suas credenciais.");
      setUser(null);
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = await twiiApi.me();

      localStorage.setItem("twii-user", JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      localStorage.removeItem("twii-user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await twiiApi.logout();
      localStorage.removeItem("twii-user");
      setUser(null);

      toast.success("Logout realizado com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
