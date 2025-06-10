const fs = require('fs');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

async function compare(img1Path, img2Path, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const mismatch = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return (mismatch / (width * height)) * 100;
}

module.exports = { compare };
