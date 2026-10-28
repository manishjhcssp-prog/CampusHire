import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('screenshots');
const outputVideo = path.join(outputDir, 'campushire_demo_walkthrough.mp4');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordFullDemo() {
  console.log('🎬 Starting CampusHire Full Demo Video Recording...');
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--hide-scrollbars',
      '--force-device-scale-factor=1'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 20000 });
  await sleep(1500);

  // Inject sleek animated demo cursor and ripple effects
  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.id = 'demo-mouse';
    cursor.style.position = 'fixed';
    cursor.style.top = '200px';
    cursor.style.left = '200px';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.borderRadius = '50%';
    cursor.style.background = 'radial-gradient(circle, #38bdf8 20%, rgba(14, 165, 233, 0.4) 70%, transparent 100%)';
    cursor.style.border = '2px solid rgba(255, 255, 255, 0.9)';
    cursor.style.boxShadow = '0 0 16px #38bdf8, inset 0 0 8px #38bdf8';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'transform 0.12s ease-out, background 0.15s ease, box-shadow 0.15s ease';
    document.body.appendChild(cursor);

    window.__cursorX = 200;
    window.__cursorY = 200;

    window.updateDemoCursor = (x, y, isClick = false) => {
      window.__cursorX = x;
      window.__cursorY = y;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      if (isClick) {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
        cursor.style.background = 'radial-gradient(circle, #f59e0b 40%, rgba(245, 158, 11, 0.6) 80%, transparent 100%)';
        cursor.style.boxShadow = '0 0 20px #f59e0b';

        // Ripple pulse
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid #38bdf8';
        ripple.style.transform = 'translate(-50%, -50%) scale(1)';
        ripple.style.opacity = '1';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999998';
        ripple.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
        document.body.appendChild(ripple);
        requestAnimationFrame(() => {
          ripple.style.transform = 'translate(-50%, -50%) scale(5)';
          ripple.style.opacity = '0';
        });
        setTimeout(() => ripple.remove(), 450);
      } else {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'radial-gradient(circle, #38bdf8 20%, rgba(14, 165, 233, 0.4) 70%, transparent 100%)';
        cursor.style.boxShadow = '0 0 16px #38bdf8, inset 0 0 8px #38bdf8';
      }
    };
  });

  // Spawn FFmpeg for 1080p 30fps H.264 encoding
  console.log(`🎥 Initializing FFmpeg encoder to ${outputVideo}...`);
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', '30',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '19',
    '-movflags', '+faststart',
    outputVideo
  ]);

  ffmpeg.stderr.on('data', (d) => {
    // Suppress verbose ffmpeg logs
  });

  const client = await page.target().createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    maxWidth: 1920,
    maxHeight: 1080,
    everyNthFrame: 1
  });

  let totalFrames = 0;
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    totalFrames++;
    try {
      ffmpeg.stdin.write(Buffer.from(data, 'base64'));
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {}
  });

  // Cursor motion helper
  async function moveCursorTo(targetX, targetY, durationMs = 600) {
    const startX = await page.evaluate(() => window.__cursorX || 200);
    const startY = await page.evaluate(() => window.__cursorY || 200);
    const steps = Math.max(10, Math.floor(durationMs / 20));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      // easeInOutCubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const curX = startX + (targetX - startX) * ease;
      const curY = startY + (targetY - startY) * ease;
      await page.evaluate(({ x, y }) => window.updateDemoCursor(x, y, false), { x: curX, y: curY });
      await sleep(20);
    }
  }

  async function clickAt(targetX, targetY) {
    await moveCursorTo(targetX, targetY, 400);
    await page.evaluate(({ x, y }) => window.updateDemoCursor(x, y, true), { x: targetX, y: targetY });
    await sleep(150);
    await page.mouse.click(targetX, targetY);
    await page.evaluate(({ x, y }) => window.updateDemoCursor(x, y, false), { x: targetX, y: targetY });
    await sleep(200);
  }

  async function clickElement(selector) {
    const el = await page.$(selector);
    if (!el) return;
    const box = await el.boundingBox();
    if (!box) return;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await clickAt(x, y);
  }

  // ==========================================
  // SCENE 1: Introduction to Overview Dashboard
  // ==========================================
  console.log('Recording Scene 1: Overview Dashboard Introduction...');
  await sleep(1200);

  // Point to Logo and Online status pill
  await moveCursorTo(180, 42, 800);
  await sleep(800);
  await moveCursorTo(250, 42, 500);
  await sleep(600);

  // Glide across Top Row Metrics
  console.log('Gliding across Top Metrics...');
  // Placements 84% Card
  await moveCursorTo(300, 160, 700);
  await sleep(1000);
  // Active Drives Card
  await moveCursorTo(520, 160, 600);
  await sleep(800);
  // Open Roles Card
  await moveCursorTo(740, 160, 600);
  await sleep(900);

  // ==========================================
  // SCENE 2: Ongoing Drives & Workflows
  // ==========================================
  console.log('Recording Scene 2: Ongoing Drives Workflow Pipeline...');
  // Hover over Google Software Engineer
  await moveCursorTo(260, 370, 700);
  await sleep(800);

  // Click on Interview stage pill for Google SDE
  console.log('Advancing Google SDE stage to Interview...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const interviewBtn = btns.find(b => b.innerText.trim() === 'Interview');
    if (interviewBtn) {
      const rect = interviewBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      interviewBtn.click();
    }
  });
  await sleep(1200);

  // Click on Offer stage pill for Google SDE
  console.log('Advancing Google SDE stage to Offer...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const offerBtn = btns.find(b => b.innerText.trim() === 'Offer');
    if (offerBtn) {
      const rect = offerBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      offerBtn.click();
    }
  });
  await sleep(1200);

  // ==========================================
  // SCENE 3: Smart Eligibility & Audit Engine
  // ==========================================
  console.log('Recording Scene 3: Smart Academic Eligibility & Live Audit...');
  // Move to Smart Eligibility card
  await moveCursorTo(1180, 240, 800);
  await sleep(900);

  // Hover over CGPA checkmark
  await moveCursorTo(1060, 420, 600);
  await sleep(700);

  // Hover over No Active Backlogs
  await moveCursorTo(1160, 420, 500);
  await sleep(700);

  // Hover over CS Cohort
  await moveCursorTo(1260, 420, 500);
  await sleep(700);

  // Test Candidate Switcher in Live Audit
  console.log('Switching candidate in Live Audit selector...');
  await moveCursorTo(1160, 125, 600);
  await page.select('select', 'std-priya');
  await sleep(1400);

  // Switch back to Rahul Sharma
  await page.select('select', 'std-rahul');
  await sleep(1200);

  // Open "Override Eligibility" Modal
  console.log('Opening Override Eligibility Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('Override Eligibility'));
    if (b) {
      const rect = b.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      b.click();
    }
  });
  await sleep(1200);

  // Move cursor onto modal textarea and justification
  await moveCursorTo(960, 520, 700);
  await sleep(1200);

  // Click Confirm & Log Override
  console.log('Confirming Override...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(btn => btn.innerText.includes('Confirm & Log Override'));
    if (confirmBtn) {
      const rect = confirmBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      confirmBtn.click();
    }
  });
  await sleep(1500);

  // Open "Send Admission / Approve" Modal
  console.log('Opening Send Admission Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('Send Admission / Approve'));
    if (b) {
      const rect = b.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      b.click();
    }
  });
  await sleep(1000);

  // Click Authorize & Send Pass
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sendBtn = btns.find(btn => btn.innerText.includes('Authorize & Send Pass'));
    if (sendBtn) {
      const rect = sendBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      sendBtn.click();
    }
  });
  await sleep(1600);

  // ==========================================
  // SCENE 4: Schedules & Mini Calendar
  // ==========================================
  console.log('Recording Scene 4: Interactive Calendar & Schedules...');
  // Hover over Upcoming Schedules
  await moveCursorTo(250, 720, 700);
  await sleep(800);

  // Click Date 22 on calendar
  console.log('Interacting with Calendar dates...');
  await moveCursorTo(740, 760, 700);
  await sleep(400);
  await page.evaluate(() => {
    const dayBtns = Array.from(document.querySelectorAll('button'));
    const d22 = dayBtns.find(b => b.innerText.trim() === '22');
    if (d22) {
      const rect = d22.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      d22.click();
    }
  });
  await sleep(1000);

  // Click Date 18 back
  await page.evaluate(() => {
    const dayBtns = Array.from(document.querySelectorAll('button'));
    const d18 = dayBtns.find(b => b.innerText.trim() === '18');
    if (d18) {
      const rect = d18.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      d18.click();
    }
  });
  await sleep(1000);

  // ==========================================
  // SCENE 5: Tab Navigation & Analytics
  // ==========================================
  console.log('Recording Scene 5: Tabs Navigation...');
  
  // Tab 1: Recruitment Drives
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const t = tabs.find(b => b.innerText.trim() === 'Recruitment Drives');
    if (t) {
      const rect = t.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      t.click();
    }
  });
  await sleep(2000);

  // Tab 2: Candidates Directory
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const t = tabs.find(b => b.innerText.trim() === 'Candidates');
    if (t) {
      const rect = t.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      t.click();
    }
  });
  await sleep(1800);

  // Tab 3: Reports View with Recharts
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const t = tabs.find(b => b.innerText.trim() === 'Reports');
    if (t) {
      const rect = t.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      t.click();
    }
  });
  await sleep(2200);

  // Tab 4: Insights View with AI Skill Demand
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const t = tabs.find(b => b.innerText.trim() === 'Insights');
    if (t) {
      const rect = t.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      t.click();
    }
  });
  await sleep(2000);

  // ==========================================
  // SCENE 6: Persona Switch - Student Portal
  // ==========================================
  console.log('Recording Scene 6: Student Portal Persona Switch...');
  // Open User Profile Menu
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const profileBtn = allButtons.find(b => b.innerText.includes('Admin') || b.innerText.includes('AL'));
    if (profileBtn) {
      const rect = profileBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      profileBtn.click();
    }
  });
  await sleep(800);

  // Select Student View
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const studentOption = allButtons.find(b => b.innerText.includes('Student') || b.innerText.includes('Rahul Sharma'));
    if (studentOption) {
      const rect = studentOption.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      studentOption.click();
    }
  });
  await sleep(1600);

  // Hover over Rahul Sharma's profile & CGPA
  await moveCursorTo(250, 150, 700);
  await sleep(1000);

  // 1-Click Apply on Google Software Engineer
  console.log('Performing 1-Click Apply as Rahul Sharma...');
  await page.evaluate(() => {
    const applyBtns = Array.from(document.querySelectorAll('button'));
    const btn = applyBtns.find(b => b.innerText.includes('1-Click Apply'));
    if (btn) {
      const rect = btn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      btn.click();
    }
  });
  await sleep(1800);

  // View My Applications tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const myAppTab = tabs.find(b => b.innerText.includes('My Applications'));
    if (myAppTab) {
      const rect = myAppTab.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      myAppTab.click();
    }
  });
  await sleep(1800);

  // ==========================================
  // SCENE 7: Persona Switch - Recruiter Portal
  // ==========================================
  console.log('Recording Scene 7: Recruiter Portal Persona Switch...');
  // Open User Profile Menu
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const profileBtn = allButtons.find(b => b.innerText.includes('Student') || b.innerText.includes('AL'));
    if (profileBtn) {
      const rect = profileBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      profileBtn.click();
    }
  });
  await sleep(800);

  // Select Recruiter View
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const recOption = allButtons.find(b => b.innerText.includes('Recruiter'));
    if (recOption) {
      const rect = recOption.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      recOption.click();
    }
  });
  await sleep(2000);

  // ==========================================
  // SCENE 8: Outro - Back to Admin Overview
  // ==========================================
  console.log('Recording Scene 8: Return to Admin Overview Outro...');
  // Click Switch to Admin View
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const adminBtn = allButtons.find(b => b.innerText.includes('Switch to Admin View'));
    if (adminBtn) {
      const rect = adminBtn.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      adminBtn.click();
    }
  });
  await sleep(1500);

  // Return to Overview tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const ov = tabs.find(b => b.innerText.trim() === 'Overview');
    if (ov) {
      const rect = ov.getBoundingClientRect();
      window.updateDemoCursor(rect.x + rect.width / 2, rect.y + rect.height / 2, true);
      ov.click();
    }
  });
  await sleep(2500);

  // Stop screencast and close FFmpeg encoder
  console.log('Stopping screencast and finalizing video...');
  await client.send('Page.stopScreencast');
  ffmpeg.stdin.end();

  await new Promise((resolve) => ffmpeg.on('close', resolve));
  await browser.close();

  const fileStats = fs.statSync(outputVideo);
  console.log(`🎉 Demo Video successfully recorded and saved to: ${outputVideo}`);
  console.log(`📊 Video File Size: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB, Total Frames Encoded: ${totalFrames}`);
}

recordFullDemo().catch((err) => {
  console.error('Fatal recording error:', err);
  process.exit(1);
});
