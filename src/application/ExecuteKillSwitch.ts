import { GovernanceRepository, KillSwitchEvent } from '@/ports/GovernanceRepository';

export class ExecuteKillSwitch {
    constructor(
        private repo: GovernanceRepository,
        private webhookUrl: string | null = null
    ) { }

    async executeIndividual(agentId: string, action: 'stop' | 'restore', actorId: string): Promise<any> {
        const timestamp = new Date().toISOString();
        const agent = await this.repo.updateAgentKillStatus(agentId, action === 'stop', actorId, timestamp);

        await this.repo.logKillEvent({ agentId, action, actorId, timestamp });
        await this.fireWebhook({ agentId, action, actorId, timestamp });

        return agent;
    }

    async executeGlobal(actorId: string): Promise<number> {
        const timestamp = new Date().toISOString();
        const agents = await this.repo.stopAllAgents(actorId, timestamp);

        await this.repo.logKillEvent({ agentId: null, action: 'global_stop', actorId, timestamp });
        await this.fireWebhook({ agentId: 'ALL', action: 'stop', actorId, timestamp });

        return agents.length;
    }

    private async fireWebhook(payload: any) {
        if (!this.webhookUrl) return;
        try {
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: payload.action === 'stop' ? 'EMERGENCY_STOP' : 'AGENT_RESTORED',
                    ...payload,
                    source: 'AgentOps Mission Control',
                }),
            });
        } catch (error) {
            console.error('[ExecuteKillSwitch] Webhook failed:', error);
        }
    }
}
