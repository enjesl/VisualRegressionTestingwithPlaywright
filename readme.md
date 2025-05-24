# Visual Regression Testing with Playwright

This project uses Playwright to perform visual regression testing of web pages. It captures screenshots of specified URLs and compares them against baseline images to detect visual differences.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    This will install Playwright and other necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    Playwright requires browser binaries to run tests. This command downloads the default browsers (Chromium, Firefox, WebKit) and their dependencies.
    ```bash
    npx playwright install --with-deps
    ```

## Running Tests

To execute all visual tests defined in `tests/visual.spec.js`:
```bash
npm test
```
Alternatively, you can run:
```bash
npx playwright test
```

## Baseline Image Management

### Initial Baseline Generation
On the first successful run of a test, Playwright will automatically generate a baseline snapshot (the "expected" image). These snapshots are stored in the `tests/__screenshots__` directory, organized by test file and snapshot name.

For example, a snapshot for a test case with `folder: "example-page"` in `data.json`, tested in `tests/visual.spec.js`, will be saved as:
`tests/__screenshots__/visual.spec.js/example-page.png`

This path is configured in `playwright.config.js` via the `snapshotPathTemplate` option.

### Updating Baseline Snapshots
If you make intentional changes to a web page and need to update the corresponding baseline snapshot, run the tests with the `--update-snapshots` flag:
```bash
npx playwright test --update-snapshots
```
This will replace the existing baseline image with the new screenshot taken during this test run.

## Reviewing Differences

When a test fails due to visual differences, Playwright generates output files to help you review the changes:
-   **`*-actual.png`**: The screenshot taken during the test run.
-   **`*-expected.png`**: The baseline (expected) screenshot.
-   **`*-diff.png`**: An image highlighting the differences between the actual and expected screenshots.

These files are typically stored in the `test-results` directory, within a subfolder named after the test file and test case. For example:
`test-results/tests-visual-spec-js/Visual-test-for-example-page-chromium/`

You can also view a detailed HTML report by running:
```bash
npx playwright show-report
```

## Test Configuration (`data.json`)

Test cases are defined in the `data.json` file located in the project root. Each object in the JSON array represents a test case with the following properties:

-   `folder`: A descriptive name for the test case. This is used to name the screenshot file (e.g., `folder.png`).
-   `actual`: The URL of the web page to capture.
-   `waittime` (optional): The time in milliseconds to wait after the page loads before taking the screenshot.
-   `fullPage` (optional): A boolean indicating whether to capture the full scrollable page (defaults to `true`).
-   `avoidPixelCount` (optional): The number of pixels that can differ before a test is considered failed. This is converted to a percentage threshold for comparison (defaults to 0.1 or 10% if not set).

**Example `data.json` snippet:**
```json
[
  {
    "folder": "homepage",
    "actual": "https://example.com",
    "waittime": 1000,
    "fullPage": true,
    "avoidPixelCount": 500
  },
  {
    "folder": "product-page",
    "actual": "https://example.com/product/123",
    "avoidPixelCount": 100
  }
]
```

## Contribute

Feel free to contribute to the project by submitting a pull request or creating an issue.

## License

This project is licensed under the MIT License.
