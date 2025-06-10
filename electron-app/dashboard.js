const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '..', 'reports');
const tbody = document.getElementById('reportsBody');

function loadReports(filter = '') {
  tbody.innerHTML = '';
  if (!fs.existsSync(reportsDir)) return;
  const dirs = fs.readdirSync(reportsDir).sort().reverse();
  dirs.forEach(dir => {
    const resultFile = path.join(reportsDir, dir, 'result.json');
    if (!fs.existsSync(resultFile)) return;
    const data = JSON.parse(fs.readFileSync(resultFile));
    const searchStr = `${dir} ${data.status} ${data.mismatchPixels}`.toLowerCase();
    if (filter && !searchStr.includes(filter.toLowerCase())) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${dir}</td><td>${data.status}</td><td>${data.mismatchPixels}</td>`;
    tr.onclick = () => {
      location.href = `viewer.html?report=${dir}`;
    };
    tbody.appendChild(tr);
  });
}

document.getElementById('newBtn').addEventListener('click', () => {
  location.href = 'new.html';
});

document.getElementById('search').addEventListener('input', e => {
  loadReports(e.target.value);
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

loadReports();
