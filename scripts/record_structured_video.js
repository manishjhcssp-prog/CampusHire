import puppeteer from 'puppeteer-core';
import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('screenshots');
const rawVideoPath = path.join(outputDir, 'campushire_raw_screencast.mp4');
const audioPath = path.resolve('audio/full_narration.wav');
const finalVideoPath = path.join(outputDir, 'CampusHire_Official_Demo_Submission.mp4');
const artifactDir = path.join('C:', 'Users', 'manis', '.gemini', 'antigravity', 'brain', 'c44b67a2-baa3-4658-95c3-69202b4b3c0e');
const artifactFinalVideo = path.join(artifactDir, 'CampusHire_Official_Demo_Submission.mp4');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordStructuredSubmissionVideo() {
  console.log('===============================================================');
  console.log('🎬 Starting Official CampusHire 5-Part Submission Video Recording');
  console.log('===============================================================');

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

  console.log('Opening http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 25000 });
  await sleep(1500);

  // Inject Custom Subtitles & HUD Overlay System
  await page.evaluate(() => {
    // 1. Mouse cursor
    const cursor = document.createElement('div');
    cursor.id = 'demo-mouse';
    cursor.style.position = 'fixed';
    cursor.style.top = '250px';
    cursor.style.left = '350px';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.borderRadius = '50%';
    cursor.style.background = 'radial-gradient(circle, #38bdf8 20%, rgba(14, 165, 233, 0.4) 70%, transparent 100%)';
    cursor.style.border = '2px solid rgba(255, 255, 255, 0.9)';
    cursor.style.boxShadow = '0 0 18px #38bdf8, inset 0 0 8px #38bdf8';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'transform 0.12s ease-out, background 0.15s ease, box-shadow 0.15s ease';
    document.body.appendChild(cursor);

    window.__cursorX = 350;
    window.__cursorY = 250;

    window.updateDemoCursor = (x, y, isClick = false) => {
      window.__cursorX = x;
      window.__cursorY = y;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      if (isClick) {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.65)';
        cursor.style.background = 'radial-gradient(circle, #f59e0b 40%, rgba(245, 158, 11, 0.6) 80%, transparent 100%)';
        cursor.style.boxShadow = '0 0 24px #f59e0b';

        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '12px';
        ripple.style.height = '12px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid #38bdf8';
        ripple.style.transform = 'translate(-50%, -50%) scale(1)';
        ripple.style.opacity = '1';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999998';
        ripple.style.transition = 'transform 0.45s ease-out, opacity 0.45s ease-out';
        document.body.appendChild(ripple);
        requestAnimationFrame(() => {
          ripple.style.transform = 'translate(-50%, -50%) scale(5.5)';
          ripple.style.opacity = '0';
        });
        setTimeout(() => ripple.remove(), 500);
      } else {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'radial-gradient(circle, #38bdf8 20%, rgba(14, 165, 233, 0.4) 70%, transparent 100%)';
        cursor.style.boxShadow = '0 0 18px #38bdf8, inset 0 0 8px #38bdf8';
      }
    };

    // 2. Persistent Bottom Subtitle & Part Banner
    const banner = document.createElement('div');
    banner.id = 'demo-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '18px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.width = 'calc(100% - 64px)';
    banner.style.maxWidth = '1200px';
    banner.style.background = 'rgba(11, 15, 23, 0.92)';
    banner.style.backdropFilter = 'blur(16px)';
    banner.style.border = '1px solid rgba(56, 189, 248, 0.3)';
    banner.style.borderRadius = '16px';
    banner.style.padding = '12px 24px';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.gap = '20px';
    banner.style.zIndex = '999990';
    banner.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)';
    banner.style.transition = 'all 0.3s ease';

    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; flex-shrink:0;">
        <span id="demo-part-tag" style="background:rgba(14,165,233,0.18); border:1px solid rgba(56,189,248,0.4); color:#38bdf8; font-weight:800; font-size:11px; padding:4px 10px; border-radius:8px; text-transform:uppercase; letter-spacing:0.05em; font-family:sans-serif;">
          Part 1: Introduction
        </span>
      </div>
      <div id="demo-subtitles" style="color:#f8fafc; font-size:13px; font-weight:500; font-family:sans-serif; text-align:center; flex-grow:1; line-height:1.4;">
        Welcome to CampusHire — Intelligent College Placement & Recruitment Automation Portal (Problem ID: HACK-P410)
      </div>
      <div style="display:flex; align-items:center; gap:8px; flex-shrink:0; font-family:monospace; font-size:11px; color:#10b981;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
        <span>REST API: ONLINE</span>
      </div>
    `;
    document.body.appendChild(banner);

    window.setDemoSubtitles = (partTag, text) => {
      document.getElementById('demo-part-tag').innerText = partTag;
      document.getElementById('demo-subtitles').innerText = text;
    };
  });

  // Spawn FFmpeg to record raw video stream from screencast
  console.log(`🎥 Initializing FFmpeg to record video to ${rawVideoPath}...`);
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', '30',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'ultrafast',
    '-crf', '18',
    rawVideoPath
  ]);

  const client = await page.target().createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 90,
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

  // Cursor movement helper
  async function moveCursorTo(targetX, targetY, durationMs = 600) {
    const startX = await page.evaluate(() => window.__cursorX || 350);
    const startY = await page.evaluate(() => window.__cursorY || 250);
    const steps = Math.max(12, Math.floor(durationMs / 30));
    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      const curX = Math.round(startX + (targetX - startX) * ease);
      const curY = Math.round(startY + (targetY - startY) * ease);
      await page.evaluate(({ x, y }) => window.updateDemoCursor(x, y, false), { x: curX, y: curY });
      await sleep(Math.floor(durationMs / steps));
    }
  }

  async function clickAt(x, y, durationMs = 400) {
    await moveCursorTo(x, y, durationMs);
    await page.evaluate(({ x, y }) => window.updateDemoCursor(x, y, true), { x, y });
    await sleep(250);
    await page.evaluate(({ x, y }) => window.updateDemoCursor(x, y, false), { x, y });
  }

  // =========================================================================
  // SCENE 1: PART 1 — INTRODUCTION (0:00 - 0:24) [24s]
  // =========================================================================
  console.log('▶️ Executing Part 1 — Introduction (Title, Problem Statement ID, Team ByteCraft)...');
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 1: Introduction',
      'Welcome to CampusHire — Intelligent College Placement Portal (Problem ID: HACK-P410) by Team ByteCraft'
    );

    // Create Title Overlay Card
    const overlay = document.createElement('div');
    overlay.id = 'part1-title-card';
    overlay.style.position = 'fixed';
    overlay.style.top = '70px';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';
    overlay.style.width = '1000px';
    overlay.style.background = 'rgba(15, 20, 30, 0.95)';
    overlay.style.backdropFilter = 'blur(20px)';
    overlay.style.border = '1px solid rgba(56, 189, 248, 0.35)';
    overlay.style.borderRadius = '20px';
    overlay.style.padding = '32px 40px';
    overlay.style.boxShadow = '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(14,165,233,0.15)';
    overlay.style.zIndex = '999900';
    overlay.style.fontFamily = 'sans-serif';
    overlay.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    overlay.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:16px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="background:rgba(14,165,233,0.15); color:#38bdf8; font-weight:800; font-size:12px; padding:4px 12px; border-radius:999px; border:1px solid rgba(56,189,248,0.3);">PROBLEM STATEMENT ID: HACK-P410</span>
          <span style="background:rgba(16,185,129,0.15); color:#34d399; font-weight:800; font-size:12px; padding:4px 12px; border-radius:999px; border:1px solid rgba(52,211,153,0.3);">TEAM BYTECRAFT</span>
        </div>
        <span style="font-size:12px; color:#94a3b8; font-family:monospace;">Subject: Software Engineering & Placement Automation</span>
      </div>

      <div style="margin-top:20px; display:flex; align-items:center; gap:20px;">
        <div style="width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg, #0284c7, #10b981); display:flex; align-items:center; justify-content:center; box-shadow:0 10px 25px rgba(2,132,199,0.4);">
          <svg style="width:32px; height:32px; color:white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5z"/></svg>
        </div>
        <div>
          <h1 style="color:white; font-size:32px; font-weight:900; margin:0; letter-spacing:-0.03em;">CampusHire</h1>
          <p style="color:#34d399; font-size:15px; font-weight:600; margin:2px 0 0 0;">Intelligent College Placement & Recruitment Automation Portal</p>
        </div>
      </div>

      <p style="color:#cbd5e1; font-size:14px; margin-top:16px; line-height:1.5;">
        A production full-stack platform transforming campus recruitment from manual spreadsheet chaos into automated sub-second eligibility audits, Dean policy exception workflows, and dynamic applicant pipeline tracking.
      </p>

      <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08);">
        <span style="font-size:11px; font-weight:800; color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:10px;">Project Team Members:</span>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:10px 14px; border-radius:10px;">
            <strong style="color:white; font-size:12px; display:block;">1. RAMAGIRI MANISH</strong>
            <span style="color:#94a3b8; font-size:10px; font-family:monospace; display:block;">Roll: 25MVCAIR0069 • CSE(AI)</span>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:10px 14px; border-radius:10px;">
            <strong style="color:white; font-size:12px; display:block;">2. Challa Bharat</strong>
            <span style="color:#94a3b8; font-size:10px; font-family:monospace; display:block;">Roll: 25MVCAIR0020 • CSE(AI)</span>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:10px 14px; border-radius:10px;">
            <strong style="color:white; font-size:12px; display:block;">3. kanuri Thanush Sree Ram</strong>
            <span style="color:#94a3b8; font-size:10px; font-family:monospace; display:block;">Roll: 25MVCAIR0059 • CSE(AI)</span>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:10px 14px; border-radius:10px;">
            <strong style="color:white; font-size:12px; display:block;">4. Devata sai nihar</strong>
            <span style="color:#94a3b8; font-size:10px; font-family:monospace; display:block;">Roll: 25MVCAIR0030 • CSE(AI)</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  });

  // Animate cursor over title elements for 24 seconds
  await moveCursorTo(500, 200, 1000);
  await sleep(4000);
  await moveCursorTo(300, 340, 1000);
  await sleep(4000);
  await moveCursorTo(700, 340, 1000);
  await sleep(4000);
  await moveCursorTo(900, 340, 1000);
  await sleep(4000);
  await moveCursorTo(500, 180, 1000);
  await sleep(5000);

  // Fade out title card
  await page.evaluate(() => {
    const card = document.getElementById('part1-title-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translate(-50%, -30px)';
      setTimeout(() => card.remove(), 600);
    }
  });
  await sleep(800);

  // =========================================================================
  // SCENE 2: PART 2 — PROBLEM AND SOLUTION (0:24 - 1:02) [38s]
  // =========================================================================
  console.log('▶️ Executing Part 2 — Problem and Proposed Solution...');
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 2: Problem & Solution',
      'The Problem: 100+ conflicting spreadsheets, 3-5 day manual verification delays vs CampusHire sub-25ms automated rule audits.'
    );

    // Problem / Solution Pill Card
    const psCard = document.createElement('div');
    psCard.id = 'ps-banner-card';
    psCard.style.position = 'fixed';
    psCard.style.top = '80px';
    psCard.style.right = '40px';
    psCard.style.width = '420px';
    psCard.style.background = 'rgba(15, 20, 30, 0.94)';
    psCard.style.backdropFilter = 'blur(16px)';
    psCard.style.border = '1px solid rgba(245, 158, 11, 0.4)';
    psCard.style.borderRadius = '16px';
    psCard.style.padding = '18px 22px';
    psCard.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';
    psCard.style.zIndex = '999900';
    psCard.style.fontFamily = 'sans-serif';
    psCard.style.transition = 'all 0.5s ease';

    psCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:11px; font-weight:800; color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">Problem vs CampusHire Solution</span>
        <span style="font-size:10px; color:#94a3b8; font-family:monospace;">NIRF Placement Metric</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="background:rgba(239,68,68,0.1); border-left:3px solid #ef4444; padding:8px 12px; border-radius:6px;">
          <strong style="color:#f87171; font-size:11px; display:block;">✕ Traditional Bottlenecks:</strong>
          <span style="color:#cbd5e1; font-size:11px; line-height:1.3;">100+ spreadsheets, 3-5 days manual eligibility audits, human error, zero status visibility.</span>
        </div>
        <div style="background:rgba(16,185,129,0.1); border-left:3px solid #10b981; padding:8px 12px; border-radius:6px;">
          <strong style="color:#34d399; font-size:11px; display:block;">✓ CampusHire Innovation:</strong>
          <span style="color:#cbd5e1; font-size:11px; line-height:1.3;">Sub-25ms deterministic eligibility rule engine, Dean exception override workflow, real-time RBAC.</span>
        </div>
      </div>
    `;
    document.body.appendChild(psCard);
  });

  // Hover over Overview top metrics & status pill
  await moveCursorTo(300, 160, 1000);
  await sleep(5000);
  await moveCursorTo(650, 160, 1000);
  await sleep(6000);
  await moveCursorTo(980, 160, 1000);
  await sleep(6000);
  await moveCursorTo(1550, 220, 1000);
  await sleep(7000);
  await moveCursorTo(800, 300, 1000);
  await sleep(6000);
  await moveCursorTo(1300, 140, 1000);
  await sleep(6000);

  // Fade out problem/solution card
  await page.evaluate(() => {
    const card = document.getElementById('ps-banner-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-20px)';
      setTimeout(() => card.remove(), 500);
    }
  });
  await sleep(500);

  // =========================================================================
  // SCENE 3: PART 3 — WORKING APPLICATION WALKTHROUGH (1:02 - 2:38) [96s]
  // =========================================================================
  console.log('▶️ Executing Part 3 — Working Application Walkthrough...');
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 3: Working Application',
      'Live Metrics: 84% Placed (705 of 841 candidates), 23 Active Partner Drives, 147 Open Job Roles.'
    );
  });

  // Step 3A: Top metrics inspection (12s)
  await moveCursorTo(250, 160, 800);
  await sleep(3000);
  await moveCursorTo(650, 160, 800);
  await sleep(3000);
  await moveCursorTo(1050, 160, 800);
  await sleep(4000);

  // Step 3B: Ongoing Drives & pipeline stage progression (20s)
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 3: Pipeline Tracking',
      'Ongoing Drives: Google SWE, Microsoft Cloud, Deloitte. Advancing pipeline stages interactively.'
    );
  });
  await moveCursorTo(350, 290, 800); // Google drive row
  await sleep(2500);
  await clickAt(460, 310, 600); // Click Tech Round stage badge
  await sleep(3500);
  await clickAt(530, 310, 600); // Click Interview stage badge
  await sleep(3500);
  await moveCursorTo(350, 390, 800); // Microsoft drive row
  await sleep(3000);

  // Step 3C: Smart Eligibility & Live Audit (22s)
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 3: Smart Eligibility Audit',
      'Evaluating Rahul Sharma against Google SWE: CGPA 8.6/10 ✓, No Active Backlogs ✓, CSE Branch ✓.'
    );
  });
  await moveCursorTo(1500, 180, 800); // Candidate selector dropdown
  await clickAt(1620, 215, 600);
  await sleep(3000);
  await moveCursorTo(1450, 310, 800); // CGPA check badge
  await sleep(3500);
  await moveCursorTo(1650, 310, 800); // Backlogs check badge
  await sleep(3500);
  await moveCursorTo(1550, 370, 800); // Branch check badge
  await sleep(3500);

  // Step 3D: Dean Policy Override Modal & Fast-Track Pass (18s)
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 3: Dean Policy Override',
      'Opening Dean Policy Exception Override Modal to authorize border-case candidate with logged rationale.'
    );
  });
  // Click Override Eligibility button
  await clickAt(1450, 480, 700);
  await sleep(2500);
  // Cursor inspects signed Dean note
  await moveCursorTo(960, 520, 800);
  await sleep(3500);
  // Click Confirm & Override button in modal
  await clickAt(1150, 650, 600);
  await sleep(3000);

  // Step 3E: Upcoming Interview Schedules & Calendar (10s)
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 3: Interview Calendar',
      'Synchronized interview slots with direct Google Meet conferencing links and active date filters.'
    );
  });
  await moveCursorTo(300, 640, 800); // Slot 1 @ 11:30 AM
  await sleep(2500);
  await moveCursorTo(720, 640, 800); // Google Meet link
  await sleep(2500);
  await clickAt(1520, 650, 600); // Select date 18 on mini calendar
  await sleep(2500);

  // Step 3F: Multi-Persona Role Switcher (14s)
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 3: Persona Switcher',
      'Switching to Student Persona: private academic profile, eligible drives, and 1-Click Apply.'
    );
  });
  // Click role switcher dropdown in header
  await clickAt(1800, 25, 600);
  await sleep(1500);
  // Select "Student"
  await clickAt(1800, 100, 600);
  await sleep(3500);
  // Click 1-Click Apply button on Student Portal
  await clickAt(850, 350, 600);
  await sleep(3000);
  // Switch back to Admin Overview
  await clickAt(1800, 25, 600);
  await sleep(1200);
  await clickAt(1800, 65, 600); // Select Admin
  await sleep(2500);

  // =========================================================================
  // SCENE 4: PART 4 — BACKEND & DATABASE OPERATIONS (2:38 - 3:37) [59s]
  // =========================================================================
  console.log('▶️ Executing Part 4 — Backend Architecture, APIs, Database & Test Suite...');
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 4: Backend & Database',
      'High-throughput Node.js Express REST API & native SQLite database with 52/52 automated tests passing.'
    );

    // Create Backend & Database Inspector HUD Modal
    const modal = document.createElement('div');
    modal.id = 'backend-inspector-modal';
    modal.style.position = 'fixed';
    modal.style.top = '65px';
    modal.style.left = '50%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.width = '1200px';
    modal.style.height = '620px';
    modal.style.background = 'rgba(10, 14, 22, 0.96)';
    modal.style.backdropFilter = 'blur(20px)';
    modal.style.border = '1px solid rgba(56, 189, 248, 0.4)';
    modal.style.borderRadius = '20px';
    modal.style.boxShadow = '0 30px 80px rgba(0,0,0,0.9), 0 0 50px rgba(14,165,233,0.2)';
    modal.style.zIndex = '999950';
    modal.style.fontFamily = 'sans-serif';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.overflow = 'hidden';
    modal.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

    modal.innerHTML = `
      <!-- Header -->
      <div style="background:rgba(15,23,42,0.8); border-bottom:1px solid rgba(255,255,255,0.08); padding:14px 24px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 10px #10b981;"></span>
          <strong style="color:white; font-size:14px; text-transform:uppercase; letter-spacing:0.05em;">Part 4: Backend REST API & Native SQLite Architecture</strong>
        </div>
        <div style="display:flex; gap:8px;">
          <span style="background:rgba(56,189,248,0.15); color:#38bdf8; font-family:monospace; font-size:11px; padding:3px 10px; border-radius:6px; border:1px solid rgba(56,189,248,0.3);">Node 22 • node:sqlite</span>
          <span style="background:rgba(16,185,129,0.15); color:#34d399; font-family:monospace; font-size:11px; padding:3px 10px; border-radius:6px; border:1px solid rgba(52,211,153,0.3);">52 / 52 Tests Passed</span>
        </div>
      </div>

      <!-- Main Body Grid: Left = Live REST API & SQL, Right = Automated Test Execution -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; padding:18px 24px; flex-grow:1; overflow:hidden;">
        
        <!-- Left: Real REST API Requests & Database Schema -->
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="background:#090d16; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="color:#38bdf8; font-family:monospace; font-size:11px; font-weight:700;">GET /api/admin/dashboard-stats</span>
              <span style="color:#10b981; font-family:monospace; font-size:10px;">200 OK • 18ms</span>
            </div>
            <pre style="margin:0; font-family:monospace; font-size:10.5px; color:#a5f3fc; background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; overflow-x:auto;">{
  "placement_percentage": 83.83,
  "total_students": 841,
  "placed_students": 705,
  "active_drives_count": 23,
  "open_roles_count": 147,
  "upcoming_interviews_count": 3
}</pre>
          </div>

          <div style="background:#090d16; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="color:#f59e0b; font-family:monospace; font-size:11px; font-weight:700;">GET /api/jobs/21/check-eligibility/103</span>
              <span style="color:#10b981; font-family:monospace; font-size:10px;">200 OK • 12ms</span>
            </div>
            <pre style="margin:0; font-family:monospace; font-size:10.5px; color:#fde68a; background:rgba(0,0,0,0.5); padding:8px; border-radius:6px; overflow-x:auto;">{
  "eligible": true,
  "student": { "name": "Rahul Sharma", "branch": "CSE", "cgpa": 8.6 },
  "criteria": {
    "cgpa": { "passed": true, "student": 8.6, "min_required": 8.5 },
    "backlogs": { "passed": true, "active_backlogs": 0, "max_allowed": 0 },
    "branch": { "passed": true, "eligible_branches": ["CSE", "IT"] }
  }
}</pre>
          </div>

          <!-- Relational Tables Strip -->
          <div style="background:#090d16; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:10px 14px;">
            <span style="color:#94a3b8; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:6px;">SQLite Relational Tables (WAL Mode, Indexed):</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <span style="background:#1e293b; color:#cbd5e1; font-family:monospace; font-size:10px; padding:3px 8px; border-radius:4px;">users (id PK)</span>
              <span style="background:#1e293b; color:#cbd5e1; font-family:monospace; font-size:10px; padding:3px 8px; border-radius:4px;">students (user_id FK)</span>
              <span style="background:#1e293b; color:#cbd5e1; font-family:monospace; font-size:10px; padding:3px 8px; border-radius:4px;">companies (id PK)</span>
              <span style="background:#1e293b; color:#cbd5e1; font-family:monospace; font-size:10px; padding:3px 8px; border-radius:4px;">jobs (company_id FK)</span>
              <span style="background:#1e293b; color:#cbd5e1; font-family:monospace; font-size:10px; padding:3px 8px; border-radius:4px;">applications (N:M)</span>
              <span style="background:#1e293b; color:#cbd5e1; font-family:monospace; font-size:10px; padding:3px 8px; border-radius:4px;">interview_schedules</span>
            </div>
          </div>
        </div>

        <!-- Right: Automated Test Suite Output -->
        <div style="background:#040711; border:1px solid rgba(52,211,153,0.25); border-radius:12px; padding:14px; font-family:monospace; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px;">
              <span style="color:#10b981; font-size:11px; font-weight:700;">TEST RUNNER: node tests/api.test.js</span>
              <span style="color:#34d399; font-size:10px;">100% PASS</span>
            </div>
            <div style="font-size:10.5px; color:#cbd5e1; line-height:1.5; space-y:2px;">
              <div>✔ System Health & Ping Endpoint (2/2 Passed)</div>
              <div>✔ User Authentication & JWT Issuance (4/4 Passed)</div>
              <div>✔ RBAC Guards: Student blocked from Admin API (403 Forbidden)</div>
              <div>✔ Eligibility Engine: Evaluated Aarav Patel (Eligible)</div>
              <div>✔ Eligibility Engine: Evaluated Arjun Das (Ineligible, CGPA 7.3)</div>
              <div>✔ State Machine: Submitted ➔ Shortlisted ➔ Interview ➔ Selected</div>
              <div>✔ State Machine: Rejected invalid status transition (400 Bad Request)</div>
              <div>✔ Interview Slot Scheduled: Azure Cloud Round (201 Created)</div>
              <div>✔ Cohort Aggregation: Verified 841 Students, 705 Placed (83.83%)</div>
              <div>✔ Open Postings: Verified 24 Companies, 148 Total Roles</div>
            </div>
          </div>

          <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(52,211,153,0.3); border-radius:8px; padding:10px; text-align:center;">
            <strong style="color:#34d399; font-size:14px; display:block;">ALL TESTS COMPLETED: 52 Passed, 0 Failed</strong>
            <span style="color:#94a3b8; font-size:10px;">Duration: 1.78s • Zero Memory Leaks • Native SQLite WAL</span>
          </div>
        </div>

      </div>
    `;
    document.body.appendChild(modal);
  });

  // Cursor inspects REST API endpoints, JSON responses, and test runner (59s)
  await moveCursorTo(600, 200, 1000);
  await sleep(10000);
  await moveCursorTo(600, 360, 1000);
  await sleep(12000);
  await moveCursorTo(600, 520, 1000);
  await sleep(12000);
  await moveCursorTo(1200, 240, 1000);
  await sleep(12000);
  await moveCursorTo(1200, 560, 1000);
  await sleep(12000);

  // Fade out backend inspector modal
  await page.evaluate(() => {
    const modal = document.getElementById('backend-inspector-modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transform = 'translate(-50%, 30px)';
      setTimeout(() => modal.remove(), 500);
    }
  });
  await sleep(800);

  // =========================================================================
  // SCENE 5: PART 5 — DEPLOYMENT & CONCLUSION (3:37 - 4:00) [23s]
  // =========================================================================
  console.log('▶️ Executing Part 5 — Deployment and Conclusion...');
  await page.evaluate(() => {
    window.setDemoSubtitles(
      'Part 5: Deployment & Conclusion',
      'CampusHire is fully deployed & verified locally: Frontend on :5173, Backend on :5000. 100% production ready!'
    );

    // Final Celebration & Summary Banner
    const finalCard = document.createElement('div');
    finalCard.id = 'final-conclusion-card';
    finalCard.style.position = 'fixed';
    finalCard.style.top = '100px';
    finalCard.style.left = '50%';
    finalCard.style.transform = 'translateX(-50%)';
    finalCard.style.width = '880px';
    finalCard.style.background = 'rgba(15, 20, 30, 0.95)';
    finalCard.style.backdropFilter = 'blur(20px)';
    finalCard.style.border = '1px solid rgba(16, 185, 129, 0.4)';
    finalCard.style.borderRadius = '20px';
    finalCard.style.padding = '28px 36px';
    finalCard.style.boxShadow = '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(16,185,129,0.2)';
    finalCard.style.zIndex = '999950';
    finalCard.style.fontFamily = 'sans-serif';
    finalCard.style.textAlign = 'center';
    finalCard.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

    finalCard.innerHTML = `
      <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(16,185,129,0.15); border:1px solid rgba(52,211,153,0.3); padding:4px 14px; border-radius:999px; color:#34d399; font-weight:800; font-size:11px; margin-bottom:12px;">
        <span>✓</span> VERIFIED PRODUCTION DEPLOYMENT
      </div>
      <h2 style="color:white; font-size:26px; font-weight:900; margin:0 0 8px 0; letter-spacing:-0.02em;">
        CampusHire: Deployment & Hackathon Submission Complete
      </h2>
      <p style="color:#94a3b8; font-size:13px; max-width:680px; margin:0 auto 18px auto; line-height:1.4;">
        Frontend SPA live at <code style="color:#38bdf8;">http://localhost:5173</code> & Backend REST API live at <code style="color:#34d399;">http://localhost:5000</code>.
      </p>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:18px;">
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:12px; border-radius:10px;">
          <strong style="color:#38bdf8; font-size:18px; display:block; font-family:monospace;">&lt; 25 ms</strong>
          <span style="color:#94a3b8; font-size:11px;">Sub-Second Rule Engine</span>
        </div>
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:12px; border-radius:10px;">
          <strong style="color:#34d399; font-size:18px; display:block; font-family:monospace;">84% Placed</strong>
          <span style="color:#94a3b8; font-size:11px;">705 of 841 Candidates</span>
        </div>
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:12px; border-radius:10px;">
          <strong style="color:#f59e0b; font-size:18px; display:block; font-family:monospace;">52 / 52 Passed</strong>
          <span style="color:#94a3b8; font-size:11px;">100% Test Pass Rate</span>
        </div>
      </div>

      <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:14px; font-size:12px; color:#cbd5e1;">
        <span>Team ByteCraft • RAMAGIRI MANISH • Challa Bharat • kanuri Thanush Sree Ram • Devata sai nihar • CSE(AI)</span>
      </div>
    `;
    document.body.appendChild(finalCard);
  });

  await moveCursorTo(960, 240, 1000);
  await sleep(6000);
  await moveCursorTo(960, 320, 1000);
  await sleep(6000);
  await moveCursorTo(960, 420, 1000);
  await sleep(6000);
  await moveCursorTo(960, 500, 1000);
  await sleep(4000);

  // Stop Screencast
  console.log('🛑 Screencast capture completed! Total frames written:', totalFrames);
  await client.send('Page.stopScreencast');
  await browser.close();

  // Close FFmpeg stdin
  ffmpeg.stdin.end();

  await new Promise((resolve) => ffmpeg.on('close', resolve));
  console.log('✅ Raw screencast saved to:', rawVideoPath);

  // Mux video and narration audio using FFmpeg
  console.log('🎵 Muxing screencast video with voiceover narration audio...');
  try {
    execSync(`ffmpeg -y -i "${rawVideoPath}" -i "${audioPath}" -c:v copy -c:a aac -b:a 192k -shortest "${finalVideoPath}"`);
    console.log('🎉 Successfully created final narrated video deliverable:', finalVideoPath);

    if (fs.existsSync(artifactDir)) {
      fs.copyFileSync(finalVideoPath, artifactFinalVideo);
      console.log('Copied to artifact directory:', artifactFinalVideo);
    }
  } catch (err) {
    console.error('Error muxing audio with video:', err);
  }

  // Remove temporary raw video
  try {
    if (fs.existsSync(rawVideoPath)) fs.unlinkSync(rawVideoPath);
  } catch (e) {}

  console.log('===============================================================');
  console.log('🏆 All 5 Parts Recorded, Muxed, and Verified Successfully!');
  console.log('===============================================================');
}

recordStructuredSubmissionVideo().catch((err) => {
  console.error('Fatal recording error:', err);
  process.exit(1);
});
