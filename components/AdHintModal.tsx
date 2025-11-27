"use client";
import React, { useState, useEffect } from "react";

interface AdHintModalProps {
    isOpen: boolean;
    onClose: () => void;
    hintIndex: number;
    pointsDeduction: number;
    onUsePoints: () => void;
    onWatchAd: () => void;
}

export default function AdHintModal({
    isOpen,
    onClose,
    hintIndex,
    pointsDeduction,
    onUsePoints,
    onWatchAd,
}: AdHintModalProps) {
    const [adWatched, setAdWatched] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (isOpen) {
            setAdWatched(false);
            setCountdown(5);
        }
    }, [isOpen]);

    // Simulate ad watching countdown
    useEffect(() => {
        if (isOpen && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setAdWatched(true);
        }
    }, [isOpen, countdown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 p-6 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span>💡</span> Get Hint #{hintIndex + 1}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 text-center">
                            Choose how you'd like to reveal this hint:
                        </p>
                    </div>

                    {/* Option 1: Watch Ad */}
                    <div className="border-2 border-green-400 dark:border-green-600 rounded-xl p-6 bg-green-50 dark:bg-green-900/20 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">📺</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                                    Option 1: Watch Advertisement
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Watch a short advertisement to get this hint for free. No points will be deducted from your score.
                                </p>

                                {/* Ad Placeholder */}
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 mb-4 text-center">
                                    {!adWatched ? (
                                        <div className="space-y-3">
                                            <div className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Advertisement will appear here
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-500">
                                                (Google AdSense ad unit)
                                            </div>
                                            <div className="mt-4">
                                                <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-bold">
                                                    {countdown > 0 ? `Please wait ${countdown}s...` : "Ad completed!"}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                                            ✓ Advertisement completed!
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={onWatchAd}
                                    disabled={!adWatched}
                                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${adWatched
                                            ? "bg-green-600 hover:bg-green-700 cursor-pointer shadow-lg hover:shadow-xl"
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {adWatched ? "Get Hint (Free)" : "Watch Ad First"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="text-gray-500 dark:text-gray-400 font-semibold">OR</span>
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    {/* Option 2: Use Points */}
                    <div className="border-2 border-orange-400 dark:border-orange-600 rounded-xl p-6 bg-orange-50 dark:bg-orange-900/20 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">⚡</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2">
                                    Option 2: Use Points
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Get the hint instantly by deducting points from your score. Skip the wait and continue solving immediately.
                                </p>

                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-orange-300 dark:border-orange-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                            Points to deduct:
                                        </span>
                                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            -{pointsDeduction}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={onUsePoints}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
                                >
                                    Deduct Points & Get Hint
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Note:</strong> Both options will reveal the same hint. Choose the method that works best for you. Watching ads helps support the platform and keeps it free for everyone!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
