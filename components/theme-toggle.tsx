"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, toggleTheme, isLoaded } = useTheme();

    // Prevent hydration mismatch by not rendering until loaded
    if (!isLoaded) {
        return (
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 animate-pulse" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2.5 rounded-lg border transition-all duration-200 cursor-pointer",
                theme === "dark"
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    : "bg-(--paper-bg) border-zinc-200 text-[var(--paper-text)] hover:bg-[#e6dec9]/50 hover:text-[var(--paper-text)]"
            )}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </button>
    );
}
