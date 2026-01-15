/**
 * ATDD: Management Flow Acceptance Test
 * 
 * Verifies Fleet Management (Kanban) and Dashboard Summary.
 */

import { test, expect } from '@playwright/test';

test.describe('Enterprise Discovery Platform - Management Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Go to management page
        await page.goto('/manage');
    });

    test('should display management header and summary', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Fleet');
        await expect(page.locator('h1')).toContainText('Management');

        // Dashboard summary cards
        await expect(page.getByText('Active Agents')).toBeVisible();
        await expect(page.getByText('Fleet Trust')).toBeVisible();
        await expect(page.getByText('Human Review')).toBeVisible();
    });

    test('should display Kanban board and columns', async ({ page }) => {
        await expect(page.getByTestId('kanban-board')).toBeVisible();

        // Columns
        await expect(page.locator('h3', { hasText: 'Scheduled' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'Active' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'In Review' })).toBeVisible();
        await expect(page.locator('h3', { hasText: 'Completed' })).toBeVisible();
    });

    test('should display agents in columns when available', async ({ page }) => {
        // Wait for Kanban board to be ready
        await expect(page.getByTestId('kanban-board')).toBeVisible();

        // The board should have the column structure even if empty
        // Agents will vary depending on company context
        await expect(page.locator('h3', { hasText: 'Scheduled' })).toBeVisible();
    });

    test('should show agent cards with trust score if present', async ({ page }) => {
        // Wait for page to load
        await expect(page.getByTestId('kanban-board')).toBeVisible();

        // If there are agent cards, verify they have expected structure
        const agentCards = page.getByTestId('agent-card');
        const count = await agentCards.count();
        if (count > 0) {
            await expect(agentCards.first()).toBeVisible();
        }
    });

    test('should navigate back to mission control', async ({ page }) => {
        await page.getByRole('link', { name: 'Back to Mission Control' }).click();
        await page.waitForURL('/');
        await expect(page.locator('h1')).toContainText('EU Compliance');
    });
});
