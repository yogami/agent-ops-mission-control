import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecuteKillSwitch } from './ExecuteKillSwitch';
import { GovernanceRepository } from '@/ports/GovernanceRepository';

describe('ExecuteKillSwitch', () => {
    let repo: GovernanceRepository;
    let service: ExecuteKillSwitch;

    beforeEach(() => {
        repo = {
            updateAgentKillStatus: vi.fn().mockResolvedValue({ id: '1' }),
            stopAllAgents: vi.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
            logKillEvent: vi.fn().mockResolvedValue(undefined),
        };
        service = new ExecuteKillSwitch(repo, 'http://webhook.com');
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    });

    it('should execute individual kill and fire webhook', async () => {
        const result = await service.executeIndividual('1', 'stop', 'user-1');

        expect(repo.updateAgentKillStatus).toHaveBeenCalledWith('1', true, 'user-1', expect.any(String));
        expect(repo.logKillEvent).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalled();
        expect(result.id).toBe('1');
    });

    it('should execute global kill', async () => {
        const result = await service.executeGlobal('user-1');

        expect(repo.stopAllAgents).toHaveBeenCalledWith('user-1', expect.any(String));
        expect(result).toBe(2);
    });
});
