"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] animate-in slide-in-from-bottom-10 duration-500">

                    {/* Decorative glow */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                        {/* Content */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl flex-shrink-0">
                                <Cookie className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    We value your privacy
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                                    <Link
                                        href="/privacy-policy"
                                        className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5"
                            >
                                Accept All
                            </button>
                        </div>

                        {/* Close button (optional, acts as decline/dismiss) */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute -top-2 -right-2 md:top-0 md:right-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
