const { chromium } = require('playwright');
const fs = require('fs');
const { compareScreenshots } = require('./compareScreenshots');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const data = require('../data.json');

  for (const { actual, expected, avoidPixelCount, folder, waittime, fullPage } of data) {
    const folderPath = `${folder}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    let actualImage, expectedImage;
    if (actual.startsWith('http')) {
      const page = await context.newPage();
      await page.goto(actual);
      await page.waitForTimeout(waittime);
      actualImage = `actual.png`;
      await page.screenshot({ path: `${folderPath}/${actualImage}`, fullPage: fullPage });
    } else {
      actualImage = actual;
    }

    if (expected.startsWith('http')) {
      const expectedPage = await context.newPage();
      await expectedPage.goto(expected);
      await expectedPage.waitForTimeout(waittime);
      expectedImage = `expected.png`; 
      await expectedPage.screenshot({ path: `${folderPath}/${expectedImage}`, fullPage: fullPage });
} else {
expectedImage = expected;
}
const diffImage = `diff.png`;
await compareScreenshots(`${folderPath}/${actualImage}`,`${folderPath}/${expectedImage}`, diffImage, avoidPixelCount, folderPath, fullPage);
}

await browser.close();
}

module.exports = main;
