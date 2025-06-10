const { chromium } = require('playwright');

async function capture(url, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
}

module.exports = { capture };
