'use client';

import { useState } from 'react';

interface GlobalKillSwitchProps {
    onGlobalKill: () => Promise<void>;
    activeAgentCount: number;
}

export function GlobalKillSwitch({ onGlobalKill, activeAgentCount }: GlobalKillSwitchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const handleOpen = () => {
        setIsOpen(true);
        setCountdown(5);

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const confirmGlobalKill = async () => {
        setIsLoading(true);
        try {
            await onGlobalKill();
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center gap-2 group"
                data-testid="global-kill-switch"
            >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse group-hover:animate-ping" />
                <span className="font-bold text-sm">EMERGENCY STOP</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" data-testid="global-kill-modal">
                    <div className="glass-card border-red-500/50 max-w-md w-full p-8 text-center">
                        <div className="text-6xl mb-4">🚨</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Global Emergency Stop</h2>
                        <p className="text-gray-400 mb-6">
                            This will immediately halt <span className="text-red-400 font-bold">{activeAgentCount}</span> active agents across all environments.
                        </p>

                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
                            <p className="text-red-400 text-sm">
                                ⚠️ This action cannot be undone automatically. Agents must be manually restored.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-3 bg-[var(--surface-2)] text-white rounded-lg hover:bg-[var(--surface-1)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmGlobalKill}
                                disabled={countdown > 0 || isLoading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                                data-testid="confirm-global-kill"
                            >
                                {isLoading ? 'Stopping All...' : countdown > 0 ? `KILL ALL (${countdown})` : 'KILL ALL AGENTS'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
