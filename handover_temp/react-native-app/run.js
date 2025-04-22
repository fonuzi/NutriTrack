#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 PERFORMIZE React Native App Setup');
console.log('-----------------------------------');

// Check for Node.js and npm
try {
  const nodeVersion = execSync('node -v').toString().trim();
  const npmVersion = execSync('npm -v').toString().trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
  console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
  console.error('❌ Error checking Node.js/npm versions:', error.message);
  process.exit(1);
}

// Check if package.json exists
try {
  const packageJson = require('./package.json');
  console.log(`✅ Package: ${packageJson.name}@${packageJson.version}`);
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Check for .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  
  // Check if OPENAI_API_KEY is configured
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('OPENAI_API_KEY=your_openai_api_key_here')) {
    console.log('⚠️ Warning: Default OpenAI API key detected. Please update the .env file with your actual API key.');
  } else if (envContent.includes('OPENAI_API_KEY=')) {
    console.log('✅ OPENAI_API_KEY configured');
  } else {
    console.log('❌ OPENAI_API_KEY not found in .env file. Add it to enable AI features.');
  }
} else {
  console.log('⚠️ .env file not found. Create one with your OpenAI API key to enable AI features.');
  console.log('Example: OPENAI_API_KEY=your_openai_api_key_here');
}

// Simulate Metro bundler starting
console.log('\n📱 React Native Development Environment');
console.log('---------------------------------------');
console.log('Note: This is a simulation in the Replit environment.');
console.log('To run the app on a real device, you need to:');
console.log('1. Clone this repository to your local machine');
console.log('2. Install dependencies with `npm install`');
console.log('3. Run `npm run ios` or `npm run android`');
console.log('\nStructure of the PERFORMIZE app:');

// List key files and folders
console.log('\nKey files and directories:');
const basePath = __dirname;
const keyPaths = [
  'src/App.tsx',
  'src/screens',
  'src/components',
  'src/context',
  'src/api',
  'package.json',
  'babel.config.js',
  'tsconfig.json'
];

keyPaths.forEach(keyPath => {
  const fullPath = path.join(basePath, keyPath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      console.log(`📂 ${keyPath} (${files.length} files)`);
    } else {
      console.log(`📄 ${keyPath}`);
    }
  } else {
    console.log(`❓ ${keyPath} (not found)`);
  }
});

console.log('\n🎉 Setup complete!');
console.log('Ready to develop the PERFORMIZE fitness app.');