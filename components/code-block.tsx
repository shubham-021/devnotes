"use client";

import { useState, useRef, ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
    children: ReactNode;
    className?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = async () => {
        if (!preRef.current) return;

        // Get the text content from the code element
        const codeElement = preRef.current.querySelector("code");
        const text = codeElement?.textContent || preRef.current.textContent || "";

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative group">
            <pre
                ref={preRef}
                className={cn(className)}
                {...props}
            >
                {children}
            </pre>
            <button
                onClick={handleCopy}
                className={cn(
                    "absolute top-2 right-2 p-2 rounded-md transition-all duration-200 cursor-pointer",
                    "opacity-0 group-hover:opacity-100",
                    // Dark mode styles (default)
                    "bg-zinc-700/80 border border-zinc-600 text-zinc-300",
                    "hover:bg-zinc-600 hover:text-white",
                    // Light mode - handled via CSS
                    copied && "text-white bg-zinc-600"
                )}
                aria-label={copied ? "Copied!" : "Copy code"}
            >
                {copied ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}
