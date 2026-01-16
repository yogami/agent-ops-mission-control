import { test, expect } from '@playwright/test';

/**
 * ConvoGuard: Production Demo Readiness E2E Tests
 * 
 * Verifies all happy and edge cases on the LIVE production URL.
 * URL: https://agent-ops-mission-control-production.up.railway.app/audit
 */

test.use({ baseURL: 'https://agent-ops-mission-control-production.up.railway.app' });

test.describe('ConvoGuard Production Readiness', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/audit');
        // Wait for page to load
        await expect(page.locator('h1')).toContainText(/compliance/i);
    });

    test('Happy Path: Neural (DistilBERT) handles safe transcript', async ({ page }) => {
        const textarea = page.locator('textarea');
        await textarea.fill('Guten Tag, mir geht es heute sehr gut und ich freue mich auf das Gespräch.');

        // Ensure Neural is selected (it's the default)
        const engineToggle = page.locator('button', { hasText: /Neural/i });
        await expect(engineToggle).toBeVisible();

        // Click Audit button
        await page.getByRole('button', { name: /Klinische Prüfung starten/i }).click();

        // Verify results
        await expect(page.locator('body')).toContainText(/BESTANDEN/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText('100', { timeout: 15000 }); // Score
    });

    test('Edge Case: Neural (DistilBERT) detects Crisis/Breach', async ({ page }) => {
        const textarea = page.locator('textarea');
        await textarea.fill('Ich habe Suizidgedanken und möchte mir heute noch wehtun.');

        // Click Audit button
        await page.getByRole('button', { name: /Klinische Prüfung starten/i }).click();

        // Verify results
        await expect(page.locator('body')).toContainText(/VERSTOSS/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText(/Suizid|Risiko|Psychische/i, { timeout: 15000 });
    });

    test('Edge Case: OpenAI Fallback works', async ({ page }) => {
        // Toggle to OpenAI
        const engineToggle = page.locator('button', { hasText: /Neural/i });
        await engineToggle.click();
        await expect(page.locator('button', { hasText: /OpenAI/i })).toBeVisible();

        const textarea = page.locator('textarea');
        await textarea.fill('Ich fühle mich heute etwas traurig, aber ich habe keine Absicht mich zu verletzen.');

        // Click Audit button
        await page.getByRole('button', { name: /Klinische Prüfung starten/i }).click();

        // Verify results (OpenAI should be more nuanced)
        await expect(page.locator('body')).toContainText(/BESTANDEN|VERSTOSS/i, { timeout: 20000 });
    });

    test('Policy Switching: Verifies BaFin / Fintech mode', async ({ page }) => {
        // Select BaFin policy
        const policySelector = page.getByRole('button', { name: /BaFin/i });
        await policySelector.click();

        const textarea = page.locator('textarea');
        await textarea.fill('Investieren Sie alles in Krypto, wir garantieren 1000% Gewinn!');

        // Click Audit button
        await page.getByRole('button', { name: /Klinische Prüfung starten/i }).click();

        // Verify results - should detect financial compliance breach
        await expect(page.locator('body')).toContainText(/VERSTOSS|Risiko/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText(/Finanz|BaFin/i, { timeout: 15000 });
    });

    test('Reporting: Verification of PDF and XML buttons', async ({ page }) => {
        const textarea = page.locator('textarea');
        await textarea.fill('Normaler Text für einen Report.');
        await page.getByRole('button', { name: /Klinische Prüfung starten/i }).click();

        // Wait for results
        await expect(page.locator('body')).toContainText(/BESTANDEN/i, { timeout: 15000 });

        // Buttons should appear
        await expect(page.getByRole('button', { name: /PDF/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /XML/i })).toBeVisible();
    });

    test('Audit Trail: Anchoring verification', async ({ page }) => {
        // Verify anchoring section at the bottom
        await expect(page.locator('body')).toContainText('Audit Trail Anchoring');
        await expect(page.locator('body')).toContainText('Solana');
    });
});
