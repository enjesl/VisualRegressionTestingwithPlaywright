const path = require('path');
const fs = require('fs');
const { capture } = require('./utils/screenshot');
const { compare } = require('./utils/compare');

const runBtn = document.getElementById('runTest');
const resultText = document.getElementById('resultText');
const img1El = document.getElementById('img1');
const img2El = document.getElementById('img2');
const diffEl = document.getElementById('diffImg');

runBtn.addEventListener('click', async () => {
  const url1 = document.getElementById('url1').value;
  const url2 = document.getElementById('url2').value;
  const designFile = document.getElementById('designImage').files[0];

  if (!url1) {
    alert('URL 1 is required');
    return;
  }

  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  const img1Path = path.join(resultsDir, 'img1.png');
  const img2Path = path.join(resultsDir, 'img2.png');
  const diffPath = path.join(resultsDir, 'diff.png');

  resultText.textContent = 'Running...';

  try {
    await capture(url1, img1Path);
    if (designFile) {
      fs.copyFileSync(designFile.path, img2Path);
    } else if (url2) {
      await capture(url2, img2Path);
    } else {
      alert('Provide URL 2 or upload an image');
      return;
    }

    const mismatch = await compare(img1Path, img2Path, diffPath);
    resultText.textContent = `Mismatch: ${mismatch.toFixed(2)}%`;
    img1El.src = img1Path;
    img2El.src = img2Path;
    diffEl.src = diffPath;
  } catch (err) {
    console.error(err);
    resultText.textContent = 'Error: ' + err.message;
  }
});
