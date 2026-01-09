'use client';

import { useState } from 'react';

interface KillSwitchProps {
    agentId: string;
    agentName: string;
    isEmergencyStopped?: boolean;
    onKill: (agentId: string) => Promise<void>;
    onRestore?: (agentId: string) => Promise<void>;
}

export function KillSwitch({ agentId, agentName, isEmergencyStopped, onKill, onRestore }: KillSwitchProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const handleKillClick = () => {
        setShowConfirm(true);
        setCountdown(3);

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

    const confirmKill = async () => {
        setIsLoading(true);
        try {
            await onKill(agentId);
        } finally {
            setIsLoading(false);
            setShowConfirm(false);
        }
    };

    const handleRestore = async () => {
        if (!onRestore) return;
        setIsLoading(true);
        try {
            await onRestore(agentId);
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmergencyStopped) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 font-mono uppercase">STOPPED</span>
                {onRestore && (
                    <button
                        onClick={handleRestore}
                        disabled={isLoading}
                        className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                        data-testid="restore-agent"
                    >
                        {isLoading ? '...' : 'Restore'}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleKillClick}
                className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-1.5"
                data-testid="kill-switch"
            >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Kill
            </button>

            {showConfirm && (
                <div className="absolute top-full right-0 mt-2 p-4 glass-card border-red-500/30 min-w-[250px] z-50" data-testid="kill-confirm-modal">
                    <div className="text-sm text-white mb-3">
                        Emergency stop <span className="font-bold text-red-400">{agentName}</span>?
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                        This will immediately halt all agent operations across all environments.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 px-3 py-2 text-xs bg-[var(--surface-2)] text-gray-400 rounded hover:bg-[var(--surface-1)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmKill}
                            disabled={countdown > 0 || isLoading}
                            className="flex-1 px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="confirm-kill"
                        >
                            {isLoading ? 'Stopping...' : countdown > 0 ? `Confirm (${countdown})` : 'Confirm Kill'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
