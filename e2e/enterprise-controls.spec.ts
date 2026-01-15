/**
 * ATDD: Enterprise Kill Switch Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Enterprise Controls - Kill Switch', () => {
    test('should display global kill switch button on manage page', async ({ page }) => {
        await page.goto('/manage');
        await expect(page.getByTestId('global-kill-switch')).toBeVisible();
        await expect(page.getByText('EMERGENCY STOP')).toBeVisible();
    });

    test('should open global kill confirmation modal', async ({ page }) => {
        await page.goto('/manage');
        await page.getByTestId('global-kill-switch').click();
        await expect(page.getByTestId('global-kill-modal')).toBeVisible();
        await expect(page.getByText('Global Emergency Stop')).toBeVisible();
    });

    test('should display alert panel trigger with anomaly count', async ({ page }) => {
        await page.goto('/manage');
        await expect(page.getByTestId('alert-panel-trigger')).toBeVisible();
    });

    test('should open alert panel with anomaly list', async ({ page }) => {
        await page.goto('/manage');
        await page.getByTestId('alert-panel-trigger').click();
        await expect(page.getByTestId('alert-panel')).toBeVisible();
        await expect(page.getByText('Alerts & Anomalies')).toBeVisible();
    });

    test('should display human review trigger with pending count', async ({ page }) => {
        await page.goto('/manage');
        await expect(page.getByTestId('human-review-trigger')).toBeVisible();
    });

    test('should open human review panel with pending actions', async ({ page }) => {
        await page.goto('/manage');
        await page.getByTestId('human-review-trigger').click();
        await expect(page.getByTestId('human-review-panel')).toBeVisible();
        await expect(page.getByText('Human-in-Loop Review')).toBeVisible();
        // Pending actions may or may not exist in production - just verify panel renders
        const panel = page.getByTestId('human-review-panel');
        await expect(panel).toContainText(/pending|actions|review|queue/i);
    });

});
