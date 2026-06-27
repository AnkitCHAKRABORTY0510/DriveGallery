import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const REQUIRED_DIRECTORIES = [
  'app',
  'actions',
  'components/ui',
  'components/shared',
  'components/layout',
  'components/navigation',
  'components/feedback',
  'components/providers',
  'config',
  'constants',
  'features/auth',
  'features/gallery',
  'features/collections',
  'features/profile',
  'features/events',
  'features/search',
  'features/settings',
  'hooks',
  'lib',
  'middleware',
  'models',
  'repositories',
  'schemas',
  'services',
  'stores',
  'styles',
  'types',
  'utils',
];

function checkStructure() {
  let hasErrors = false;

  console.log('Verifying project structure...');

  if (!fs.existsSync(SRC_DIR)) {
    console.error('❌ src directory is missing');
    process.exit(1);
  }

  for (const dir of REQUIRED_DIRECTORIES) {
    const fullPath = path.join(SRC_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing directory: src/${dir}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\nProject structure verification failed.');
    console.log('Run `npm run bootstrap` to generate missing directories.');
    process.exit(1);
  }

  console.log('✅ Project structure verified successfully.');
}

checkStructure();
