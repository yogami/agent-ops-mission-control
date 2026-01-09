export interface KillSwitchEvent {
    agentId: string | null;
    action: string;
    actorId: string;
    timestamp: string;
}

export interface GovernanceRepository {
    updateAgentKillStatus(agentId: string, isStopped: boolean, actorId: string, timestamp: string): Promise<any>;
    stopAllAgents(actorId: string, timestamp: string): Promise<any[]>;
    logKillEvent(event: KillSwitchEvent): Promise<void>;
}
