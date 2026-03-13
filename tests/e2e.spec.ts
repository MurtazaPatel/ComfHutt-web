import { test, expect } from '@playwright/test';

test.describe.serial('ComfHutt E2E Tests', () => {
  let errors: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      // Ignore Next.js dev hydration mismatch or generic warnings just to be safe, but track true errors
      if (msg.type() === 'error') errors.push(msg.text());
    });
  });

  test('TEST 1: Homepage loads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Ensure no severe page errors
    expect(errors.filter(e => !e.includes('Hydration') && !e.includes('React')).length).toBe(0);
    
    // Check for Sign In link in Navbar
    const signInBtn = page.getByRole('link', { name: 'Sign In', exact: true }).first();
    await expect(signInBtn).toBeVisible();
  });

  test('TEST 2: Sign In button navigates correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const signInBtn = page.getByRole('link', { name: 'Sign In', exact: true }).first();
    await signInBtn.click();
    await expect(page).toHaveURL(/.*\/signin/);
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    
    await expect(page.getByRole('link', { name: "Don't have an account?" })).toBeVisible();
  });

  test('TEST 3: Sign Up page navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/signin');
    await page.getByRole('link', { name: "Don't have an account?" }).click();
    await expect(page).toHaveURL(/.*\/signup/);
    
    await expect(page.locator('input[type="text"]')).toBeVisible(); // Name
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    await expect(page.getByRole('link', { name: "Already have an account?" })).toBeVisible();
  });

  test('TEST 4: Register a new account', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.locator('input[type="text"]').fill('Playwright Test User');
    await page.locator('input[type="email"]').fill('playwright@comfhutt.com');
    await page.locator('input[type="password"]').fill('PlaywrightTest123!');
    
    await page.getByRole('button', { name: 'Create account' }).click();
    
    // debug: Wait a bit and check for error messages on screen
    await page.waitForTimeout(2000);
    const errorContainers = await page.locator('.text-red-500').allTextContents();
    if (errorContainers.length > 0) {
      console.log('UI Errors found:', errorContainers);
      console.log('Console Errors:', errors);
    }

    // Should wait for success state or redirect
    await expect(page).toHaveURL(/.*\/signin\?success=registered|.*\/dashboard/, { timeout: 10000 });
    
    // Confirm no errors
    expect(errors.filter(e => !e.includes('Hydration') && !e.includes('React')).length).toBe(0);
  });

  test('TEST 5: Sign in with registered account', async ({ page }) => {
    await page.goto('http://localhost:3000/signin');
    await page.locator('input[type="email"]').fill('playwright@comfhutt.com');
    await page.locator('input[type="password"]').fill('PlaywrightTest123!');
    
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('TEST 6: Protected route while logged in', async ({ page }) => {
    // Navigate with existing session
    await page.goto('http://localhost:3000/signin');
    await page.locator('input[type="email"]').fill('playwright@comfhutt.com');
    await page.locator('input[type="password"]').fill('PlaywrightTest123!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Refresh page or go there directly
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('TEST 7: Sign out', async ({ page }) => {
    // Navigate with existing session
    await page.goto('http://localhost:3000/signin');
    await page.locator('input[type="email"]').fill('playwright@comfhutt.com');
    await page.locator('input[type="password"]').fill('PlaywrightTest123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForTimeout(1000);
    const errorContainers = await page.locator('.text-red-500').allTextContents();
    if (errorContainers.length > 0) {
      console.log('UI Errors found:', errorContainers);
      console.log('Console Errors:', errors);
    }

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    
    // We need to trigger the dropdown in the Navbar by hovering the user button
    const userMenuButton = page.getByRole('button', { name: /Playwright|User/i }).first();
    await userMenuButton.hover();
    
    // Now the dropdown should be visible, find the Sign Out button
    const signOutLink = page.getByRole('button', { name: /Sign Out/i }).first();
    await signOutLink.waitFor({ state: 'visible', timeout: 5000 });
    await signOutLink.click();
    
    // Should redirect to homepage or signin
    await expect(page).toHaveURL(/.*\/(\?logout=true|signin)?$/);
    
    // Try visiting dashboard again
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*\/signin/);
  });

  test('TEST 8: Protected route while logged out', async ({ browser }) => {
    // Open a completely fresh context
    const context = await browser.newContext();
    const newPage = await context.newPage();
    
    await newPage.goto('http://localhost:3000/dashboard');
    await expect(newPage).toHaveURL(/.*\/signin/);
  });
});
