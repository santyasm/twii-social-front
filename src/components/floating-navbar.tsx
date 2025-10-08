"use client";

import { Home, LogOutIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/auth/use-auth";
import { getInitials } from "@/utils/string-formatter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

export function FloatingNavBar() {
    // const { user, logout } = useAuth();
    const pathname = usePathname();

    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const isNearFooter =
                scrollPosition + windowHeight >= documentHeight - 200;

            setIsVisible(!isNearFooter);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // if (!isMounted || !user) {
    //     return null;
    // }

    // const isProfileActive = pathname === `/${user.username}`;

    return (
        <nav
            className={clsx(
                "fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]",
                "sm:hidden",
                "w-[90vw] max-w-sm",
                "flex items-center justify-around",
                "rounded-full bg-card/90 shadow-2xl backdrop-blur-md",
                "p-3",
                "transition-all duration-300 ease-out",
                isVisible
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-20 opacity-0 scale-95"
            )}
        >

            <Link
                href="/home"
                className={clsx(
                    "p-2 rounded-full transition-colors",
                    pathname === "/home" ? "bg-primary text-white dark:text-gray-600" : "text-gray-500 hover:text-primary"
                )}
            >
                <Home className="w-6 h-6" />
            </Link>

            <Link
                href="/settings"
                className={clsx(
                    "p-2 rounded-full transition-colors",
                    pathname.includes("/settings") ? "bg-primary text-white dark:text-gray-600" : "text-gray-500 hover:text-primary"
                )}
            >
                <Settings className="w-6 h-6" />
            </Link>

            {/* <Link
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
            </Link> */}

            <button
                // onClick={logout}
                className="p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors"
            >
                <LogOutIcon className="w-6 h-6" />
            </button>
        </nav>
    );
}