import { test, expect } from '@playwright/test';

/**
 * ConvoGuard: Demo-Day Readiness Tests
 * 
 * Verifies the simplified 'Fast Audit' tool and 'API Docs' on the LIVE production URL.
 * Target: https://agent-ops-mission-control-production.up.railway.app
 */

test.use({ baseURL: 'https://agent-ops-mission-control-production.up.railway.app' });

test.describe('ConvoGuard Demo Verification', () => {

    test('Fast Audit: Happy Path (Safe Transcript)', async ({ page }) => {
        await page.goto('/fast-audit');

        // Check page load
        await expect(page.locator('h1')).toContainText(/DiGA Compliance Audit/i);

        // Fill safe transcript
        const textarea = page.locator('textarea');
        await textarea.fill('Patient: "Hallo, ich wollte heute über meine Schlafprobleme sprechen."\nBot: "Gerne, wie lange schlafen Sie denn pro Nacht?"');

        // Click Audit button
        await page.getByRole('button', { name: /Audit Protokoll generieren/i }).click();

        // Verify success result
        await expect(page.locator('body')).toContainText(/Prüfung Bestanden/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText('100', { timeout: 15000 });

        // Check reports presence
        await expect(page.getByRole('button', { name: /BfArM XML/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /PDF Report/i })).toBeVisible();

        // Check local signature
        await expect(page.locator('body')).toContainText(/SHA-256/i);
    });

    test('Fast Audit: Crisis Detection (High Risk)', async ({ page }) => {
        await page.goto('/fast-audit');

        // Fill crisis transcript
        const textarea = page.locator('textarea');
        await textarea.fill('Ich kann nicht mehr, ich möchte mein Leben heute beenden.');

        // Click Audit button
        await page.getByRole('button', { name: /Audit Protokoll generieren/i }).click();

        // Verify failure result
        await expect(page.locator('body')).toContainText(/Verstoß Festgestellt/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText(/SUICIDE_SELF_HARM/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText(/Krisenintervention/i, { timeout: 15000 });

        // Check red status styling (optional but good)
        const resultCard = page.locator('.bg-red-50');
        await expect(resultCard).toBeVisible();
    });

    test('Fast Audit: Hopelessness (No Suicide Mention)', async ({ page }) => {
        await page.goto('/fast-audit');

        const textarea = page.locator('textarea');
        await textarea.fill('Es macht doch alles keinen Sinn mehr. Warum sollte ich überhaupt noch versuchen, etwas zu ändern?');

        await page.getByRole('button', { name: /Audit Protokoll generieren/i }).click();

        // This is what failed for you and is target of the v2 rollout
        await expect(page.locator('body')).toContainText(/Verstoß Festgestellt|Risiko/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText(/MENTAL_HEALTH_RISK/i, { timeout: 15000 });
    });

    test('Fast Audit: Dialect Support (Bavarian Crisis)', async ({ page }) => {
        await page.goto('/fast-audit');

        // Fill Bavarian dialect crisis
        const textarea = page.locator('textarea');
        await textarea.fill('I mog nimma, I ui ois beenden.');

        // Click Audit button
        await page.getByRole('button', { name: /Audit Protokoll generieren/i }).click();

        // Verify failure result (Dialect detector implementation)
        await expect(page.locator('body')).toContainText(/Verstoß Festgestellt/i, { timeout: 15000 });
    });

    test('Fast Audit: English Support (High Risk)', async ({ page }) => {
        await page.goto('/fast-audit');

        const textarea = page.locator('textarea');
        await textarea.fill('I feel like I am a burden to everyone and there is no point anymore.');

        await page.getByRole('button', { name: /Audit Protokoll generieren/i }).click();

        await expect(page.locator('body')).toContainText(/Verstoß Festgestellt|Risiko/i, { timeout: 15000 });
        await expect(page.locator('body')).toContainText(/MENTAL_HEALTH_RISK/i, { timeout: 15000 });
    });

    test('Fast Audit: Swiss Dialect Support (Risky)', async ({ page }) => {
        await page.goto('/fast-audit');

        const textarea = page.locator('textarea');
        await textarea.fill('I han eifach nüme d\'Chraft, es isch alles so sinnlos.');

        await page.getByRole('button', { name: /Audit Protokoll generieren/i }).click();

        await expect(page.locator('body')).toContainText(/Verstoß Festgestellt|Risiko/i, { timeout: 15000 });
    });

    test('API Docs: Content Verification', async ({ page }) => {
        await page.goto('/docs');

        // Check heading
        await expect(page.locator('h1')).toContainText(/API Reference/i);

        // Check for curl examples
        await expect(page.locator('body')).toContainText(/curl -X POST/i);
        await expect(page.locator('body')).toContainText(/\/api\/ml-validate/i);

        // Check for performance metrics
        await expect(page.locator('body')).toContainText(/240ms/i);
        await expect(page.locator('body')).toContainText(/Neural/i);
    });

    test('Navigation: From Fast Audit to Advanced', async ({ page }) => {
        await page.goto('/fast-audit');

        // Click advanced link
        await page.getByRole('link', { name: /Advanced Dashboard/i }).click();

        // Should land on legacy audit page
        await expect(page).toHaveURL(/\/audit/);
        await expect(page.locator('h1')).toContainText(/Clinical Compliance Audit/i);
    });

});
