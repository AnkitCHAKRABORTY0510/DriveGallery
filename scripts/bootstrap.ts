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

function bootstrap() {
  console.log('Bootstrapping project structure...');

  if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
    console.log(`Created: src/`);
  }

  for (const dir of REQUIRED_DIRECTORIES) {
    const fullPath = path.join(SRC_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      
      // Add a .gitkeep to ensure empty directories are tracked
      const gitkeepPath = path.join(fullPath, '.gitkeep');
      fs.writeFileSync(gitkeepPath, '');
      
      console.log(`Created: src/${dir}`);
    }
  }

  console.log('✅ Project bootstrap complete.');
}

bootstrap();
