const fs = require('fs');
const path = require('path');

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.sql'];
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.react-router'];

function stripComments(content, ext) {
  if (ext === '.sql') {
    // Remove -- comments and /* */
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/--.*$/gm, '');
  }
  
  // For JS/TS
  // 1. Remove block comments
  let newContent = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 2. Remove line comments, preserving URLs (http://, https://)
  // We match // that is NOT preceded by a colon
  newContent = newContent.replace(/([^:]|^)\/\/.*$/gm, '$1');
  
  return newContent;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        walk(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        console.log(`Cleaning ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const newContent = stripComments(content, ext);
        fs.writeFileSync(filePath, newContent);
      }
    }
  }
}

console.log('Stripping comments from apps/web/app...');
walk('./apps/web/app');
console.log('Stripping comments from supabase/migrations...');
walk('./supabase/migrations');
console.log('Done.');
