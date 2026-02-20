const fs = require('fs');
const path = require('path');

const extensionDir = path.join(__dirname, 'chrome-extension');
const zipPath = path.join(__dirname, 'screen-master-extension.zip');

console.log('=== Chrome Extension Packager ===\n');

// Clean up
try {
    if (fs.existsSync(extensionDir)) {
        fs.rmSync(extensionDir, { recursive: true, force: true });
        console.log('Cleaned old extension folder');
    }
    if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
        console.log('Cleaned old ZIP file');
    }
} catch (e) {
    console.log('Cleanup done or not needed');
}

// Create directory
fs.mkdirSync(extensionDir);
console.log('Created extension folder\n');

// Copy manifest and icons
const coreFiles = [
    'manifest.json',
    'icon16.png',
    'icon48.png',
    'icon128.png',
    'tester.html',
    'tester.js',
    'tester.css',
    'report-generator.js'
];

coreFiles.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(extensionDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied: ${file}`);
    }
});

// Copy popup files
const popupSrc1 = path.join(__dirname, 'extension', 'popup.html');
const popupDest1 = path.join(extensionDir, 'popup.html');
if (fs.existsSync(popupSrc1)) {
    fs.copyFileSync(popupSrc1, popupDest1);
    console.log('✓ Copied: popup.html');
}

const popupSrc2 = path.join(__dirname, 'extension', 'popup.js');
const popupDest2 = path.join(extensionDir, 'popup.js');
if (fs.existsSync(popupSrc2)) {
    fs.copyFileSync(popupSrc2, popupDest2);
    console.log('✓ Copied: popup.js');
}

console.log('\n✅ All files copied to chrome-extension folder!');
console.log('\nNext steps:');
console.log('1. Open File Explorer to this folder');
console.log('2. Select the "chrome-extension" folder');
console.log('3. Right-click -> Send to -> Compressed (zipped) folder');
console.log('4. Rename to screen-master-extension.zip');
console.log('5. Upload to Chrome Web Store!\n');
