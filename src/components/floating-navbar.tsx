"use client";

import { Home, LogOutIcon, Settings, LogIn, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/auth/use-auth";
import { getInitials } from "@/utils/string-formatter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function FloatingNavBar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    // Removido isVisible e a lógica de scroll do useEffect
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Ocultando a lógica de scroll: window.addEventListener("scroll", handleScroll)
    }, []);

    if (!isMounted) {
        return null;
    }

    // Configuração de classes base da barra de navegação (agora sem animação de ocultar)
    const navClasses = clsx(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]",
        "sm:hidden",
        "w-[90vw] max-w-sm",
        "flex items-center justify-around",
        "rounded-xl bg-card/90 shadow-2xl backdrop-blur-md",
        "p-2"
        // Removidas as classes de transição e visibilidade (translate-y, opacity, scale)
    );

    // ---------------------- Renderização para Usuário NÃO Logado ----------------------
    if (!user) {
        return (
            <nav className={clsx(navClasses, "justify-between p-3 gap-2")}>
                {/* Mensagem Convidativa (Copy Legal) */}
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate mr-2">
                    Crie uma conta para ter a melhor experiência!
                </p>

                {/* Botão de Login */}
                <Link href="/login" passHref className="flex-shrink-0">
                    <Button className="h-8 text-sm font-semibold px-4 gap-1">
                        <LogIn className="w-4 h-4" />
                        Entrar
                    </Button>
                </Link>
            </nav>
        );
    }

    // ---------------------- Renderização para Usuário Logado ----------------------
    const isProfileActive = pathname === `/${user.username}`;

    return (
        <nav className={clsx(navClasses, "p-3")}>
            {/* Home Button */}
            <Link
                href="/home"
                className={clsx(
                    "p-2 rounded-full transition-colors",
                    pathname === "/home" ? "bg-primary text-white dark:text-gray-600" : "text-gray-500 hover:text-primary"
                )}
            >
                <Home className="w-6 h-6" />
            </Link>

            {/* Search Button */}
            <Link
                href="/search"
                className={clsx(
                    "p-2 rounded-full transition-colors",
                    pathname === "/search" ? "bg-primary text-white dark:text-gray-600" : "text-gray-500 hover:text-primary"
                )}
            >
                <Search className="w-6 h-6" />
            </Link>

            {/* Settings Button */}
            <Link
                href="/settings"
                className={clsx(
                    "p-2 rounded-full transition-colors",
                    pathname.includes("/settings") ? "bg-primary text-white dark:text-gray-600" : "text-gray-500 hover:text-primary"
                )}
            >
                <Settings className="w-6 h-6" />
            </Link>

            {/* Profile Avatar */}
            <Link
                href={`/${user.username}`}
                className={clsx(
                    "p-0.5 rounded-full transition-all",
                    !isProfileActive && "ring-2 ring-transparent hover:ring-primary/70",
                    isProfileActive && "ring-2 ring-primary/50"
                )}
            >
                <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
            </Link>

            {/* Logout Button */}
            <button
                onClick={logout}
                className="p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors"
            >
                <LogOutIcon className="w-6 h-6" />
            </button>
        </nav>
    );
}