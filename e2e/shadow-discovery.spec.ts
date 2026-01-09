/**
 * ATDD: Shadow AI Discovery Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Enterprise Controls - Shadow Discovery', () => {
    test('should navigate to scan page from landing', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('scan-agents-btn').click();
        await expect(page).toHaveURL('/discover/scan');
        await expect(page.getByText('Shadow AI Discovery')).toBeVisible();
    });

    test('should display cloud provider selection', async ({ page }) => {
        await page.goto('/discover/scan');
        await expect(page.getByTestId('provider-aws')).toBeVisible();
        await expect(page.getByTestId('provider-azure')).toBeVisible();
        await expect(page.getByTestId('provider-openai')).toBeVisible();
        await expect(page.getByTestId('provider-gcp')).toBeVisible();
    });

    test('should proceed through scan wizard', async ({ page }) => {
        await page.goto('/discover/scan');

        // Select provider
        await page.getByTestId('provider-aws').click();
        await page.getByTestId('btn-next-provider').click();

        // Enter credentials
        await expect(page.getByTestId('input-key')).toBeVisible();
        await page.getByTestId('input-key').fill('test-key');
        await page.getByTestId('input-secret').fill('test-secret');
        await page.getByTestId('btn-start-scan').click();

        // Wait for scan to complete
        await expect(page.getByText('Discovered Agents')).toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('discovered-agent').first()).toBeVisible();
    });

    test('should add discovered agent to registry', async ({ page }) => {
        await page.goto('/discover/scan');

        await page.getByTestId('provider-aws').click();
        await page.getByTestId('btn-next-provider').click();
        await page.getByTestId('btn-start-scan').click();

        await expect(page.getByText('Discovered Agents')).toBeVisible({ timeout: 10000 });

        await page.getByTestId('add-to-registry').first().click();
        await expect(page.getByText('✓ Added').first()).toBeVisible();
    });
});
