const fs = require('fs');
const path = require('path');
const { capture } = require('./utils/screenshot');
const { compare } = require('./utils/compare');

const reportsDir = path.join(__dirname, '..', 'reports');

function toggleTheme() {
  document.body.classList.toggle('dark');
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('backBtn').addEventListener('click', () => {
  location.href = 'index.html';
});

const form = document.getElementById('compareForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const actual = document.getElementById('actual').value;
  const expected = document.getElementById('expected').value;
  const design = document.getElementById('design').files[0];
  const threshold = parseInt(document.getElementById('threshold').value) || 0;
  const wait = parseInt(document.getElementById('wait').value) || 0;
  const fullPage = document.getElementById('fullPage').checked;

  if (!actual) {
    alert('Actual URL required');
    return;
  }
  if (!expected && !design) {
    alert('Expected URL or design image required');
    return;
  }
  document.getElementById('status').textContent = 'Running...';

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }
  const folderName = new Date().toISOString().replace(/[:]/g, '-');
  const folder = path.join(reportsDir, folderName);
  fs.mkdirSync(folder);

  const actualPath = path.join(folder, 'actual.png');
  const expectedPath = path.join(folder, 'expected.png');
  const diffPath = path.join(folder, 'diff.png');

  try {
    await capture(actual, actualPath, wait, fullPage);
    if (design) {
      fs.copyFileSync(design.path, expectedPath);
    } else {
      await capture(expected, expectedPath, wait, fullPage);
    }

    const mismatchPixels = await compare(actualPath, expectedPath, diffPath);
    const status = mismatchPixels <= threshold ? 'pass' : 'fail';

    const result = {
      timestamp: new Date().toISOString(),
      actual: 'actual.png',
      expected: 'expected.png',
      diff: 'diff.png',
      mismatchPixels,
      status,
      config: { actual, expected: design ? design.name : expected, avoidPixelCount: threshold, waittime: wait, fullPage }
    };

    fs.writeFileSync(path.join(folder, 'result.json'), JSON.stringify(result, null, 2));
    fs.writeFileSync(path.join(folder, 'config.json'), JSON.stringify(result.config, null, 2));

    document.getElementById('status').textContent = 'Done';
    location.href = `viewer.html?report=${folderName}`;
  } catch (err) {
    console.error(err);
    document.getElementById('status').textContent = err.message;
  }
});
