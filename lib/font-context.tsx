"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FontOption {
    name: string;
    value: string;
    category: "sans-serif" | "serif" | "monospace";
    cssFamily: string;
}

export const fontOptions: FontOption[] = [
    { name: "DM Mono", value: "dm-mono", category: "monospace", cssFamily: "'DM Mono', monospace" },
    { name: "Inter", value: "inter", category: "sans-serif", cssFamily: "'Inter', sans-serif" },
    { name: "Roboto", value: "roboto", category: "sans-serif", cssFamily: "'Roboto', sans-serif" },
    { name: "Open Sans", value: "open-sans", category: "sans-serif", cssFamily: "'Open Sans', sans-serif" },
    { name: "Fira Code", value: "fira-code", category: "monospace", cssFamily: "'Fira Code', monospace" },
    { name: "JetBrains Mono", value: "jetbrains-mono", category: "monospace", cssFamily: "'JetBrains Mono', monospace" },
    { name: "Playfair Display", value: "playfair-display", category: "serif", cssFamily: "'Playfair Display', serif" },
    { name: "Merriweather", value: "merriweather", category: "serif", cssFamily: "'Merriweather', serif" },
    { name: "Nunito", value: "nunito", category: "sans-serif", cssFamily: "'Nunito', sans-serif" },
    { name: "Space Grotesk", value: "space-grotesk", category: "sans-serif", cssFamily: "'Space Grotesk', sans-serif" },
];

interface FontContextType {
    selectedFont: FontOption;
    setSelectedFont: (font: FontOption) => void;
    isLoaded: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const STORAGE_KEY = "devnotes-font-preference";

// Google Fonts URL generator
function getGoogleFontUrl(fonts: FontOption[]): string {
    const families = fonts
        .filter((f) => f.value !== "dm-mono") // DM Mono is already loaded via next/font
        .map((f) => f.name.replace(/ /g, "+") + ":wght@300;400;500;600;700")
        .join("&family=");
    return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

export function FontProvider({ children }: { children: ReactNode }) {
    const [selectedFont, setSelectedFontState] = useState<FontOption>(fontOptions[0]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Load Google Fonts
    useEffect(() => {
        if (fontsLoaded) return;

        const link = document.createElement("link");
        link.href = getGoogleFontUrl(fontOptions);
        link.rel = "stylesheet";
        document.head.appendChild(link);
        setFontsLoaded(true);

        return () => {
            // Cleanup not needed for fonts
        };
    }, [fontsLoaded]);

    // Load saved preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const font = fontOptions.find((f) => f.value === saved);
            if (font) {
                setSelectedFontState(font);
            }
        }
        setIsLoaded(true);
    }, []);

    // Apply font to document
    useEffect(() => {
        if (isLoaded) {
            document.documentElement.style.setProperty("--font-body", selectedFont.cssFamily);
            document.body.style.fontFamily = selectedFont.cssFamily;
        }
    }, [selectedFont, isLoaded]);

    const setSelectedFont = (font: FontOption) => {
        setSelectedFontState(font);
        localStorage.setItem(STORAGE_KEY, font.value);
    };

    return (
        <FontContext.Provider value={{ selectedFont, setSelectedFont, isLoaded }}>
            {children}
        </FontContext.Provider>
    );
}

export function useFont() {
    const context = useContext(FontContext);
    if (context === undefined) {
        throw new Error("useFont must be used within a FontProvider");
    }
    return context;
}
