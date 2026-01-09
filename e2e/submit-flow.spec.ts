/**
 * ATDD: Agent Submission Flow Tests
 * 
 * Verifies the vendor agent submission flow and form validation.
 */

import { test, expect } from '@playwright/test';

test.describe('EU Compliance Agent Registry - Submission Flow', () => {
    test('should navigate to submit page from discover', async ({ page }) => {
        await page.goto('/discover');

        await page.getByTestId('submit-agent-cta').click();
        await expect(page).toHaveURL('/submit');
        await expect(page.getByRole('heading', { name: /Submit Your Agent/i })).toBeVisible();
    });

    test('should display multi-step form', async ({ page }) => {
        await page.goto('/submit');

        // Step indicators visible (use specific span selectors)
        await expect(page.locator('span:has-text("Details")').first()).toBeVisible();
        await expect(page.locator('span:has-text("Compliance")').first()).toBeVisible();
        await expect(page.locator('span:has-text("Confirm")').first()).toBeVisible();

        // Form visible
        await expect(page.getByTestId('input-name')).toBeVisible();
    });

    test('should validate agent name is required', async ({ page }) => {
        await page.goto('/submit');

        // Try to proceed without name
        const nextButton = page.getByTestId('btn-next-1');
        await expect(nextButton).toBeDisabled();

        // Add name
        await page.getByTestId('input-name').fill('Test Agent');
        await expect(nextButton).toBeEnabled();
    });

    test('should complete full submission flow', async ({ page }) => {
        await page.goto('/submit');

        // Step 1: Fill details
        await page.getByTestId('input-name').fill('E2E Test Agent');
        await page.getByTestId('input-description').fill('An agent created by E2E tests');
        await page.getByTestId('input-endpoint').fill('https://test-agent.example.com');
        await page.getByTestId('btn-next-1').click();

        // Step 2: Select compliance badges
        await expect(page.getByText('Compliance Self-Declaration')).toBeVisible();
        await page.getByTestId('badge-GDPR').click();
        await page.getByTestId('badge-AI_ACT').click();
        await page.getByTestId('btn-next-2').click();

        // Step 3: Confirm and submit
        await expect(page.getByText('Review & Submit')).toBeVisible();
        await expect(page.getByText('E2E Test Agent')).toBeVisible();
        await expect(page.getByText('GDPR, AI_ACT')).toBeVisible();

        // Accept ToS
        await page.getByTestId('checkbox-tos').click();

        // Submit button should be enabled
        await expect(page.getByTestId('btn-submit')).toBeEnabled();
    });

    test('should allow navigating back between steps', async ({ page }) => {
        await page.goto('/submit');

        // Go to step 2
        await page.getByTestId('input-name').fill('Back Test Agent');
        await page.getByTestId('btn-next-1').click();

        // Go back to step 1
        await page.getByTestId('btn-back-2').click();
        await expect(page.getByTestId('input-name')).toHaveValue('Back Test Agent');
    });
});
