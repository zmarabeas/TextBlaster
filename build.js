#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Build the frontend
  console.log('Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Copy API files to ensure they're available
  console.log('Preparing API files...');
  if (fs.existsSync('api')) {
    if (!fs.existsSync('dist/api')) {
      fs.mkdirSync('dist/api', { recursive: true });
    }
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}