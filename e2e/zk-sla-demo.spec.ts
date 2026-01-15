/**
 * ATDD: ZK-SLA Demo Acceptance Tests
 * 
 * Verifies the Zero-Knowledge SLA Verification interactive demo page.
 * This is a key demo feature for CIC presentation.
 */

import { test, expect } from '@playwright/test';

test.describe('ZK-SLA Demo - Interactive Proof Simulation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/demo/zk-sla');
    });

    test('should display ZK-SLA demo page header', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Zero-Knowledge');
        await expect(page.locator('h1')).toContainText('SLA Verification');
        await expect(page.getByText('Proving agent compliance without revealing internal state')).toBeVisible();
    });

    test('should display proof sequence phases', async ({ page }) => {
        await expect(page.getByText('Phase 1: ZK-SLA Proof')).toBeVisible();
        await expect(page.getByText('Phase 2: Credential Issuance')).toBeVisible();
        await expect(page.getByText('Phase 3: Semantic Alignment')).toBeVisible();
    });

    test('should display terminal panel in idle state', async ({ page }) => {
        await expect(page.getByText('Governance Node Output')).toBeVisible();
        await expect(page.getByText('SYSTEM IDLE: Waiting for trigger...')).toBeVisible();
    });

    test('should display simulation button', async ({ page }) => {
        const button = page.getByRole('button', { name: 'Initialize ZK Simulation' });
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
    });

    test('should run full ZK simulation and show TRUST ESTABLISHED', async ({ page }) => {
        // Start simulation
        await page.getByRole('button', { name: 'Initialize ZK Simulation' }).click();

        // Wait for Phase 1: ZK-SLA Proof
        await expect(page.getByText('PROVED')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('✓ Proof Generated: groth16/bn128')).toBeVisible({ timeout: 5000 });

        // Wait for Phase 2: Credential Issuance
        await expect(page.getByText('ISSUED')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('✓ Issuing Credential: AgentSlaVerified-2026.json')).toBeVisible({ timeout: 5000 });

        // Wait for Phase 3: Semantic Alignment
        await expect(page.getByText('VERIFIED').first()).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('✓ Semantic Proof Valid')).toBeVisible({ timeout: 5000 });

        // Final state: TRUST ESTABLISHED
        await expect(page.getByText('TRUST ESTABLISHED')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('Agent interaction authorized for production')).toBeVisible();
    });

    test('should show reset button after simulation completes', async ({ page }) => {
        // Start and complete simulation
        await page.getByRole('button', { name: 'Initialize ZK Simulation' }).click();

        // Wait for completion
        await expect(page.getByText('TRUST ESTABLISHED')).toBeVisible({ timeout: 10000 });

        // Button should now say Reset
        await expect(page.getByRole('button', { name: 'Reset Simulation' })).toBeVisible();
    });

    test('should display How it works explanation', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
        await expect(page.getByText('Zero-Knowledge Proofs allow agents to prove')).toBeVisible();
        await expect(page.getByText('AgentOps Suite')).toBeVisible();
    });

    test('should navigate back to Mission Control', async ({ page }) => {
        await page.getByRole('link', { name: '← Back to Mission Control' }).click();
        await page.waitForURL('/');
        await expect(page.locator('h1')).toContainText('EU Compliance');
    });

    test('should be accessible from landing page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'ZK-SLA Demo →' }).click();
        await page.waitForURL('/demo/zk-sla');
        await expect(page.locator('h1')).toContainText('Zero-Knowledge');
    });
});
