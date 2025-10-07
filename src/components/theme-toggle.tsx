"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";

const themeOptions = [
    { value: "system", label: "Sistema", icon: Monitor },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "light", label: "Claro", icon: Sun },
];

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="flex p-0.5 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-inner animate-pulse space-x-1">
                {themeOptions.map((option) => (
                    <div
                        key={option.value}
                        className="w-24 h-8 rounded-md bg-gray-300 dark:bg-gray-600"
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`
        flex p-0.5 rounded-lg transition-colors shadow-inner
        bg-gray-200 dark:bg-gray-800
      `}
        >
            {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;

                return (
                    <Button
                        key={option.value}
                        onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                        variant="ghost"
                        className={`
              w-24 h-8 p-0 text-sm font-medium flex items-center justify-center gap-1 transition-all
              ${isActive
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-300/60 dark:hover:bg-gray-700/80"
                            }
            `}
                    >
                        <Icon
                            className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-70"
                                } transition-opacity`}
                        />
                        <span className="hidden sm:inline">{option.label}</span>
                    </Button>
                );
            })}
        </div>
    );
}
