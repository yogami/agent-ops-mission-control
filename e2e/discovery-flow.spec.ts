/**
 * ATDD: Discovery Flow Acceptance Test
 * 
 * Verifies search functionality and result display.
 */

import { test, expect } from '@playwright/test';

test.describe('Enterprise Discovery Platform - Discovery Flow', () => {
    test('should search for agents and display results', async ({ page }) => {
        await page.goto('/discover');

        // Search bar visible
        await expect(page.getByPlaceholder(/Search for agents/)).toBeVisible();

        // Perform search
        await page.getByPlaceholder(/Search for agents/).fill('GDPR');
        await page.getByRole('button', { name: 'Search' }).click();

        // Wait for search to complete (loading state to finish)
        await page.waitForTimeout(1000);

        // Should have at least 1 result for GDPR
        const cardCount = await page.getByTestId('agent-card').count();
        expect(cardCount).toBeGreaterThanOrEqual(1);
    });

    test('should show all agents initially', async ({ page }) => {
        await page.goto('/discover');

        // All agents visible before search
        await expect(page.getByTestId('agent-card')).toHaveCount(8);
    });

    test('should handle no results gracefully', async ({ page }) => {
        await page.goto('/discover');

        await page.getByPlaceholder(/Search for agents/).fill('xyznonexistent123');
        await page.getByRole('button', { name: 'Search' }).click();

        // Wait for search to complete
        await page.waitForTimeout(1000);

        // Should show no results message
        await expect(page.getByText(/No agents found/)).toBeVisible();
    });

    test('should use quick suggestion buttons', async ({ page }) => {
        await page.goto('/discover');

        // Click a suggestion
        await page.getByRole('button', { name: 'HR screening' }).click();

        // Should trigger search
        await expect(page.getByTestId('search-results')).toBeVisible();
    });

    test('should display compliance badges legend', async ({ page }) => {
        await page.goto('/discover');

        await expect(page.getByRole('heading', { name: 'Compliance Badges' })).toBeVisible();
        // Use first() to avoid strict mode violations for badges that appear multiple times
        await expect(page.getByText('✓ EU AI Act').first()).toBeVisible();
        await expect(page.getByText('✓ GDPR').first()).toBeVisible();
        await expect(page.getByText('✓ DiGA').first()).toBeVisible();
    });
});
