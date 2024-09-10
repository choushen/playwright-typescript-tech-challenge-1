require('dotenv').config();

import * as path from 'path';
import {test, expect } from '@playwright/test';

test.describe('Blog Post Creation and Validation', () => {

    test('Create a new blog post with text and image and verify the creation', async ({ page }) => {

        // Login step
        const username = process.env.APP_USERNAME;
        const password = process.env.APP_PASSWORD;
        const baseUrl = process.env.APP_BASE_URL;
        
        if (!username || !password || !baseUrl) {
            throw new Error('Environment variables USERNAME, PASSWORD, or BASE_URL are not defined.');
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
        const profileButton = page.getByRole('button', { name: 'Your profile and settings' });
        const isProfileVisible = await profileButton.isVisible();
        expect(isProfileVisible).toBe(true);
        console.log('Logged in successfully');

        // Step: Navigate to the profile menu and select "Add Blog Post."
        await profileButton.click();
        await page.getByRole('link', { name: 'Add Blog Post' }).click();
        await expect(page).toHaveURL(/.*\/blog\/post\/create\/.*/);

        // Step: Fill in the blog post form with the required text and image.
        const imagePath = path.resolve(__dirname, '../test-data/imgs/catcloseup.jpg');
        const uploadButton = await page.locator('input[title="Image uploader for blog"]');
        const blogPostBodyContent = page.locator('#blogPostBodyContent');
        const postSummary = page.locator('p[aria-label="Post Summary"]');
        const postTitle = page.locator('h1[aria-label="Post title"]');  

        
        console.log('Creating blog post with image...');
        await uploadButton.setInputFiles(imagePath);
        await page.setInputFiles('input[title="Image uploader for blog"]', imagePath);
        await postTitle.fill('This is the post title.');
        await postSummary.fill('This is the post summary.');
        await blogPostBodyContent.fill('This is the new blog post content.');



        // Step: Click “Continue” to submit the blog post.
        await page.click('a[aria-label="Continue"]');



        // Step: Set “Publish” and “Make Feature Post” to Yes


        // Step: Navigate to “All Posts” and validate that the blog post exists.


        // Step: Verify the content of the blog post matches the input data.



    }); // end of test


}); // end of feature