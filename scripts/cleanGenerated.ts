import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

function cleanEmptyDirectories(dir: string) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanEmptyDirectories(fullPath);
    }
  }

  const remainingFiles = fs.readdirSync(dir);
  if (remainingFiles.length === 0 || (remainingFiles.length === 1 && remainingFiles[0] === '.gitkeep')) {
    if (dir !== SRC_DIR) {
      if (remainingFiles.includes('.gitkeep')) {
        fs.unlinkSync(path.join(dir, '.gitkeep'));
      }
      fs.rmdirSync(dir);
      console.log(`Removed empty directory: ${dir}`);
    }
  }
}

console.log('Cleaning empty generated directories...');
cleanEmptyDirectories(SRC_DIR);
console.log('✅ Clean complete.');
