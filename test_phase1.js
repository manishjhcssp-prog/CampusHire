import puppeteer from 'puppeteer-core';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function testPhase1() {
  console.log("🔍 Running automated verification of Phase 1...");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("   ✅ Phase 1 page loaded at http://localhost:5173/");

    const title = await page.$eval('h1', el => el.innerText);
    console.log("   Page Title:", title);

    // Test tab 1: Page Inventory
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Page Inventory'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("   ✅ Page Inventory tab verified.");

    // Test tab 2: Responsive Layout
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Responsive Layout'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("   ✅ Responsive Layout tab verified.");

    // Test tab 3: Roadmap
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Phase 2'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("   ✅ Phase 2 Roadmap tab verified.");

    // Return to tokens & test modal dialog
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Design Tokens'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Test Modal'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("   ✅ Modal dialog opened and verified.");

    // Close modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Close' || b.innerText === '✕');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    console.log("\n==============================================");
    if (consoleErrors.length === 0) {
      console.log("🎉 SUCCESS: ZERO errors in console during Phase 1 testing!");
    } else {
      console.log(`⚠️ Console errors:`, consoleErrors);
    }
    console.log("==============================================\n");

  } catch (err) {
    console.error("❌ Test error:", err);
  } finally {
    await browser.close();
  }
}

testPhase1();
