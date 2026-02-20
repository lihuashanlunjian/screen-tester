# Chrome Extension Packaging Script
Write-Host "Packing Chrome extension..." -ForegroundColor Green

# Clean up old files
$extensionDir = "chrome-extension"
$zipPath = "screen-master-extension.zip"

if (Test-Path $extensionDir) {
    Remove-Item -Path $extensionDir -Recurse -Force
    Write-Host "Cleaned up old extension folder"
}

if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force
    Write-Host "Cleaned up old ZIP file"
}

# Create extension directory
New-Item -ItemType Directory -Path $extensionDir | Out-Null
Write-Host "Created extension folder"

# Files to copy
$filesToCopy = @(
    "manifest.json",
    "icon16.png",
    "icon48.png",
    "icon128.png",
    "tester.html",
    "tester.js",
    "tester.css",
    "report-generator.js"
)

# Copy files
foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "$extensionDir\"
        Write-Host "Copied: $file" -ForegroundColor Cyan
    } else {
        Write-Host "Warning: File not found - $file" -ForegroundColor Yellow
    }
}

# Copy popup files
Copy-Item -Path "extension\popup.html" -Destination "$extensionDir\popup.html"
Write-Host "Copied: extension\popup.html -> popup.html" -ForegroundColor Cyan

Copy-Item -Path "extension\popup.js" -Destination "$extensionDir\popup.js"
Write-Host "Copied: extension\popup.js -> popup.js" -ForegroundColor Cyan

Write-Host "`nExtension files copied successfully!" -ForegroundColor Green
Write-Host "Now creating ZIP archive..." -ForegroundColor Yellow

# Create ZIP
Compress-Archive -Path "$extensionDir\*" -DestinationPath $zipPath -Force

Write-Host "`n✅ Success!" -ForegroundColor Green
Write-Host "Extension packed to: $zipPath" -ForegroundColor Cyan
Write-Host "You can now upload this ZIP file to Chrome Web Store." -ForegroundColor Gray
