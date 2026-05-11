const fs = require('fs');
const path = require('path');

const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'public', '.gemini', 'scripts'];
const EXTENSIONS = ['.tsx', '.ts', '.json', '.mjs', '.cjs'];

// Only replace display/branding text, NOT technical identifiers like
// database names, email addresses, or file paths
const replacements = [
  // Display text replacements (case-sensitive pairs)
  { from: 'Goodkid Zone Rwanda', to: 'Good Kidzone Rwanda' },
  { from: 'Goodkid Zone', to: 'Good Kidzone' },
  { from: 'goodkid zone', to: 'good kidzone' },
];

// File paths and technical identifiers to SKIP (don't rename these)
const skipPatterns = [
  'goodkid-zone-logo',     // image filename reference
  'goodkidzone.rw',        // email domain
  "db('goodkidzone')",     // database name
  'admin@goodkidzone',     // admin email
];

function shouldSkipLine(line) {
  return skipPatterns.some(p => line.includes(p));
}

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
        const original = fs.readFileSync(fullPath, 'utf8');
        let content = original;
        
        // Process line by line to respect skip patterns
        const lines = content.split('\n');
        const newLines = lines.map(line => {
          if (shouldSkipLine(line)) return line;
          let newLine = line;
          for (const { from, to } of replacements) {
            newLine = newLine.split(from).join(to);
          }
          return newLine;
        });
        content = newLines.join('\n');
        
        if (content !== original) {
          console.log('Updated:', fullPath);
          fs.writeFileSync(fullPath, content);
        }
      } catch (e) {
        // skip
      }
    }
  }
}

replaceInDir('.');
console.log('Brand name update complete.');
