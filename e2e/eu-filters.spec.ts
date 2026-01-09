/**
 * ATDD: EU Compliance Filter Tests
 * 
 * Verifies compliance filter functionality in the Discovery page.
 */

import { test, expect } from '@playwright/test';

test.describe('EU Compliance Agent Registry - Filter Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/discover');
    });

    test('should display compliance filter chips', async ({ page }) => {
        await expect(page.getByTestId('compliance-filter')).toBeVisible();
        await expect(page.getByTestId('filter-GDPR')).toBeVisible();
        await expect(page.getByTestId('filter-AI_ACT')).toBeVisible();
        await expect(page.getByTestId('filter-DIGA')).toBeVisible();
        await expect(page.getByTestId('filter-DATA_RESIDENCY_EU')).toBeVisible();
    });

    test('should filter agents by GDPR badge', async ({ page }) => {
        // Click GDPR filter
        await page.getByTestId('filter-GDPR').click();

        // Should show checkmark on selected filter
        await expect(page.getByTestId('filter-GDPR')).toContainText('✓');

        // Perform a search to trigger filtering
        await page.getByPlaceholder(/Search for agents/).fill('agent');
        await page.getByRole('button', { name: 'Search' }).click();
        await page.waitForTimeout(1000);

        // All visible agents should have GDPR badge
        const cards = page.getByTestId('agent-card');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);

        // Check each card contains GDPR badge
        for (let i = 0; i < count; i++) {
            await expect(cards.nth(i)).toContainText('GDPR');
        }
    });

    test('should filter agents by EU Data Residency badge', async ({ page }) => {
        await page.getByTestId('filter-DATA_RESIDENCY_EU').click();

        // Use a search term that matches all agents, then filter by badge
        await page.getByPlaceholder(/Search for agents/).fill('a');
        await page.getByRole('button', { name: 'Search' }).click();
        await page.waitForTimeout(1000);

        // Should have reduced results (only ConvoGuard and Trust Verifier have DATA_RESIDENCY_EU)
        const cards = page.getByTestId('agent-card');
        const count = await cards.count();
        expect(count).toBe(2);
    });

    test('should combine multiple filters (GDPR + AI Act)', async ({ page }) => {
        await page.getByTestId('filter-GDPR').click();
        await page.getByTestId('filter-AI_ACT').click();

        // Search for all agents
        await page.getByPlaceholder(/Search for agents/).fill('a');
        await page.getByRole('button', { name: 'Search' }).click();
        await page.waitForTimeout(1000);

        // Only agents with BOTH badges should appear
        const cards = page.getByTestId('agent-card');
        const count = await cards.count();

        // ConvoGuard and Fairness Auditor have both GDPR + AI_ACT
        expect(count).toBe(2);
    });

    test('should clear all filters', async ({ page }) => {
        // Select some filters
        await page.getByTestId('filter-GDPR').click();
        await page.getByTestId('filter-AI_ACT').click();

        // Clear all
        await page.getByRole('button', { name: 'Clear all' }).click();

        // Filters should be deselected
        await expect(page.getByTestId('filter-GDPR')).not.toContainText('✓');
        await expect(page.getByTestId('filter-AI_ACT')).not.toContainText('✓');
    });

    test('should show EU Data Residency in compliance legend', async ({ page }) => {
        await expect(page.getByText('✓ EU Data Residency').first()).toBeVisible();
        await expect(page.getByText('Data stored within EU')).toBeVisible();
    });
});
