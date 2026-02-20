const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const extensionDir = path.join(__dirname, 'chrome-extension');
const zipPath = path.join(__dirname, 'screen-master-extension.zip');

console.log('Packing Chrome extension...');

// Clean up old files
if (fs.existsSync(extensionDir)) {
    fs.rmSync(extensionDir, { recursive: true, force: true });
}
if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

// Create extension directory
fs.mkdirSync(extensionDir);

// Files to copy (popup files go to root of extension)
const filesToCopy = [
    'manifest.json',
    'icon16.png',
    'icon48.png',
    'icon128.png',
    'tester.html',
    'tester.js',
    'tester.css',
    'report-generator.js'
];

// Copy files to extension root
filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(extensionDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${file}`);
    } else {
        console.warn(`Warning: File not found - ${file}`);
    }
});

// Copy popup files directly to extension root
const popupFiles = [
    { src: 'extension/popup.html', dest: 'popup.html' },
    { src: 'extension/popup.js', dest: 'popup.js' }
];

popupFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(extensionDir, dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${src} -> ${dest}`);
    } else {
        console.warn(`Warning: File not found - ${src}`);
    }
});

console.log('\nExtension files copied successfully!');
console.log('Now creating ZIP archive...');

// Create ZIP using PowerShell Compress-Archive
const psCommand = `Compress-Archive -Path "${extensionDir}\\*" -DestinationPath "${zipPath}" -Force`;

exec(`powershell -Command "${psCommand}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error creating ZIP: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`Warning: ${stderr}`);
    }
    console.log('\n✅ Success!');
    console.log(`Extension packed to: ${zipPath}`);
    console.log('You can now upload this ZIP file to Chrome Web Store.');
});

