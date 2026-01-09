import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ManagerAgentCard from './ManagerAgentCard';
import { createAgent } from '@/domain/Agent';

describe('ManagerAgentCard Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render agent name and trust score', () => {
        const agent = createAgent({ name: 'Manager Agent', trustScore: 92 });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText('Manager Agent')).toBeDefined();
        expect(screen.getByText('92%')).toBeDefined();
    });

    it('should show DID:VERIFIED if DID exists', () => {
        const agent = createAgent({ name: 'DID Agent', did: 'did:abc' });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText('DID:VERIFIED')).toBeDefined();
    });

    it('should show last action if it exists', () => {
        const agent = createAgent({ name: 'Action Agent', lastAction: 'Validating KYC' });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText('Validating KYC')).toBeDefined();
    });

    it('should format time remaining correctly', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(tomorrow.getHours() + 2);

        const agent = createAgent({ name: 'Deadline Agent', deadline: tomorrow.toISOString() });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText(/left/)).toBeDefined();
    });

    it('should show Overdue for past deadline', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const agent = createAgent({ name: 'Late Agent', deadline: yesterday.toISOString() });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText('⏱️ Overdue')).toBeDefined();
    });

    it('should show hours and minutes left', () => {
        const soon = new Date();
        soon.setHours(soon.getHours() + 2);

        const agent = createAgent({ name: 'Soon Agent', deadline: soon.toISOString() });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText(/2h 0m left/)).toBeDefined();
    });

    it('should show minutes only left', () => {
        const verySoon = new Date();
        verySoon.setMinutes(verySoon.getMinutes() + 15);

        const agent = createAgent({ name: 'Very Soon Agent', deadline: verySoon.toISOString() });
        render(<ManagerAgentCard agent={agent} />);

        expect(screen.getByText(/15m left/)).toBeDefined();
    });
});
