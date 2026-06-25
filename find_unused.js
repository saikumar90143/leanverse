const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      if(file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, '/', file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('src');
const pages = fs.readdirSync('src/app', {withFileTypes: true}).filter(d => d.isDirectory()).map(d => d.name);
const unused = [];

for(const page of pages) {
  if(['api','auth','login','admin'].includes(page)) continue;
  let found = false;
  for(const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if(content.includes('"' + '/' + page) || content.includes('`' + '/' + page) || content.includes("'" + '/' + page)) {
      found = true;
      break;
    }
  }
  if(!found) unused.push(page);
}

console.log('Unused routes:', unused);
