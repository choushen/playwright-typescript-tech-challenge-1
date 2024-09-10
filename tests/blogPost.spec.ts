require('dotenv').config();

import {test, expect } from '@playwright/test';
import * as path from 'path';
import { faker } from '@faker-js/faker';

test.describe('Blog Post Creation and Validation', () => {

    test('Create a new blog post with text and image and verify the creation', async ({ page }) => {

        // Step: Get the environment variables and validate they are defined
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
        expect(profileButton).toBeVisible();
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
        const postTitleText = faker.lorem.sentence();  
        const postSummaryText = faker.lorem.sentences(2); 
        const blogPostBodyContentText = faker.lorem.paragraph();  
        console.log('Creating blog post with image...');
        await uploadButton.setInputFiles(imagePath);
        await postTitle.fill(postTitleText);
        await page.waitForTimeout(500);
        await postTitle.press('Enter');
        await postSummary.fill(postSummaryText);
        await page.waitForTimeout(500);
        await postSummary.press('Enter');
        await blogPostBodyContent.scrollIntoViewIfNeeded();
        await blogPostBodyContent.fill(blogPostBodyContentText);
        await page.waitForTimeout(500);
        await blogPostBodyContent.press('Enter');


        // Step: Click “Continue” to submit the blog post.
        console.log('Trying to submit blog post...');
        await page.click('a[aria-label="Continue"]');
        const checkbox = page.locator('label[data-original-title="Published blog posts are visible for everyone"] input[type="checkbox"]');
        await expect(checkbox).toBeEnabled();
        await page.waitForTimeout(2000);
        await checkbox.check({ force: true });
        await page.click('text=Save');
        const allPostsButton = page.locator('text=All Posts');
        await expect(allPostsButton).toBeVisible({ timeout: 20000 });
        console.log('Blog post successfully submitted');



        // Step: Navigate to “All Posts” and validate that the blog post exists.
        console.log('Navigating to all posts...');
        const postImagePreviewSrc = await page.getAttribute('img[aria-hidden="true"]', 'src');
        await allPostsButton.click();
        const listItem = page.locator(`li:has(img[src="${postImagePreviewSrc}"])`);
        const postTitleLocator = listItem.locator('h2');
        // Verify the image and the title to ensure it's the correct post
        await expect(listItem).toBeVisible();
        await expect(postTitleLocator).toHaveText(postTitleText);
        console.log('Blog post found in the list');

        // Step: Verify the content of the blog post matches the input data.
        console.log('Validating blog post content...');
        await listItem.click();
        await page.waitForTimeout(1000);
        const titleLocator = page.locator('div h1');
        await expect(titleLocator).toHaveText(postTitleText);

        const summaryLocator = page.locator('div p strong');
        await expect(summaryLocator).toHaveText(postSummaryText);

        const bodyContentLocator = page.locator('section.content p').first();
        await expect(bodyContentLocator).toContainText(blogPostBodyContentText);
        console.log('Blog post content validated successfully');

    }); // end of test


}); // end of feature