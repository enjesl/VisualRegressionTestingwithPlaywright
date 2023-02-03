const { chromium } = require('playwright');
const fs = require('fs');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const jimp = require("jimp");

async function compareScreenshots(actualImage, expectedImage, diffImage, avoidPixelCount, folder, fullPage) {
  const img1 = await jimp.read(actualImage);
  const img2 = await jimp.read(expectedImage);
  const width = Math.min(img1.bitmap.width, img2.bitmap.width);
  const height = Math.min(img1.bitmap.height, img2.bitmap.height);
  img1.resize(width, height);
  img2.resize(width, height);

  const diff = new PNG({width, height});
  const img1Data = Uint8Array.from(img1.bitmap.data);
  const img2Data = Uint8Array.from(img2.bitmap.data);
  const numDiffPixels = pixelmatch(img1Data, img2Data, diff.data, width, height, {threshold: 0.1});

  const folderPath = `${folder}_diff`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  if (numDiffPixels > avoidPixelCount) {
    fs.writeFileSync(`${folderPath}/${diffImage}`, PNG.sync.write(diff));
    console.log(`Found ${numDiffPixels} different pixels between actual and expected images with fullPage: ${fullPage}. Wrote diff image to ${folderPath}/${diffImage}.`);
  } else {
    console.log(`Found only ${numDiffPixels} different pixels, which is within the acceptable limit of ${avoidPixelCount}.`);
    console.log("It's not a major difference.");
  }
}

(async () => {
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
})();
