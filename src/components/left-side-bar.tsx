"use client";

import { Home, LogIn, LogOutIcon, Settings, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AppLogoIcon from "./app-logo-icon";
import { useAuth } from "@/hooks/auth/use-auth";
import { getInitials } from "@/utils/string-formatter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div
    className={clsx(
      "flex gap-2",
      isMobile ? "w-full justify-center" : "flex-col w-full px-2"
    )}
  >
    <Button
      asChild
      className="w-full font-semibold transition-colors duration-150"
    >
      <Link
        href="/login"
        className="flex items-center justify-center lg:justify-start gap-3"
      >
        <LogIn className="w-6 h-6 shrink-0" />
        <span className="hidden lg:inline text-sm">Entrar</span>
      </Link>
    </Button>

    {/* Botão REGISTRAR */}
    <Button
      asChild
      variant="secondary"
      className="w-full font-semibold transition-colors duration-150"
    >
      <Link
        href="/register"
        className="flex items-center justify-center lg:justify-start gap-3"
      >
        <UserPlus className="w-6 h-6 shrink-0" />
        <span className="hidden lg:inline text-sm">Registrar</span>
      </Link>
    </Button>
  </div>
);

export function LeftSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!user) {
    return (
      <>
        <div className="hidden sm:flex flex-col items-center justify-start p-4 fixed top-4 left-4 z-20 w-[70px] md:w-[90px] lg:w-[250px] h-[calc(100%-2rem)] bg-card rounded-2xl shadow-md transition-all duration-300">
          <Link href="/" className="pb-4 lg:self-start self-center p-0 lg:p-2">
            <div className="flex items-center gap-2">
              <AppLogoIcon className="fill-current text-primary w-6 h-6 md:w-8 md:h-8" />
              <h1 className="hidden lg:block font-bold text-xl">Twii</h1>
            </div>
          </Link>

          <div className="mt-auto w-full">
            <AuthButtons />
          </div>
        </div>

        <div className="sm:hidden fixed top-4 left-4 z-20">
          <Link href="/">
            <AppLogoIcon className="w-7 h-7 text-primary" />
          </Link>
        </div>
      </>
    );
  }

  // ---------------------- CASO: Usuário LOGADO ----------------------
  return (
    <>
      <aside
        className={clsx(
          "hidden sm:flex flex-col bg-card rounded-2xl shadow-md p-4 fixed left-4 top-4 z-30 overflow-y-auto transition-all duration-300",
          "w-[70px] md:w-[90px] lg:w-[250px]",
          "h-[calc(100%-2rem)]"
        )}
      >
        <Link href="/home">
          <div className="flex items-center justify-center lg:justify-start gap-2 pb-4">
            <AppLogoIcon className="fill-current text-primary w-6 h-6 md:w-8 md:w-8" />
            <h1 className="hidden lg:block font-bold text-xl">Twii</h1>
          </div>
        </Link>

        {/* Profile */}
        <Link
          href={`/${user.username}`}
          className="flex flex-col items-center mb-6"
        >
          <Avatar className="w-10 h-10 md:w-11 md:h-11 lg:w-20 lg:h-20 mb-2 md:mb-3 lg:mb-3 ring-2 ring-white/10">
            <AvatarImage src={user.avatarUrl} className=" object-cover" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>

          <div className="hidden lg:flex flex-col items-center text-center">
            <h3 className="text-sm font-medium">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              @{user.username}
            </p>
            {user.bio && (
              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>
        </Link>

        {/* Stats */}
        <div className="hidden lg:flex justify-between mt-4 px-4">
          <div className="flex flex-col items-center">
            <span className="font-semibold">{user.posts?.length}</span>
            <span className="text-gray-400 text-xs">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">{user.followers?.length}</span>
            <span className="text-gray-400 text-xs">Seguidores</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold">{user.following?.length}</span>
            <span className="text-gray-400 text-xs">Seguindo</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-auto">
          <Link
            href="/home"
            className={clsx(
              "flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl transition",
              pathname === "/home"
                ? "bg-primary text-white dark:text-gray-600 shadow-md"
                : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Home className="w-7 h-6 shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Feed</span>
          </Link>

          <Link
            href="/settings"
            className={clsx(
              "flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl transition",
              pathname.includes("/settings")
                ? "bg-primary text-white dark:text-gray-600 shadow-md"
                : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Settings className="w-7 h-6 shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">
              Configurações
            </span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 transition w-full"
          >
            <LogOutIcon className="w-7 h-6 shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Sair</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
