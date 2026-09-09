#!/usr/bin/env node
/**
 * Generate og-image.jpg (1200×630) from og-image.html
 * 
 * Requires: npm install puppeteer
 * Run: node generate-og-image.js
 * 
 * Output: og-image.jpg in project root
 */

const fs = require('fs');
const path = require('path');

(async () => {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error('Puppeteer not found. Run: npm install puppeteer');
    process.exit(1);
  }

  const htmlPath = path.join(__dirname, 'og-image.html');
  const outPath = path.join(__dirname, 'og-image.jpg');

  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: og-image.html not found at ${htmlPath}. Create this file before running the script.`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: outPath,
    type: 'jpeg',
    quality: 92,
  });

  await browser.close();
  console.log(`Generated: ${outPath}`);
})();
