'use client';

import { useState } from 'react';
import { Anomaly, AnomalySeverity, AnomalyType } from '@/domain/Agent';

interface AlertPanelProps {
    anomalies: Anomaly[];
    onResolve?: (anomalyId: string) => void;
    onConfigureAlerts?: () => void;
}

const SEVERITY_COLORS: Record<AnomalySeverity, string> = {
    critical: 'border-red-500/50 bg-red-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    medium: 'border-amber-500/50 bg-amber-500/10',
    low: 'border-yellow-500/50 bg-yellow-500/10',
};

const TYPE_ICONS: Record<AnomalyType, string> = {
    drift: '📊',
    policy_violation: '⚠️',
    performance: '⚡',
    pii_leak: '🔒',
};

export function AlertPanel({ anomalies, onResolve, onConfigureAlerts }: AlertPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filterSeverity, setFilterSeverity] = useState<AnomalySeverity | 'all'>('all');
    const [filterType, setFilterType] = useState<AnomalyType | 'all'>('all');

    const unresolvedCount = anomalies.filter(a => !a.resolved).length;
    const criticalCount = anomalies.filter(a => !a.resolved && (a.severity === 'critical' || a.severity === 'high')).length;

    const filteredAnomalies = anomalies.filter(a => {
        if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
        if (filterType !== 'all' && a.type !== filterType) return false;
        return true;
    });

    return (
        <>
            {/* Alert Bell Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                data-testid="alert-panel-trigger"
            >
                <span className="text-xl">🔔</span>
                {unresolvedCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${criticalCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'} text-white`}>
                        {unresolvedCount}
                    </span>
                )}
            </button>

            {/* Panel Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setIsOpen(false)}>
                    <div
                        className="w-full max-w-md h-full glass-card border-l border-[var(--border)] overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                        data-testid="alert-panel"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Alerts & Anomalies</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="p-4 border-b border-[var(--border)] flex gap-2 flex-wrap">
                            <select
                                value={filterSeverity}
                                onChange={e => setFilterSeverity(e.target.value as AnomalySeverity | 'all')}
                                className="px-3 py-1.5 text-xs bg-[var(--surface-2)] border border-[var(--border)] rounded text-white"
                            >
                                <option value="all">All Severities</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value as AnomalyType | 'all')}
                                className="px-3 py-1.5 text-xs bg-[var(--surface-2)] border border-[var(--border)] rounded text-white"
                            >
                                <option value="all">All Types</option>
                                <option value="drift">Drift</option>
                                <option value="policy_violation">Policy Violation</option>
                                <option value="performance">Performance</option>
                                <option value="pii_leak">PII Leak</option>
                            </select>
                        </div>

                        {/* Alert List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {filteredAnomalies.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="text-4xl mb-2">✨</div>
                                    <div>No anomalies detected</div>
                                </div>
                            ) : (
                                filteredAnomalies.map(anomaly => (
                                    <div
                                        key={anomaly.id}
                                        className={`p-4 rounded-lg border ${SEVERITY_COLORS[anomaly.severity]} ${anomaly.resolved ? 'opacity-50' : ''}`}
                                        data-testid="anomaly-item"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{TYPE_ICONS[anomaly.type]}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-white">
                                                        {anomaly.type.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 text-[10px] rounded uppercase font-bold ${anomaly.severity === 'critical' ? 'bg-red-500 text-white' : anomaly.severity === 'high' ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
                                                        {anomaly.severity}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mb-2">{anomaly.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date(anomaly.detectedAt).toLocaleString()}
                                                    </span>
                                                    {!anomaly.resolved && onResolve && (
                                                        <button
                                                            onClick={() => onResolve(anomaly.id)}
                                                            className="text-xs text-[var(--primary)] hover:underline"
                                                        >
                                                            Mark Resolved
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-[var(--border)]">
                            <button
                                onClick={onConfigureAlerts}
                                className="w-full btn-secondary text-sm"
                            >
                                ⚙️ Configure Alert Channels
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
