'use client';

import { useState } from 'react';
import { PendingAction, ActionStatus } from '@/domain/Agent';

interface HumanReviewPanelProps {
    pendingActions: PendingAction[];
    onApprove: (actionId: string, reviewerName: string) => Promise<void>;
    onDeny: (actionId: string, reviewerName: string, reason?: string) => Promise<void>;
}

export function HumanReviewPanel({ pendingActions, onApprove, onDeny }: HumanReviewPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [denyReason, setDenyReason] = useState('');
    const [showDenyModal, setShowDenyModal] = useState<string | null>(null);

    const pendingCount = pendingActions.filter(a => a.status === 'pending').length;

    const handleApprove = async (actionId: string) => {
        setProcessingId(actionId);
        try {
            await onApprove(actionId, 'current-user'); // In production, get from auth context
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeny = async (actionId: string) => {
        setProcessingId(actionId);
        try {
            await onDeny(actionId, 'current-user', denyReason);
        } finally {
            setProcessingId(null);
            setShowDenyModal(null);
            setDenyReason('');
        }
    };

    const getStatusBadge = (status: ActionStatus) => {
        switch (status) {
            case 'pending':
                return <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded-full">PENDING</span>;
            case 'approved':
                return <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full">APPROVED</span>;
            case 'denied':
                return <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded-full">DENIED</span>;
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                data-testid="human-review-trigger"
            >
                <span className="text-xl">👁️</span>
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-amber-500 text-white animate-pulse">
                        {pendingCount}
                    </span>
                )}
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setIsOpen(false)}>
                    <div
                        className="w-full max-w-lg h-full glass-card border-l border-[var(--border)] overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                        data-testid="human-review-panel"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">Human-in-Loop Review</h2>
                                <p className="text-xs text-gray-400">{pendingCount} action{pendingCount !== 1 ? 's' : ''} awaiting approval</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        {/* Action List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {pendingActions.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="text-4xl mb-2">✅</div>
                                    <div>No pending actions</div>
                                </div>
                            ) : (
                                pendingActions.map(action => (
                                    <div
                                        key={action.id}
                                        className={`p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] ${action.status !== 'pending' ? 'opacity-60' : ''}`}
                                        data-testid="pending-action"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-white">{action.action}</span>
                                                {getStatusBadge(action.status)}
                                            </div>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(action.requestedAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-400 mb-3">{action.description}</p>

                                        {action.payload && (
                                            <pre className="p-2 bg-black/30 rounded text-xs font-mono text-gray-400 mb-3 overflow-x-auto whitespace-pre-wrap">
                                                {JSON.stringify(action.payload, null, 2)}
                                            </pre>
                                        )}

                                        {action.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(action.id)}
                                                    disabled={processingId === action.id}
                                                    className="flex-1 px-3 py-2 text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                                                    data-testid="approve-action"
                                                >
                                                    {processingId === action.id ? '...' : '✓ Approve'}
                                                </button>
                                                <button
                                                    onClick={() => setShowDenyModal(action.id)}
                                                    disabled={processingId === action.id}
                                                    className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                                    data-testid="deny-action"
                                                >
                                                    ✕ Deny
                                                </button>
                                            </div>
                                        )}

                                        {action.reviewedBy && (
                                            <div className="mt-2 text-[10px] text-gray-500">
                                                Reviewed by {action.reviewedBy} at {action.reviewedAt ? new Date(action.reviewedAt).toLocaleString() : 'N/A'}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Audit Trail Footer */}
                        <div className="p-4 border-t border-[var(--border)]">
                            <div className="text-xs text-gray-500 text-center">
                                All actions are logged for regulatory compliance
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Deny Modal */}
            {showDenyModal && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6">
                    <div className="glass-card max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Deny Action</h3>
                        <textarea
                            value={denyReason}
                            onChange={e => setDenyReason(e.target.value)}
                            placeholder="Reason for denial (optional)"
                            rows={3}
                            className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded text-white text-sm mb-4"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDenyModal(null)}
                                className="flex-1 px-4 py-2 bg-[var(--surface-2)] text-gray-400 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeny(showDenyModal)}
                                disabled={processingId !== null}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                data-testid="confirm-deny"
                            >
                                Confirm Deny
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
