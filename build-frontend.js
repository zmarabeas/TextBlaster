#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building frontend for Vercel deployment...');

try {
  // Ensure we're building from the client directory
  process.chdir('./client');
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the frontend
  console.log('Building React application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Move build output to root dist directory
  const buildDir = path.join(__dirname, 'client', 'dist');
  const targetDir = path.join(__dirname, 'dist');
  
  if (fs.existsSync(buildDir)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy built files to root dist
    execSync(`cp -r ${buildDir}/* ${targetDir}/`, { stdio: 'inherit' });
    console.log('Frontend build completed successfully!');
  } else {
    throw new Error('Build directory not found');
  }
  
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}