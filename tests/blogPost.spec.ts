require('dotenv').config();
import { test, expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BlogPage } from '../pages/blogPage';

test.describe('Blog Post Creation and Validation', () => {

    test('Create a new blog post with text and image and verify the creation', async ({ page }) => {
        const blogPage = new BlogPage(page);

        // Step: Get environment variables and validate they are defined
        const username: string = process.env.APP_USERNAME || '';
        const password: string = process.env.APP_PASSWORD || '';
        const baseUrl: string = process.env.APP_BASE_URL || '';
        if (!username || !password || !baseUrl) {
            throw new Error('Environment variables USERNAME, PASSWORD, or BASE_URL are not defined.');
        }

        // Step: Navigate to the specified URL and log in
        await blogPage.navigateTo(baseUrl);
        await blogPage.login(username, password);
        await expect(blogPage.profileButton).toBeVisible({ timeout: 5000 });
        console.log('Logged in successfully');

        // Step: Navigate to "Add Blog Post"
        await blogPage.navigateToAddBlogPost();
        await expect(blogPage.uploadButton).toBeVisible({ timeout: 3000 });
        console.log('Navigated to Add Blog Post form');

        // Generate fake data for the blog post
        const postTitleText: string = faker.lorem.words(3);
        const postSummaryText: string = faker.lorem.sentence();
        const blogPostBodyContentText: string = faker.lorem.paragraph();
        const imagePath: string = '../test-data/imgs/catcloseup.jpg';

        // Step: Fill in the blog post form
        await blogPage.fillBlogPostForm(postTitleText, postSummaryText, blogPostBodyContentText, imagePath);
        console.log('Blog post form filled successfully');
        await blogPage.continueButton.click();
        await expect(blogPage.checkbox).toBeEnabled({ timeout: 10000 });
        console.log('Set Publish to Yes');

        // Step: Submit the blog post
        await blogPage.submitBlogPost();
        await expect(blogPage.allPostsButton).toBeVisible({ timeout: 20000 });
        console.log('Blog post successfully submitted');

        // Step: Navigate to “All Posts” and validate that the blog post exists
        const postImagePreviewSrc: string = await blogPage.getPostImagePreviewSrc();
          // Throws error if null
        await blogPage.reloadAndNavigateToAllPosts();
        const newBlogPost: Locator = await blogPage.locateNewBlogPost(postTitleText);
        newBlogPost.waitFor({ timeout: 20000 });
        const newBlogPostImage: Locator = await blogPage.locateNewBlogPostImage(postImagePreviewSrc);
        await expect(newBlogPost).toHaveText(postTitleText);
        await expect(newBlogPostImage).toBeVisible();
        console.log('Blog post found in the list');

        // Step: Verify the content of the blog post matches the input data
        await page.waitForTimeout(2000);
        await blogPage.openBlogPost(postTitleText);
        await blogPage.postTitle.waitFor({ timeout: 20000 });
        await expect(blogPage.postTitle).toHaveText(postTitleText);
        await expect(blogPage.postSummary).toHaveText(postSummaryText);
        await expect(blogPage.postBodyContent).toContainText(blogPostBodyContentText);
        await expect(blogPage.getBlogPostBackgroundImage()).toBeDefined();
        console.log('Blog post content validated successfully');
    }); // test end

}); // test.describe end
