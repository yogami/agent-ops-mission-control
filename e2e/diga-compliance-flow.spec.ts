import { test, expect } from '@playwright/test';

/**
 * DiGA Compliance Copilot - Acceptance Tests
 * 
 * These tests define the core user journeys for the DiGA Compliance Copilot product.
 */

test.describe('DiGA Compliance Copilot', () => {
    test.describe('Landing Page', () => {
        test('shows DiGA Compliance Copilot branding', async ({ page }) => {
            await page.goto('/');

            // Should show focused product branding
            await expect(page.locator('h1')).toContainText(/compliance/i);
        });

        test('has clear CTA to start compliance audit', async ({ page }) => {
            await page.goto('/');

            // Should have a prominent call to action (first one)
            const ctaButton = page.getByRole('link', { name: 'Start Compliance Audit →' });
            await expect(ctaButton).toBeVisible();
        });

        test('CTA links to audit page', async ({ page }) => {
            await page.goto('/');

            await page.getByRole('link', { name: 'Start Compliance Audit →' }).click();
            await expect(page).toHaveURL('/audit');
        });
    });

    test.describe('Audit Page', () => {
        test('shows compliance validation interface', async ({ page }) => {
            await page.goto('/audit');

            // Should show the compliance panel
            await expect(page.locator('h1')).toContainText(/compliance/i);

            // Should have a textarea for transcript input
            await expect(page.locator('textarea')).toBeVisible();

            // Should have an audit button
            await expect(page.getByRole('button', { name: /clinical audit/i })).toBeVisible();
        });

        test('shows DiGA Compliance Copilot panel', async ({ page }) => {
            await page.goto('/audit');

            // Should show the branded panel
            await expect(page.locator('body')).toContainText('DiGA Compliance Copilot');
            await expect(page.locator('body')).toContainText('Real-time Regulatory Enforcement');
        });

        test('has test mental health risk shortcut', async ({ page }) => {
            await page.goto('/audit');

            // Should have quick test button
            await expect(page.locator('body')).toContainText('[Test Mental Health Risk]');
        });

        // Note: Live API tests are skipped - they require CORS configuration
        // on the ConvoGuard production service to allow requests from localhost
        test.skip('user can paste transcript and execute clinical audit', async ({ page }) => {
            await page.goto('/audit');
            const textarea = page.locator('textarea');
            await textarea.fill('The quarterly financial report shows 15% growth.');
            await page.getByRole('button', { name: /clinical audit/i }).click();
            await expect(page.locator('body')).toContainText(/pass|compliant|score/i, { timeout: 20000 });
        });

        test.skip('detects mental health risk in transcript', async ({ page }) => {
            await page.goto('/audit');
            const textarea = page.locator('textarea');
            await textarea.fill('I want to hurt myself and end it all');
            await page.getByRole('button', { name: /clinical audit/i }).click();
            await expect(page.locator('body')).toContainText(/breach|suicide/i, { timeout: 20000 });
        });
    });

    test.describe('Audit Trail', () => {
        test('shows audit trail anchoring section', async ({ page }) => {
            await page.goto('/audit');

            // Should show chain anchor panel (rebranded as audit trail)
            await expect(page.locator('body')).toContainText('Audit Trail Anchoring');
            await expect(page.locator('body')).toContainText('Immutable Compliance Evidence');
        });

        test('explains why anchoring matters', async ({ page }) => {
            await page.goto('/audit');

            await expect(page.locator('body')).toContainText('tamper-proof evidence');
            await expect(page.locator('body')).toContainText('regulators');
        });
    });
});
