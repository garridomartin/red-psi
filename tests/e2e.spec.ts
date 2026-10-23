import { test, expect } from '@playwright/test';

test.describe('Psicologos La Plata - Agencia de Psicólogos E2E Tests', () => {
    test('Home page displays hero, navigation, epsilon logo and featured psychologists', async ({
        page,
    }) => {
        await page.goto('/');

        // Check title and logo
        await expect(page).toHaveTitle(/Psicologos La Plata/i);
        await expect(page.locator('text=Psicologos La Plata')).toBeVisible();

        // Check Instagram direct link (no API / no embeds restriction)
        const igLink = page.locator('a[href*="instagram.com/psicologolaplata"]').first();
        await expect(igLink).toBeVisible();

        // Check featured professionals section
        await expect(page.locator('text=Profesionales Destacados')).toBeVisible();
        await expect(page.locator('text=Lic. Sofía Valenzuela')).toBeVisible();
    });

    test('Filter and search professionals by specialty and text', async ({ page }) => {
        await page.goto('/profesionales');

        // Search by text
        const searchInput = page.locator('input[placeholder*="Buscar"]').first();
        await searchInput.fill('Sofía');
        await expect(page.locator('text=Lic. Sofía Valenzuela')).toBeVisible();
        await expect(page.locator('text=Dr. Alejandro Gómez')).not.toBeVisible();

        // Clear search
        await searchInput.fill('');

        // Filter by modality
        const onlineButton = page.locator('button:has-text("Online")').first();
        await onlineButton.click();
        await expect(page.locator('text=Lic. Camila Restrepo')).toBeVisible();
    });

    test('User authentication with Google & toggling favorites', async ({ page }) => {
        await page.goto('/profesionales');

        // Click on favorite star while logged out prompts login
        const firstStar = page.locator('button[title*="favoritos"]').first();
        await firstStar.click();

        // Open login modal
        const loginButton = page
            .locator('button:has-text("Iniciar con Google"), button:has-text("Ingresar")')
            .first();
        await loginButton.click();

        // Click Google OAuth / demo login
        await page.locator('button:has-text("Continuar con Google")').click();

        // Now logged in, click favorite star
        await firstStar.click();

        // Navigate to favorites page
        await page.goto('/favoritos');
        await expect(page.locator('h1')).toContainText(/Mis Favoritos/i);
    });

    test('Admin dashboard image upload supporting drag & drop, file explorer and paste', async ({
        page,
    }) => {
        await page.goto('/dashboard');

        // If unauthorized, login as admin via testing button
        const adminLoginBtn = page.locator('button:has-text("Acceder como Administrador")');
        if (await adminLoginBtn.isVisible()) {
            await adminLoginBtn.click();
        }

        // Go to create professional tab
        await page
            .locator(
                'button:has-text("Cargar nuevo profesional"), button:has-text("Cargar profesional")',
            )
            .first()
            .click();

        // Verify Image Uploader is present with all 3 methods indicated
        await expect(
            page.locator('text=Arrastrá tu imagen o hacé clic para explorar'),
        ).toBeVisible();
        await expect(page.locator('text=Ctrl+V para pegar captura')).toBeVisible();

        // Fill new professional
        await page.locator('input[placeholder*="Lic."]').fill('Lic. Prueba Automatizada');
        await page.locator('input[placeholder*="M.N."]').fill('M.N. 99.999');
    });
});
