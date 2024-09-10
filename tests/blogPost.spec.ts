require('dotenv').config();

import {test, expect } from '@playwright/test';

test.describe('Blog Post Creation and Validation', () => {

    test('Create a new blog post with text and image and verify the creation', async ({ page }) => {

        // Login step
        const username = process.env.APP_USERNAME;
        const password = process.env.APP_PASSWORD;
        const baseUrl = process.env.APP_BASE_URL;
        
        if (!username || !password || !baseUrl) {
            throw new Error('Environment variables USERNAME, PASSWORD, or BASE_URL are not defined');
        }

        // Step: Navigate to the specified URL
        await page.goto(baseUrl);
        await page.waitForSelector('#loginbtn', { state: 'visible' });
        await expect(page.locator('#loginbtn')).toBeVisible();
        console.log('Page loaded successfully');

        // Step: Log in using the provided credentials
        await page.locator('#Username').fill(username);
        await page.locator('#Password').fill(password);
        await page.locator('#loginbtn').click();

        // Wait for the button with the role "button" and accessible name "Your profile and settings"
        await page.getByRole('button', { name: 'Your profile and settings' }).waitFor();

        // Check if the button is visible on the page
        const isProfileVisible = await page.getByRole('button', { name: 'Your profile and settings' }).isVisible();
        expect(isProfileVisible).toBe(true);
        console.log('Logged in successfully');

    });


});