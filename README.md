# Interact Tech Challenge - Playwright Blog Post Automation

## Requirements

- Playwright
- Node.js
- Username, password and site URL to input into the for the .env file

## Objective

- Logging into the interact demo web application.
- Creating a blog post with both text and an image.
- Publishing the blog post.
- Verifying the post's existence and ensuring the content is accurate.

## Tasks

1. **Test Setup:**
   - Install Playwright and all necessary dependencies.  [x]
   - Configure the environment for running the tests.  [x]

2. **Test Execution:**
   - Launch a browser using Playwright. [x]
   - Navigate to the specified URL.  [x]
   - Log in with provided credentials.  [x]
   - Navigate to the profile menu and select "Add Blog Post."  [x]
   - Fill in the blog post form with required text and image.  [x]
   - Set "Publish" and "Make Feature Post" to "Yes."  [x]
   - Verify the blog post exists and its content matches the input data.  [x]

## Improvements

1. **Enhanced Logging:**
   - Implement a logging library such as `log4js` for more customizable logging. This would allow logging to different output formats and destinations, such as files or a target server.
   - This would help track each step more clearly and diagnose any issues that arise.

2. **Error Handling:**
   - Introduce more comprehensive `try-catch` blocks to handle potential exceptions.
   - Rethink error-throwing strategy to ensure that errors are descriptive.

3. **Improved Code Structure with Types:**
   - Introduce TypeScript types for better code readability, especially as the project scales.
    - e.g. Define types for key objects, such as `BlogPost` or `User`, especially when testing for different authorization levels.

4. **Variable Naming Strategy:**
   - While variable names are clear, they could be more descriptive to improve readability, especially for elements that are similar. 

5. **Environment Variables Management:**
   - Ideally, I would handle environment variables differently by integrating AWS Secrets Manager or similar.

6. **Containerization and Cloud Execution:**
   - I would containerise the test suite using Docker and run it on AWS CodeBuild for this small project.
   - For long-term, larger projects, I would use AWS Fargate or ECS for better scalability.
   - Alternatively, I’d consider GitHub Actions CI/CD, which offers great built-in support for running tests and generating reports.

7. **Test Reporting Framework:**
   - Integrate a reporting framework like **Allure** for enhanced test reporting.
    - This would provide clearer insights into test execution, such as test outcomes, failure reasons, and detailed logging - and give us a nice graph :-)

## Observations

### Locating Elements
In some areas of the application, there were no unique identifiers (such as `data-test-id`) to locate elements. I used this as an opportunity to show that I can use creative approaches for interacting with the DOM, using combinations of element hierarchies, text content, and classes.

### Firefox Issue
During testing with Firefox, I encountered an issue where, after submitting a blog post, the browser tab would occasionally crash if I didn't manually refresh the page. Investigating this issue further using Playwright's Trace Viewer revealed a couple of failed requests, but due to time constraints, I was unable to resolve it. If given more time, I would further debug this issue to determine its root cause.

## Running the Tests
1. Download and unzip the project files.

2. Navigate to the project directory in your terminal or open the project in your preferred code editor (I used VSCode)

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (e.g., `APP_USERNAME`, `APP_PASSWORD`, `APP_BASE_URL`) in a `.env.example` file within the project and rename it to `.env`.

4. To run the tests:
```bash
   npx playwright test
```

## Future Considerations
- Investigate the Firefox issue further to prevent the tab from crashing without requiring a manual refresh.
- Explore additional ways to optimize cross-browser compatibility and minimize potential flakiness in tests, particularly for long-running test suites.

## Conclusion
This project was a great opportunity to showcase my skills in test automation using Playwright. I enjoyed the challenge of automating the blog post creation process and verifying the post's existence. I look forward to discussing this project further. Thank you for the opportunity!

## Author
- Jacob McKenzie