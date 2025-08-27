import { test, expect } from '@playwright/test';

test.describe('YourSpace Application E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/YourSpace/);
    await expect(page.locator('h1')).toContainText('Welcome to YourSpace');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('should display validation errors on empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Create an account');
    
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should display music player controls', async ({ page }) => {
    // Assuming user is logged in or guest access is available
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();
  });

  test('should navigate between main sections', async ({ page }) => {
    // Test navigation to different sections
    const sections = ['Discover', 'Rooms', 'Studio', 'Profile'];
    
    for (const section of sections) {
      await page.click(`text=${section}`);
      await expect(page).toHaveURL(new RegExp(`.*${section.toLowerCase()}`));
    }
  });
});

test.describe('Profile Builder E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile builder (assuming user is authenticated)
    await page.goto('/profile');
  });

  test('should display profile builder interface', async ({ page }) => {
    await expect(page.locator('text=Profile Builder')).toBeVisible();
    await expect(page.locator('text=Widget Library')).toBeVisible();
    await expect(page.locator('text=Canvas')).toBeVisible();
  });

  test('should add widget from library', async ({ page }) => {
    // Click on About Section widget
    await page.click('text=About Section');
    
    // Verify widget appears on canvas
    await expect(page.locator('[data-testid="widget-about"]')).toBeVisible();
  });

  test('should open widget settings', async ({ page }) => {
    // Add a widget first
    await page.click('text=About Section');
    
    // Click on the widget to open settings
    await page.click('[data-testid="widget-about"]');
    
    // Verify settings panel appears
    await expect(page.locator('text=Widget Settings')).toBeVisible();
  });

  test('should preview profile', async ({ page }) => {
    // Add some widgets
    await page.click('text=About Section');
    await page.click('text=Music Player');
    
    // Click preview button
    await page.click('text=Preview');
    
    // Verify preview mode
    await expect(page.locator('text=Profile Preview')).toBeVisible();
    await expect(page.locator('text=Exit Preview')).toBeVisible();
  });

  test('should save profile', async ({ page }) => {
    // Add a widget
    await page.click('text=About Section');
    
    // Save profile
    await page.click('text=Save');
    
    // Verify save confirmation
    await expect(page.locator('text=Profile saved successfully')).toBeVisible();
  });
});

test.describe('Virtual Rooms E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rooms');
  });

  test('should display rooms page', async ({ page }) => {
    await expect(page.locator('text=My Virtual Rooms')).toBeVisible();
    await expect(page.locator('text=Create Room')).toBeVisible();
  });

  test('should create new room', async ({ page }) => {
    await page.click('text=Create Room');
    
    // Fill room details
    await page.fill('input[name="name"]', 'Test Room');
    await page.fill('textarea[name="description"]', 'A test room for E2E testing');
    
    // Select theme
    await page.selectOption('select[name="theme"]', 'cyberpunk');
    
    // Create room
    await page.click('button[type="submit"]');
    
    // Verify room creation
    await expect(page.locator('text=Test Room')).toBeVisible();
  });

  test('should view room in 3D', async ({ page }) => {
    // Assuming there's at least one room
    await page.click('text=View Room').first();
    
    // Verify 3D canvas is loaded
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('text=Fullscreen')).toBeVisible();
  });
});

test.describe('Music Player E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should interact with music player controls', async ({ page }) => {
    const musicPlayer = page.locator('[data-testid="music-player"]');
    
    // Test play button
    await musicPlayer.locator('button[aria-label="Play"]').click();
    await expect(musicPlayer.locator('button[aria-label="Pause"]')).toBeVisible();
    
    // Test pause button
    await musicPlayer.locator('button[aria-label="Pause"]').click();
    await expect(musicPlayer.locator('button[aria-label="Play"]')).toBeVisible();
  });

  test('should control volume', async ({ page }) => {
    const musicPlayer = page.locator('[data-testid="music-player"]');
    
    // Click on volume control to open slider
    await musicPlayer.locator('[aria-label="Volume"]').click();
    
    // Adjust volume slider
    const volumeSlider = page.locator('input[type="range"][aria-label="Volume"]');
    await volumeSlider.fill('50');
    
    // Verify volume change
    await expect(volumeSlider).toHaveValue('50');
  });

  test('should display track information', async ({ page }) => {
    const musicPlayer = page.locator('[data-testid="music-player"]');
    
    // If a track is loaded, should show track info
    await expect(musicPlayer.locator('[data-testid="track-title"]')).toBeVisible();
    await expect(musicPlayer.locator('[data-testid="track-artist"]')).toBeVisible();
  });
});

test.describe('Responsive Design E2E Tests', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Verify layout adjusts for tablet
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Verify full desktop layout
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });
});
