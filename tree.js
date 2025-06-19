const fs = require('fs');
const path = require('path');

const ignore = ['node_modules', '.git', 'dist', ".idea"]; // Customize as needed

function listDir(dir, indent = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (ignore.includes(file)) return; // Skip ignored dirs

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    console.log(indent + '├─ ' + file);
    if (stat.isDirectory()) {
      listDir(fullPath, indent + '│  ');
    }
  });
}

listDir('.');
