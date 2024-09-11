import { Page, Locator } from '@playwright/test';
import * as path from 'path';

export class BlogPage {
    constructor(private page: Page) {}

    // Locators using getters
    get loginButton(): Locator {
        return this.page.locator('#loginbtn');
    }

    get usernameInput(): Locator {
        return this.page.locator('#Username');
    }

    get passwordInput(): Locator {
        return this.page.locator('#Password');
    }

    get profileButton(): Locator {
        return this.page.getByRole('button', { name: 'Your profile and settings' });
    }

    get addBlogPostLink(): Locator {
        return this.page.getByRole('link', { name: 'Add Blog Post' });
    }

    get postTitleInput(): Locator {
        return this.page.locator('h1[aria-label="Post title"]');
    }

    get postSummaryInput(): Locator {
        return this.page.locator('p[aria-label="Post Summary"]');
    }

    get blogPostBodyContentInput(): Locator {
        return this.page.locator('#blogPostBodyContent');
    }

    get uploadButton(): Locator {
        return this.page.locator('input[title="Image uploader for blog"]');
    }

    get continueButton(): Locator {
        return this.page.locator('a[aria-label="Continue"]');
    }

    get checkbox(): Locator {
        return this.page.locator('label[data-original-title="Published blog posts are visible for everyone"] input[type="checkbox"]');
    }

    get saveButton(): Locator {
        return this.page.locator('a.button.is-medium-button.btn-block.is-inverted', { hasText: 'Save' });
    }

    get allPostsButton(): Locator {
        return this.page.locator('text=All Posts');
    }

    get blogPostImagePreview(): Locator {
        return this.page.locator('img[aria-hidden="true"]');
    }

    get postTitle(): Locator {
        return this.page.locator('header h1');
    }

    get postSummary(): Locator {
        return this.page.locator('header p strong');
    }

    get postBodyContent(): Locator {
        return this.page.locator('section.content p');
    }
    

    // Methods
    async getPostImagePreviewSrc(): Promise<string> {
        const src = await this.blogPostImagePreview.getAttribute('src');
        if (!src) {
            throw new Error('Post image preview source is null');
        }
        return src;
    }

    async getBlogPostBackgroundImage(): Promise<Locator> {
        const src = await this.getPostImagePreviewSrc();  // Get the src from the previous method
        return this.page.locator(`img[src="${src}"]`);  // Locate the img element with the correct src
    }

    async navigateTo(baseUrl: string): Promise<void> {
        await this.page.goto(baseUrl);
        await this.loginButton.waitFor({ state: 'visible' });
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.profileButton.waitFor();
    }

    async navigateToAddBlogPost(): Promise<void> {
        await this.profileButton.click();
        await this.addBlogPostLink.click();
    }

    async fillBlogPostForm(postTitleText: string, postSummaryText: string, blogPostBodyContentText: string, imagePath: string): Promise<void> {
        const resolvedImagePath = path.resolve(__dirname, imagePath);
        await this.uploadButton.setInputFiles(resolvedImagePath);
        await this.postTitleInput.pressSequentially(postTitleText,);
        await this.page.keyboard.press('Tab');
        await this.postSummaryInput.pressSequentially(postSummaryText);
        await this.page.keyboard.press('Tab');
        await this.blogPostBodyContentInput.scrollIntoViewIfNeeded();
        await this.blogPostBodyContentInput.pressSequentially(blogPostBodyContentText);
        await this.page.keyboard.press('Tab');
    }

    async submitBlogPost(): Promise<void> {
        await this.page.waitForTimeout(1000);
        await this.checkbox.check({ force: true });
        await this.saveButton.click();
    }

    async reloadAndNavigateToAllPosts(): Promise<void> {
        await this.page.reload();
        await this.allPostsButton.waitFor({ timeout: 20000 });
        await this.allPostsButton.click();
    }

    async locateNewBlogPost(postTitleText: string): Promise<Locator> {
        const newBlogPost = this.page.locator('ul#person-blog-results li h2', { hasText: postTitleText });
        await newBlogPost.waitFor({ state: 'attached', timeout: 20000 });
        return newBlogPost;
    }

    async locateNewBlogPostImage(postImagePreviewSrc: string): Promise<Locator> {
        const newBlogPostImage = this.page.locator(`li:has(img[src="${postImagePreviewSrc}"])`);
        await newBlogPostImage.waitFor({ state: 'attached', timeout: 20000 });
        return newBlogPostImage;
    }

    async openBlogPost(postTitleText: string): Promise<void> {
        const newBlogPost = await this.locateNewBlogPost(postTitleText);
        await newBlogPost.click();
    }
}
