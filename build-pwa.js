import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure the client/public directory exists
const clientPublicDir = path.join(__dirname, 'client/public');
const distPublicDir = path.join(__dirname, 'dist/public');
const iconsDir = path.join(distPublicDir, 'icons');

if (!fs.existsSync(clientPublicDir)) {
  fs.mkdirSync(clientPublicDir, { recursive: true });
}

// Run the standard build
console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' });

// Copy PWA assets to the dist/public directory
console.log('Copying PWA assets...');
const copyPwaAssets = () => {
  // Ensure the icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Copy the manifest file
  fs.copyFileSync(
    path.join(clientPublicDir, 'manifest.json'), 
    path.join(distPublicDir, 'manifest.json')
  );
  
  // Copy the service worker
  fs.copyFileSync(
    path.join(clientPublicDir, 'service-worker.js'), 
    path.join(distPublicDir, 'service-worker.js')
  );
  
  // Copy the icons
  fs.copyFileSync(
    path.join(clientPublicDir, 'icons/icon-192x192.png'), 
    path.join(iconsDir, 'icon-192x192.png')
  );
  fs.copyFileSync(
    path.join(clientPublicDir, 'icons/icon-512x512.png'), 
    path.join(iconsDir, 'icon-512x512.png')
  );
  
  // Copy the splash screen
  fs.copyFileSync(
    path.join(clientPublicDir, 'apple-splash.html'), 
    path.join(distPublicDir, 'apple-splash.html')
  );
};

copyPwaAssets();

console.log('PWA build completed successfully!');