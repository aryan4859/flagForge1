"use client";
import React from "react";

interface AdHintModalProps {
    isOpen: boolean;
    onClose: () => void;
    hintIndex: number;
    pointsDeduction: number;
    onUsePoints: () => void;
    onWatchAd: () => void; // kept in interface for backwards compatibility
}

export default function AdHintModal({
    isOpen,
    onClose,
    hintIndex,
    pointsDeduction,
    onUsePoints,
}: AdHintModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transition-colors duration-300">
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
                            Reveal this hint by spending points from your score.
                        </p>
                    </div>

                    {/* Use Points Option */}
                    <div className="border-2 border-orange-400 dark:border-orange-600 rounded-xl p-6 bg-orange-50 dark:bg-orange-900/20 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">⚡</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2">
                                    Use Points
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
                                    Deduct Points &amp; Get Hint
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
                                <strong>Note:</strong> Using a hint will deduct points from your current score. Use them wisely!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
