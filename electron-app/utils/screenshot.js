const { chromium } = require('playwright');

/**
 * Capture a screenshot of the given URL.
 * @param {string} url The page to capture.
 * @param {string} outputPath Where to save the screenshot.
 * @param {number} [waittime=0] Time to wait after load in ms.
 * @param {boolean} [fullPage=true] Capture full page scroll.
 */
async function capture(url, outputPath, waittime = 0, fullPage = true) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  if (waittime) {
    await page.waitForTimeout(waittime);
  }
  await page.screenshot({ path: outputPath, fullPage });
  await browser.close();
}

module.exports = { capture };
