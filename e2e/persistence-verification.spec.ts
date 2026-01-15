/**
 * ATDD: Persistence Verification Test
 * 
 * Verifies that discovered agents added to the registry actually 
 * persist and appear on the Management Dashboard.
 */

import { test, expect } from '@playwright/test';

test.describe('Shadow Discovery to Management Persistence', () => {
    test('should discover an agent, add it, and find it on the management dashboard', async ({ page }) => {
        // 1. Go to Scan page
        await page.goto('/discover/scan');

        // 2. Perform a demo scan (AWS)
        await page.getByTestId('provider-aws').click();
        await page.getByTestId('btn-next-provider').click();
        await page.getByTestId('btn-start-scan').click();

        // 3. Wait for results and find 'bedrock-claude-3'
        await expect(page.getByText('Discovered Agents')).toBeVisible({ timeout: 10000 });
        const agentName = 'bedrock-claude-3';
        const agentRow = page.locator('[data-testid="discovered-agent"]', { hasText: agentName });
        await expect(agentRow).toBeVisible();

        // 4. Click Add to Registry
        await agentRow.getByTestId('add-to-registry').click();
        await expect(agentRow.getByText('✓ Added')).toBeVisible();

        // 5. Navigate to Management Dashboard
        await page.getByRole('link', { name: 'View Your Fleet →' }).click();
        await expect(page).toHaveURL('/manage');

        // 6. Verify agent appears in the 'Scheduled' column
        // We wait for the kanban board to load
        await expect(page.getByTestId('kanban-board')).toBeVisible();

        // Search for the agent name in the Kanban board
        // Note: New agents go to 'Scheduled' by default
        const kanbanCard = page.getByTestId('agent-card').filter({ hasText: agentName });
        await expect(kanbanCard.first()).toBeVisible({ timeout: 10000 });

        // Optional: verify it is in the Scheduled column specifically
        const scheduledColumn = page.locator('[data-testid="kanban-column-scheduled"]');
        await expect(scheduledColumn.getByText(agentName)).toBeVisible();
    });
});
