const fs = require('fs');
const path = require('path');

const params = new URLSearchParams(location.search);
const report = params.get('report');
const reportsDir = path.join(__dirname, '..', 'reports');
const folder = path.join(reportsDir, report || '');

function load() {
  if (!report) return;
  const resultFile = path.join(folder, 'result.json');
  if (!fs.existsSync(resultFile)) return;
  const data = JSON.parse(fs.readFileSync(resultFile));
  document.getElementById('actualImg').src = path.join(folder, data.actual);
  document.getElementById('expectedImg').src = path.join(folder, data.expected);
  document.getElementById('diffImg').src = path.join(folder, data.diff);
  document.getElementById('json').textContent = JSON.stringify(data, null, 2);
}

document.getElementById('backBtn').addEventListener('click', () => {
  location.href = 'index.html';
});

document.getElementById('exportBtn').addEventListener('click', () => {
  window.print();
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

load();
