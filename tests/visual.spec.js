const { test, expect } = require('@playwright/test');
const data = require('../data.json'); // Assuming data.json is in the root directory

// Function to convert avoidPixelCount to threshold percentage
function calculateThreshold(item, viewportSize) {
  if (item.avoidPixelCount === undefined || item.avoidPixelCount === null || !viewportSize) {
    return 0.1; // Default threshold if avoidPixelCount is not defined or viewportSize is unavailable
  }
  const totalPixels = viewportSize.width * viewportSize.height;
  if (totalPixels === 0) {
    return 0.1; // Avoid division by zero
  }
  return item.avoidPixelCount / totalPixels;
}

for (const item of data) {
  // Only run tests for items with a defined 'actual' URL
  if (item.actual && typeof item.actual === 'string' && (item.actual.startsWith('http') || item.actual.startsWith('file:'))) {
    test(`Visual test for ${item.folder}`, async ({ page }) => {
      // Navigate to the 'actual' URL
      await page.goto(item.actual);

      // Wait for the specified time
      if (item.waittime) {
        await page.waitForTimeout(item.waittime);
      }

      // Determine if fullPage screenshot is needed
      const fullPage = item.fullPage !== undefined ? item.fullPage : true;

      // Calculate threshold from avoidPixelCount
      const viewportSize = page.viewportSize();
      const threshold = calculateThreshold(item, viewportSize);

      // Take and compare screenshot
      // The snapshot name will be `${item.folder}.png`
      // Baseline images will be stored in `tests/__screenshots__/${testName}/${snapshotName}`
      // e.g. tests/__screenshots__/visual.spec.js/Visual-test-for-example-folder/example-folder.png
      await expect(page).toHaveScreenshot(`${item.folder}.png`, {
        fullPage: fullPage,
        threshold: threshold,
        maxDiffPixels: item.avoidPixelCount // Also passing avoidPixelCount as maxDiffPixels for a more direct comparison if needed by specific configurations
      });
    });
  } else {
    // Optionally, log or handle items that are not URLs (e.g., local file paths)
    console.log(`Skipping test for ${item.folder} as 'actual' is not a valid URL: ${item.actual}`);
  }
}
