'use client';

import { Anomaly, AnomalySeverity } from '@/domain/Agent';

interface AnomalyBadgeProps {
    anomalies?: Anomaly[];
    showCount?: boolean;
}

const SEVERITY_COLORS: Record<AnomalySeverity, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-yellow-500',
};

const SEVERITY_TEXT: Record<AnomalySeverity, string> = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-amber-400',
    low: 'text-yellow-400',
};

export function AnomalyBadge({ anomalies, showCount = true }: AnomalyBadgeProps) {
    if (!anomalies || anomalies.length === 0) return null;

    const unresolvedAnomalies = anomalies.filter(a => !a.resolved);
    if (unresolvedAnomalies.length === 0) return null;

    const highestSeverity = unresolvedAnomalies.reduce((max, a) => {
        const order: AnomalySeverity[] = ['low', 'medium', 'high', 'critical'];
        return order.indexOf(a.severity) > order.indexOf(max) ? a.severity : max;
    }, 'low' as AnomalySeverity);

    const isCritical = highestSeverity === 'critical' || highestSeverity === 'high';

    return (
        <div className="relative group" data-testid="anomaly-badge">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${SEVERITY_COLORS[highestSeverity]}/20 border border-${highestSeverity === 'critical' ? 'red' : highestSeverity === 'high' ? 'orange' : 'amber'}-500/30`}>
                <span className={`w-2 h-2 rounded-full ${SEVERITY_COLORS[highestSeverity]} ${isCritical ? 'animate-pulse' : ''}`} />
                {showCount && (
                    <span className={`text-xs font-medium ${SEVERITY_TEXT[highestSeverity]}`}>
                        {unresolvedAnomalies.length}
                    </span>
                )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50">
                <div className="glass-card p-3 min-w-[200px] max-w-[300px]">
                    <div className="text-xs font-bold text-white mb-2">
                        {unresolvedAnomalies.length} Active Anomal{unresolvedAnomalies.length === 1 ? 'y' : 'ies'}
                    </div>
                    <div className="space-y-2">
                        {unresolvedAnomalies.slice(0, 3).map((a) => (
                            <div key={a.id} className="flex items-start gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_COLORS[a.severity]} mt-1.5`} />
                                <div>
                                    <div className={`text-xs font-medium ${SEVERITY_TEXT[a.severity]}`}>
                                        {a.type.replace('_', ' ').toUpperCase()}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                                        {a.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {unresolvedAnomalies.length > 3 && (
                            <div className="text-xs text-gray-500">
                                +{unresolvedAnomalies.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
