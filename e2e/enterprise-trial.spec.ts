/**
 * ATDD: Enterprise Trial Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Enterprise Controls - Trial Flow', () => {
    test('should display enterprise trial button on landing page', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByTestId('enterprise-trial-btn')).toBeVisible();
        await expect(page.getByText('Start Enterprise Trial')).toBeVisible();
    });

    test('should open trial modal on button click', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('enterprise-trial-btn').click();
        await expect(page.getByTestId('enterprise-trial-modal')).toBeVisible();
        await expect(page.getByText('14 days full access')).toBeVisible();
    });

    test('should validate required fields in trial form', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('enterprise-trial-btn').click();

        // Submit button should be disabled without required fields
        await expect(page.getByTestId('btn-start-trial')).toBeDisabled();

        // Fill company name
        await page.getByTestId('input-company').fill('Test Corp');
        await expect(page.getByTestId('btn-start-trial')).toBeDisabled();

        // Fill email
        await page.getByTestId('input-email').fill('test@testcorp.com');
        await expect(page.getByTestId('btn-start-trial')).toBeEnabled();
    });

    test('should submit trial form and show success', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('enterprise-trial-btn').click();

        await page.getByTestId('input-company').fill('Demo Company');
        await page.getByTestId('input-email').fill('demo@company.com');
        await page.getByTestId('input-usecase').selectOption('compliance');
        await page.getByTestId('btn-start-trial').click();

        // Wait for success state
        await expect(page.getByText('Welcome to AgentOps!')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('14-day enterprise trial is now active')).toBeVisible();
    });
});
