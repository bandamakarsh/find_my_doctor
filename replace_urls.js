const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

const OLD = 'http://localhost:5000';
const NEW = '${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}';

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace single-quoted strings: 'http://localhost:5000/...' => `${...}/...`
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, (match, rest) => {
    return '`' + NEW + rest + '`';
  });

  // Replace already-template-literal strings: `http://localhost:5000...` => `${...}...`
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, (match, rest) => {
    return '`' + NEW + rest + '`';
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', file);
}

console.log('\nDone! All localhost:5000 URLs replaced with VITE_API_URL env variable.');
