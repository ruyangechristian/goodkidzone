const fs = require('fs');
const path = require('path');

const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'public', '.gemini'];
const EXTENSIONS = ['.tsx', '.ts', '.css', '.js', '.jsx', '.json', '.mjs', '.cjs'];

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        replaceInDir(fullPath);
      }
    } else if (EXTENSIONS.some(ext => file.endsWith(ext))) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('border-muted')) {
          console.log('Updating:', fullPath);
          content = content.split('border-muted').join('border-muted');
          fs.writeFileSync(fullPath, content);
        }
      } catch (e) {
        // Skip binary or unreadable files
      }
    }
  }
}

replaceInDir('.');
console.log('Deep replacement complete.');
