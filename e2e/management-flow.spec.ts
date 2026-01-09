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

    test('should display seeded agents in columns', async ({ page }) => {
        // Wait for agents to load (since they are fetched from API)
        await page.waitForSelector('[data-testid="agent-card"]', { timeout: 10000 });

        // Check for specific agents we seeded
        await expect(page.getByText('KYC Validator')).toBeVisible();
        await expect(page.getByText('Privacy Auditor')).toBeVisible();
        await expect(page.getByText('Medical Scribe')).toBeVisible();
    });

    test('should toggle agent details in Kanban mobile view/interactive', async ({ page }) => {
        const firstCard = page.getByTestId('agent-card').first();
        await expect(firstCard).toBeVisible();

        // Check for details like DID or Deadline
        await expect(firstCard.getByText('DID:')).toBeVisible();
    });

    test('should navigate back to mission control', async ({ page }) => {
        await page.getByRole('link', { name: 'Back to Mission Control' }).click();
        await page.waitForURL('/');
        await expect(page.locator('h1')).toContainText('Agent Governance');
    });
});
