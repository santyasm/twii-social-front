"use client";

import { Home, LogOutIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AppLogoIcon from "./app-logo-icon";
import { useAuth } from "@/hooks/auth/use-auth";
import { getInitials } from "@/utils/string-formatter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

export function LeftSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Render neutro no SSR
  if (!mounted) {
    return (
      <aside className="hidden sm:flex flex-col bg-card rounded-2xl shadow-md p-3 md:p-4 fixed left-4 top-4 w-[70px] md:w-[90px] lg:w-[250px] h-[calc(100%-2rem)] z-30">
        <div className="flex items-center justify-center lg:justify-start gap-2 pb-4">
          <AppLogoIcon className="fill-current text-primary w-6 h-6" />
        </div>
      </aside>
    );
  }

  if (!user) {
    return (
      <div className="hidden sm:flex flex-col items-center p-4 fixed top-4 left-4 z-20">
        <Link href="/" className="p-3 rounded-full hover:bg-white/10 transition">
          <AppLogoIcon className="w-7 h-7 text-primary" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <aside
        className={clsx(
          "hidden sm:flex flex-col bg-card rounded-2xl shadow-md p-3 md:p-4 fixed left-4 top-4 z-30 overflow-y-auto transition-all duration-300",
          "w-[70px] md:w-[90px] lg:w-[250px]",
          "h-[calc(100%-2rem)]"
        )}
      >
        {/* Logo */}
        <Link href={`/home`}>
          <div className="flex items-center justify-center lg:justify-start gap-2 pb-4">
            <AppLogoIcon className="fill-current text-primary w-6 h-6 md:w-8 md:h-8" />
            <h1 className="hidden lg:block font-bold text-xl">Twii</h1>
          </div>
        </Link>

        {/* Profile */}
        <div className={clsx(
          "flex flex-col items-center mb-8",
          "md:flex-col lg:flex-col"
        )}>
          <Link href={`/${user.username}`} className="flex flex-col items-center">
            <Avatar className="w-10 h-10 md:w-11 md:h-11 lg:w-20 lg:h-20 mb-2 md:mb-3 lg:mb-3 ring-2 ring-white/10">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            {/* Texto só em lg */}
            <div className="hidden lg:flex flex-col items-center">
              <h3 className="text-sm">{user.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">@{user.username}</p>
            </div>
          </Link>

          {/* Bio e stats apenas lg */}
          <div className="hidden lg:flex flex-col items-center mt-2">
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300 text-xs text-center leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex gap-6 mt-4">
              <div className="flex flex-col items-center">
                <span>{user.Post?.length}</span>
                <span className="text-gray-400 text-xs">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span>{user.followers?.length}</span>
                <span className="text-gray-400 text-xs">Seguidores</span>
              </div>
              <div className="flex flex-col items-center">
                <span>{user.following?.length}</span>
                <span className="text-gray-400 text-xs">Seguindo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="space-y-2 mt-auto">
          <Link
            href="/home"
            className={clsx(
              "flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl transition",
              pathname === "/home"
                ? "bg-primary dark:text-gray-600 text-white shadow-md"
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
                ? "bg-primary dark:text-gray-600 text-white shadow-md"
                : "text-gray-400 hover:bg-white/5"
            )}
          >
            <Settings className="w-7 h-6 shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Configurações</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl dark:text-gray-400 text-gray-400 hover:bg-white/5 transition w-full"
          >
            <LogOutIcon className="w-7 h-6 shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Sair</span>
          </button>
        </nav>
      </aside>

      {/* Bottom Tab no mobile */}
      <div
        className="
          fixed bottom-0 left-0 right-0
          sm:hidden
          bg-white/80 dark:bg-[#2d2d2d]/90
          backdrop-blur-md
          border-t border-white/10
          flex justify-around items-center py-2
          z-40
        "
      >
        <Link href="/home">
          <Home
            className={clsx(
              "w-6 h-6",
              pathname === "/home"
                ? "text-primary"
                : "text-gray-800 dark:text-gray-100"
            )}
          />
        </Link>

        <Link href="/settings">
          <Settings
            className={clsx(
              "w-6 h-6",
              pathname === "/settings"
                ? "text-primary"
                : "text-gray-800 dark:text-gray-100"
            )}
          />
        </Link>

        {/* Profile (foto sempre) */}
        <Link href={`/${user.username}`}>
          <Avatar className="w-8 h-8 ring-2 ring-white/20">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Link>

        <button onClick={logout}>
          <LogOutIcon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
        </button>
      </div>
    </>
  );
}
