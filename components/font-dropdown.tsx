"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Type, Search, Check, X } from "lucide-react";
import { useFont, fontOptions, FontOption } from "@/lib/font-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function FontDropdown() {
    const { selectedFont, setSelectedFont } = useFont();
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter fonts based on search query
    const filteredFonts = fontOptions.filter(
        (font) =>
            font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            font.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Handle keyboard navigation
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && isOpen) {
                setIsOpen(false);
                setSearchQuery("");
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleFontSelect = (font: FontOption) => {
        setSelectedFont(font);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer",
                    theme === "dark"
                        ? isOpen
                            ? "bg-zinc-800 border-zinc-600 text-white"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        : isOpen
                            ? "bg-[#e6dec9] border-[#d6cbb8] text-[var(--paper-text)]"
                            : "bg-(--paper-bg) border-zinc-200 text-[var(--paper-text)] hover:bg-[#e6dec9]/50 hover:text-[var(--paper-text)]"
                )}
                aria-label="Change font style"
                aria-expanded={isOpen}
            >
                <Type className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{selectedFont.name}</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl overflow-hidden z-50",
                            theme === "dark"
                                ? "bg-zinc-900 border border-zinc-800 shadow-black/50"
                                : "bg-(--paper-bg) border border-zinc-200 shadow-[#d6cbb8]/50"
                        )}
                    >
                        {/* Search Input */}
                        <div className={cn("p-3 border-b", theme === "dark" ? "border-zinc-800" : "border-zinc-200")}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search fonts..."
                                    className={cn(
                                        "w-full text-sm rounded-lg pl-10 pr-10 py-2.5 border focus:outline-none transition-colors",
                                        theme === "dark"
                                            ? "bg-zinc-800 text-white placeholder-zinc-500 border-zinc-700 focus:border-zinc-500"
                                            : "bg-[#fdfbf7] text-[var(--paper-text)] placeholder-[#786c5e] border-zinc-200 focus:border-[#d6cbb8]"
                                    )}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className={cn(
                                            "absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer",
                                            theme === "dark" ? "text-zinc-500 hover:text-white" : "text-[#786c5e] hover:text-[var(--paper-text)]"
                                        )}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Font List */}
                        <div className="max-h-80 overflow-y-auto overscroll-contain">
                            {filteredFonts.length === 0 ? (
                                <div className="p-4 text-center text-zinc-500 text-sm">
                                    No fonts found
                                </div>
                            ) : (
                                <ul className="py-2">
                                    {filteredFonts.map((font) => (
                                        <li key={font.value}>
                                            <button
                                                onClick={() => handleFontSelect(font)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer",
                                                    theme === "dark"
                                                        ? selectedFont.value === font.value
                                                            ? "bg-zinc-800 text-white"
                                                            : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                                                        : selectedFont.value === font.value
                                                            ? "bg-[#e6dec9] text-[var(--paper-text)]"
                                                            : "text-[var(--paper-text)]/80 hover:bg-[#e6dec9]/30 hover:text-[var(--paper-text)]"
                                                )}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span
                                                        className="text-sm font-medium"
                                                        style={{ fontFamily: font.cssFamily }}
                                                    >
                                                        {font.name}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 capitalize">
                                                        {font.category}
                                                    </span>
                                                </div>
                                                {selectedFont.value === font.value && (
                                                    <Check className="w-4 h-4 text-white flex-shrink-0" />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        <div className={cn("p-3 border-t", theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-[#fdfbf7]")}>
                            <p className="text-xs text-zinc-500 text-center">
                                {fontOptions.length} fonts available
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
