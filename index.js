// @ts-check

const puppeteer = require('puppeteer');
const compare = require('./compare');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:8080/web-dev/';
const minWidth = 150;
const minHeight = 400;
const maxWidth = 800;
const maxHeight = 8000;

const categorizedResolutions = {
    'mobile': [
        { width: 320, height: 480 }, // iPhone 4
        { width: 375, height: 667 }, // iPhone 6/7/8
        { width: 414, height: 736 }, // iPhone 6/7/8 Plus
        { width: 375, height: 812 }, // iPhone X/XS/11 Pro
        { width: 414, height: 896 }, // iPhone XR/XS Max/11/11 Pro Max
    ],
    'tablet': [
        { width: 768, height: 1024 }, // iPad
        { width: 1024, height: 1366 }, // iPad Pro
        { width: 600, height: 800 }, // Tablet
    ],
    'tv': [
        { width: 1280, height: 800 }, // Laptop
        { width: 1366, height: 768 }, // Laptop
        { width: 1920, height: 1080 }, // Full HD
        { width: 3840, height: 2160 }, // 4K UHD
        { width: 1280, height: 720 }, // HD Ready
        { width: 1920, height: 1200 }, // WUXGA
        { width: 2560, height: 1440 }, // QHD
        { width: 3440, height: 1440 }, // UWQHD
        { width: 5120, height: 2880 }, // 5K UHD
        { width: 7680, height: 4320 }, // 8K UHD
        { width: 1280, height: 1024 }, // SXGA
        { width: 1920, height: 1080 }, // FHD
        { width: 2560, height: 1600 }, // WQXGA
        { width: 928, height: 522 },
        { width: 1184, height: 778 },
        { width: 1920, height: 540 },
    ],
    'special': [
        { width: 1920, height: 156 },
        { width: 3800, height: 250 }
    ]
}


const resolutions = [
    { width: 320, height: 480 }, // iPhone 4
    { width: 375, height: 667 }, // iPhone 6/7/8
    { width: 414, height: 736 }, // iPhone 6/7/8 Plus
    { width: 375, height: 812 }, // iPhone X/XS/11 Pro
    { width: 414, height: 896 }, // iPhone XR/XS Max/11/11 Pro Max
    { width: 768, height: 1024 }, // iPad
    { width: 1024, height: 1366 }, // iPad Pro
    { width: 600, height: 800 }, // Tablet
    { width: 1280, height: 800 }, // Laptop
    { width: 1366, height: 768 }, // Laptop
    { width: 1920, height: 1080 }, // Full HD
    { width: 3840, height: 2160 }, // 4K UHD
    { width: 1280, height: 720 }, // HD Ready
    { width: 1920, height: 1200 }, // WUXGA
    { width: 2560, height: 1440 }, // QHD
    { width: 3440, height: 1440 }, // UWQHD
    { width: 5120, height: 2880 }, // 5K UHD
    { width: 7680, height: 4320 }, // 8K UHD
    { width: 1280, height: 1024 }, // SXGA
    { width: 1920, height: 1080 }, // FHD
    { width: 2560, height: 1600 }, // WQXGA
    { width: 1920, height: 156 },
    { width: 928, height: 522 },
    { width: 1184, height: 778 },
    { width: 1920, height: 540 },

];

function ensureFolderExists(name)  {
    const folderPath = path.join(__dirname, name);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created folder: ${folderPath}`);
    }
}


async function takeScreenshots() {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (const [category, resolutions] of Object.entries(categorizedResolutions)) {
        console.log(`Taking screenshots for category: ${category}`);
        ensureFolderExists('screenshots/' + category);
        for (const { width, height } of resolutions) {
            console.log(`Taking screenshot at resolution: ${width}x${height}`);
            await page.setViewport({
                width: width,
                height: height,
                deviceScaleFactor: 1
            });
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.screenshot({
                path: `screenshots/${category}/screenshot-${width}x${height}.png`,
                fullPage: true
            });
        }
    }
    // Close the browser
    await browser.close();
    console.log('Screenshots taken for all resolutions.');
}

async function makeDiffs() {
    for (const [category, resolutions] of Object.entries(categorizedResolutions)) {
        let baselineUrl = null;
        console.log(`Making diffs for category: ${category}`);
        ensureFolderExists('diffs/' + category);
        for (const { width, height } of resolutions) {
            if (!baselineUrl) {
                baselineUrl = `screenshots/${category}/screenshot-${width}x${height}.png`;
                console.log(`Setting baseline for category: ${category} to ${width}x${height}`);
            }
            const currentUrl = `screenshots/${category}/screenshot-${width}x${height}.png`;
            await compare(baselineUrl, currentUrl)
        }
    }
}



// takeScreenshots().then(() => makeDiffs());
makeDiffs();

