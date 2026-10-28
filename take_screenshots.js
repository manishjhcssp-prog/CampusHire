import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const screenshotDir = path.resolve('screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    console.log("Navigating to http://localhost:5173/...");
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 1: Overview Dashboard
    await page.screenshot({ path: path.join(screenshotDir, 'campushire_overview.png'), fullPage: false });
    console.log("Saved campushire_overview.png");

    // Screenshot 2: Click Recruitment Drives tab
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Recruitment Drives'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotDir, 'campushire_drives.png'), fullPage: false });
    console.log("Saved campushire_drives.png");

    // Screenshot 3: Switch to Student view
    await page.evaluate(() => {
      // open user dropdown
      const userBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Admin') || b.innerText.includes('AL'));
      if (userBtn) userBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    await page.evaluate(() => {
      const studentBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Student Portal'));
      if (studentBtn) studentBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotDir, 'campushire_student_portal.png'), fullPage: false });
    console.log("Saved campushire_student_portal.png");

    console.log("All screenshots captured successfully!");
  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

capture();
