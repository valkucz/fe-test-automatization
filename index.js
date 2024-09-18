// @ts-check

const puppeteer = require('puppeteer');

const url = 'http://localhost:8080/web-dev/';
const minWidth = 150;
const minHeight = 400;
const maxWidth = 800;
const maxHeight = 8000;


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



async function takeScreenshots() {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // resolutions.forEach(([width, height]) => {})
    for (const { width, height } of resolutions) {
        console.log(`Taking screenshot at resolution: ${width}x${height}`);
        await page.setViewport({
            width: width,
            height: height,
            deviceScaleFactor: 1
        });
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.screenshot({
            path: `screenshots/screenshot-${width}x${height}.png`,
            fullPage: true
        });
    }

    // Close the browser
    await browser.close();
    console.log('Screenshots taken for all resolutions.');
}

takeScreenshots();

