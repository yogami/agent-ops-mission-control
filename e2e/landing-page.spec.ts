/**
 * ATDD: Landing Page Acceptance Test
 * 
 * Verifies the Mission Control hero and fleet grid display correctly.
 */

import { test, expect } from '@playwright/test';

test.describe('Enterprise Discovery Platform - Landing Page', () => {
    test('should display Mission Control hero and fleet grid', async ({ page }) => {
        await page.goto('/');

        // Hero section
        await expect(page.locator('h1')).toContainText('Agent Governance');
        await expect(page.locator('h1')).toContainText('Platform');

        // Stats visible - use exact match
        await expect(page.getByText('Services', { exact: true })).toBeVisible();
        await expect(page.getByText('Avg Trust', { exact: true })).toBeVisible();

        // Fleet grid visible
        await expect(page.getByTestId('fleet-grid')).toBeVisible();
        await expect(page.getByTestId('agent-card').first()).toBeVisible();

        // At least 5 agents displayed
        const agentCards = page.getByTestId('agent-card');
        await expect(agentCards).toHaveCount(8);
    });

    test('should display differentiators section', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'Vendor Neutral' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Privacy-Preserving Audit' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Runtime Enforcement' })).toBeVisible();
    });

    test('should navigate to discover page', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('link', { name: 'Discover Agents' }).click();
        await page.waitForURL('/discover');

        await expect(page.locator('h1')).toContainText('Discover');
    });
});
