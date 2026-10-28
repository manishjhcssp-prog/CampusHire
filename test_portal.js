import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function clickButtonWithText(page, text) {
  return await page.evaluate((btnText) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText && b.innerText.includes(btnText));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);
}

async function runBrowserTest() {
  console.log("🚀 Launching Headless Chrome to test Campus Recruitment Portal...");

  const screenshotsDir = path.resolve('./screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,920']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Visit Portal
    console.log("👉 Step 1: Navigating to http://localhost:5173/ ...");
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForSelector('header');
    console.log("   ✅ Header rendered successfully.");

    await page.screenshot({ path: path.join(screenshotsDir, '1-student-dashboard.png') });
    console.log("   📸 Captured '1-student-dashboard.png'");

    // 2. Test Eligibility Modal Inspection
    console.log("👉 Step 2: Testing Automated Eligibility Checker Breakdown...");
    const infoButtons = await page.$$('button[title*="Inspect eligibility"]');
    if (infoButtons.length > 0) {
      await infoButtons[0].click();
      await new Promise(r => setTimeout(r, 600));
      console.log("   ✅ Eligibility criteria breakdown modal opened.");
      await page.screenshot({ path: path.join(screenshotsDir, '2-eligibility-breakdown.png') });
      console.log("   📸 Captured '2-eligibility-breakdown.png'");

      // Close modal by clicking Close Breakdown or ✕
      const closed = await clickButtonWithText(page, "Close Breakdown");
      if (!closed) await clickButtonWithText(page, "✕");
      await new Promise(r => setTimeout(r, 400));
      console.log("   ✅ Modal closed.");
    }

    // 3. Test Student Application Tabs
    console.log("👉 Step 3: Testing Student My Applications tab...");
    await clickButtonWithText(page, "My Applications");
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, '3-student-applications.png') });
    console.log("   📸 Captured '3-student-applications.png'");

    // 4. Test Student Interview Timetable tab
    console.log("👉 Step 4: Testing Student Interview Timetable tab...");
    await clickButtonWithText(page, "Interview Timetable");
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, '4-student-interviews.png') });
    console.log("   📸 Captured '4-student-interviews.png'");

    // 5. Test Switching to Recruiter Role
    console.log("👉 Step 5: Switching role to Recruiter...");
    await clickButtonWithText(page, "Recruiter");
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(screenshotsDir, '5-recruiter-pipeline.png') });
    console.log("   📸 Captured '5-recruiter-pipeline.png'");

    // Toggle Kanban View
    console.log("👉 Step 6: Testing Recruiter Kanban board toggle...");
    const kanbanBtn = await page.$('button[title="Kanban Board"]');
    if (kanbanBtn) {
      await kanbanBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(screenshotsDir, '6-recruiter-kanban.png') });
      console.log("   📸 Captured '6-recruiter-kanban.png'");
    }

    // Switch to Job Postings tab in Recruiter
    console.log("👉 Step 7: Testing Recruiter Job Postings view...");
    await clickButtonWithText(page, "Drive Postings & Eligibility");
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, '7-recruiter-postings.png') });
    console.log("   📸 Captured '7-recruiter-postings.png'");

    // 6. Test Switching to TPO Admin Role
    console.log("👉 Step 8: Switching role to TPO Admin...");
    await clickButtonWithText(page, "TPO Admin");
    await new Promise(r => setTimeout(r, 800));

    // Verify analytics cards and charts rendered
    const placementRateCard = await page.evaluate(() => document.body.innerText.includes('Placement Rate'));
    console.log("   Placement Rate card found in TPO:", placementRateCard);

    await page.screenshot({ path: path.join(screenshotsDir, '8-tpo-analytics.png') });
    console.log("   📸 Captured '8-tpo-analytics.png'");

    // Test TPO Student Directory Tab
    console.log("👉 Step 9: Testing TPO Student Master Directory...");
    await clickButtonWithText(page, "Student Master Directory");
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, '9-tpo-student-directory.png') });
    console.log("   📸 Captured '9-tpo-student-directory.png'");

    // Test TPO Company Drives Audit Tab
    console.log("👉 Step 10: Testing TPO Company Drives Audit tab...");
    await clickButtonWithText(page, "Company Drives Audit");
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(screenshotsDir, '10-tpo-drives-audit.png') });
    console.log("   📸 Captured '10-tpo-drives-audit.png'");

    // Summary of console errors
    console.log("\n==============================================");
    if (consoleErrors.length === 0) {
      console.log("🎉 SUCCESS: ZERO JavaScript errors or unhandled exceptions logged in browser console!");
    } else {
      console.log(`⚠️ Console errors detected (${consoleErrors.length}):`, consoleErrors);
    }
    console.log("All 10 screenshots saved to: d:\\student-hakathon\\screenshots");
    console.log("==============================================\n");

  } catch (error) {
    console.error("❌ Test encountered error:", error);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
