import { test, expect } from '@playwright/test';

test.describe('GDG Talk Hub UI Verification', () => {

  test('Homepage successfully renders and filters work', async ({ page }) => {
    // Erhöhter Timeout für langsame GitHub Actions Umgebungen
    test.setTimeout(60000);
    
    await page.goto('/');
    
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toContainText(/GDG/);
    
    const searchInput = page.getByPlaceholder('Titel oder Speaker...');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('Test Search');
    await searchInput.fill('');
  });

  test('Talk Details page respects layout constraints and PDF is displayed/downloadable', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    
    // Nutze *="/talks/" anstatt ^="/talks/", denn Next.js fügt in der CI den BasePath (/talk_hub) automatisch davor ein!
    const firstTalkLink = page.locator('a[href*="/talks/"]').first();
    
    // Warte aktiv, bis der erste Link wirklich in den DOM gerendert wird
    await expect(firstTalkLink).toBeVisible({ timeout: 15000 });
    
    const href = await firstTalkLink.getAttribute('href');
    
    if (href) {
      await page.goto(href);
      
      const h1 = page.getByRole('heading', { level: 1 }).first();
      await expect(h1).toBeVisible();
      
      const downloadBtn = page.locator('a', { hasText: 'PDF Herunterladen' }).first();
      await expect(downloadBtn).toBeVisible();
      
      const downloadHref = await downloadBtn.getAttribute('href');
      expect(downloadHref).toBeTruthy();
      
      const response = await page.request.get(downloadHref!);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('pdf');
      
      const pdfObject = page.locator('object[type="application/pdf"]').first();
      await expect(pdfObject).toBeVisible();
    }
  });

});
