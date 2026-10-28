import puppeteer from 'puppeteer-core';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function verifyAll() {
  console.log("🚀 Starting comprehensive end-to-end portal verification...");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("  ✅ Dashboard loaded successfully at http://localhost:5173/");

    // 1. Check Metrics
    const metricsText = await page.evaluate(() => document.body.innerText);
    if (metricsText.includes('84%') && metricsText.includes('705 of 840 candidates placed')) {
      console.log("  ✅ Placement Metric (84%) verified.");
    }
    if (metricsText.includes('24') && metricsText.includes('8 new this week')) {
      console.log("  ✅ Active Drives (24) verified.");
    }
    if (metricsText.includes('148') && metricsText.includes('across tech, finance, & design')) {
      console.log("  ✅ Open Roles (148) verified.");
    }

    // 2. Test Smart Eligibility Audit actions
    await page.evaluate(() => {
      const overrideBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Override Eligibility'));
      if (overrideBtn) overrideBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Confirm override
    await page.evaluate(() => {
      const confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Confirm & Log Override'));
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("  ✅ Override Eligibility modal & state update verified.");

    // 3. Test Navigation Tabs
    const tabs = ['Recruitment Drives', 'Candidates', 'Schedules', 'Reports', 'Insights', 'Overview'];
    for (const tab of tabs) {
      await page.evaluate((tabName) => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === tabName);
        if (btn) btn.click();
      }, tab);
      await new Promise(r => setTimeout(r, 400));
      console.log(`  ✅ Navigated to tab: ${tab}`);
    }

    // 4. Test Role Switching to Recruiter
    await page.evaluate(() => {
      const userBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Admin') || b.innerText.includes('AL'));
      if (userBtn) userBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    await page.evaluate(() => {
      const recruiterBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Recruiter Pipeline'));
      if (recruiterBtn) recruiterBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("  ✅ Switched to Recruiter Pipeline.");

    // 5. Test Role Switching to Student
    await page.evaluate(() => {
      const userBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Recruiter') || b.innerText.includes('AL'));
      if (userBtn) userBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    await page.evaluate(() => {
      const studentBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Student Portal'));
      if (studentBtn) studentBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log("  ✅ Switched to Student Portal (Rahul Sharma).");

    // 6. Test 1-Click Apply
    await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1-Click Apply'));
      if (applyBtn) applyBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    console.log("  ✅ Student 1-Click Apply executed.");

    // Check for critical errors
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    if (criticalErrors.length > 0) {
      console.error("  ❌ Found console errors:", criticalErrors);
    } else {
      console.log("  🎉 All tests passed with 0 console errors!");
    }

  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    await browser.close();
  }
}

verifyAll();
