const http = require('http');
const app = require('../src/app');
const { initDatabase } = require('../src/config/database');
const { seed } = require('../src/scripts/seed');

let server;
let baseUrl;

let adminToken;
let recruiterToken;
let studentTokenEligible;
let studentTokenIneligible;
let studentEligibleId;
let studentIneligibleId;
let googleJobId;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token && { Authorization: `Bearer ${options.token}` }),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = { raw: text };
  }

  return {
    status: response.status,
    ok: response.ok,
    body: json
  };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    failed++;
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    passed++;
    console.log(`  ✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' Starting CampusHire Backend API End-to-End Tests');
  console.log('======================================================\n');

  // 1. Seed database and start local test server
  await seed();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    // ----------------------------------------------------
    // TEST SUITE 1: System Health & Info
    // ----------------------------------------------------
    console.log('\n--- 1. System Health & Welcome Endpoint ---');
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200, 'Health endpoint returns 200');
    assert(healthRes.body.status === 'healthy', 'Health status is healthy');

    // ----------------------------------------------------
    // TEST SUITE 2: Authentication & RBAC
    // ----------------------------------------------------
    console.log('\n--- 2. Authentication & Authorization (RBAC) ---');
    
    // Login Admin
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@campushire.edu', password: 'Admin@123' }
    });
    assert(adminLoginRes.status === 200, 'Admin login succeeds');
    assert(adminLoginRes.body.data.token, 'Admin receives JWT token');
    adminToken = adminLoginRes.body.data.token;

    // Login Recruiter
    const recLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'recruiter.google@campushire.edu', password: 'Recruiter@123' }
    });
    assert(recLoginRes.status === 200, 'Recruiter login succeeds');
    recruiterToken = recLoginRes.body.data.token;

    // Login Eligible Student (Aarav Patel: CSE, 9.6 CGPA, 0 backlogs)
    const studEligibleRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'aarav.patel@campushire.edu', password: 'Student@123' }
    });
    assert(studEligibleRes.status === 200, 'Eligible student login succeeds');
    studentTokenEligible = studEligibleRes.body.data.token;
    studentEligibleId = studEligibleRes.body.data.user.id;

    // Login Ineligible Student (Arjun Das: MECH, 7.3 CGPA, 0 backlogs)
    const studIneligibleRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'arjun.das@campushire.edu', password: 'Student@123' }
    });
    assert(studIneligibleRes.status === 200, 'Ineligible student login succeeds');
    studentTokenIneligible = studIneligibleRes.body.data.token;
    studentIneligibleId = studIneligibleRes.body.data.user.id;

    // Register a new Student
    const newStudentRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Tanya Sen',
        email: 'tanya.sen@campushire.edu',
        password: 'Password@123',
        role: 'student',
        profile: {
          branch: 'CSE',
          cgpa: 8.7,
          backlogs_count: 0,
          course: 'B.Tech',
          graduation_year: 2026,
          skills: ['Python', 'Django']
        }
      }
    });
    assert(newStudentRes.status === 201, 'New student registration succeeds with 201');
    assert(newStudentRes.body.data.user.email === 'tanya.sen@campushire.edu', 'Registered email matches');

    // Reject registration with duplicate email
    const dupRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Tanya Sen Duplicate',
        email: 'tanya.sen@campushire.edu',
        password: 'Password@123',
        role: 'student'
      }
    });
    assert(dupRes.status === 409, 'Duplicate user registration rejected with 409 Conflict');

    // Test Role-Based Protection: Student accessing admin endpoint
    const forbiddenAdminRes = await request('/api/admin/dashboard-stats', {
      token: studentTokenEligible
    });
    assert(forbiddenAdminRes.status === 403, 'Student blocked from admin dashboard with 403 Forbidden');

    // ----------------------------------------------------
    // TEST SUITE 3: Automated Eligibility Checker Engine
    // ----------------------------------------------------
    console.log('\n--- 3. Automated Eligibility Checker Engine ---');

    // Fetch jobs to find Google SDE job ID (requires: min_cgpa: 8.5, branches: ["CSE","IT"], max_backlogs: 0)
    const jobsListRes = await request('/api/jobs', { token: adminToken });
    assert(jobsListRes.status === 200, 'Jobs list fetched successfully');
    const googleJob = jobsListRes.body.data.find(j => j.company_name === 'Google LLC' && j.role_title.includes('SDE-1'));
    assert(Boolean(googleJob), 'Found Google SDE-1 job');
    googleJobId = googleJob.id;

    // Check Eligibility: Eligible Student (Aarav: CSE, 9.6 CGPA, 0 backlogs)
    const checkEligibleRes = await request(`/api/jobs/${googleJobId}/check-eligibility/${studentEligibleId}`, {
      method: 'POST',
      token: adminToken
    });
    assert(checkEligibleRes.status === 200, 'Check eligibility endpoint returns 200');
    assert(checkEligibleRes.body.data.is_eligible === true, 'Aarav is marked ELIGIBLE');
    assert(checkEligibleRes.body.data.audit_breakdown.cgpa.passed === true, 'CGPA check passed');
    assert(checkEligibleRes.body.data.audit_breakdown.branch.passed === true, 'Branch check passed');
    assert(checkEligibleRes.body.data.audit_breakdown.backlogs.passed === true, 'Backlogs check passed');

    // Check Eligibility: Ineligible Student (Arjun: MECH, 7.3 CGPA, 0 backlogs)
    const checkIneligibleRes = await request(`/api/jobs/${googleJobId}/check-eligibility/${studentIneligibleId}`, {
      method: 'POST',
      token: adminToken
    });
    assert(checkIneligibleRes.status === 200, 'Check eligibility endpoint returns 200');
    assert(checkIneligibleRes.body.data.is_eligible === false, 'Arjun is marked INELIGIBLE');
    assert(checkIneligibleRes.body.data.audit_breakdown.cgpa.passed === false, 'CGPA check failed correctly (7.3 < 8.5)');
    assert(checkIneligibleRes.body.data.audit_breakdown.branch.passed === false, 'Branch check failed correctly (MECH not in CSE, IT)');
    assert(checkIneligibleRes.body.data.failed_criteria.length === 2, 'Failed criteria list contains exactly 2 failures');

    // Student self-checking eligibility
    const selfCheckRes = await request(`/api/jobs/${googleJobId}/check-eligibility`, {
      method: 'POST',
      token: studentTokenIneligible
    });
    assert(selfCheckRes.status === 200, 'Student self-check returns 200');
    assert(selfCheckRes.body.data.is_eligible === false, 'Student self-check reports ineligible');

    // Student attempting to check someone else's eligibility should fail with 403
    const foreignCheckRes = await request(`/api/jobs/${googleJobId}/check-eligibility/${studentEligibleId}`, {
      method: 'POST',
      token: studentTokenIneligible
    });
    assert(foreignCheckRes.status === 403, 'Student blocked from querying other students eligibility');

    // ----------------------------------------------------
    // TEST SUITE 4: Application Lifecycle & Workflow Transitions
    // ----------------------------------------------------
    console.log('\n--- 4. Application Lifecycle & Workflow Transitions ---');

    // Ineligible student applying for Google SDE should be rejected by automated eligibility engine
    const ineligibleApplyRes = await request('/api/applications', {
      method: 'POST',
      token: studentTokenIneligible,
      body: { job_id: googleJobId }
    });
    assert(ineligibleApplyRes.status === 400, 'Ineligible student application rejected with 400 Bad Request');
    assert(ineligibleApplyRes.body.eligibility !== undefined, 'Rejection response contains explicit eligibility audit');

    // Eligible student applying for TCS Digital Consultant (Job 4)
    const tcsJob = jobsListRes.body.data.find(j => j.company_name.includes('TCS'));
    const validApplyRes = await request('/api/applications', {
      method: 'POST',
      token: studentTokenEligible,
      body: { job_id: tcsJob.id }
    });
    assert(validApplyRes.status === 201, 'Eligible student applies successfully with 201 Created');
    assert(validApplyRes.body.data.status === 'submitted', 'New application initial status is "submitted"');
    const newAppId = validApplyRes.body.data.id;

    // Prevent duplicate application
    const duplicateApplyRes = await request('/api/applications', {
      method: 'POST',
      token: studentTokenEligible,
      body: { job_id: tcsJob.id }
    });
    assert(duplicateApplyRes.status === 409, 'Duplicate application rejected with 409 Conflict');

    // Recruiter transitions application status: submitted -> shortlisted
    const transitionShortlistRes = await request(`/api/applications/${newAppId}/status`, {
      method: 'PATCH',
      token: recruiterToken,
      body: { status: 'shortlisted' }
    });
    assert(transitionShortlistRes.status === 200, 'Status updated to shortlisted');
    assert(transitionShortlistRes.body.data.status === 'shortlisted', 'Application state reflects shortlisted');

    // Recruiter transitions application status: shortlisted -> interview
    const transitionInterviewRes = await request(`/api/applications/${newAppId}/status`, {
      method: 'PATCH',
      token: recruiterToken,
      body: { status: 'interview' }
    });
    assert(transitionInterviewRes.status === 200, 'Status updated to interview');

    // Test Invalid State Transition (e.g., trying to jump from interview directly to submitted)
    const invalidTransitionRes = await request(`/api/applications/${newAppId}/status`, {
      method: 'PATCH',
      token: recruiterToken,
      body: { status: 'submitted' }
    });
    assert(invalidTransitionRes.status === 400, 'Invalid transition rejected with 400');

    // Recruiter transitions to selected (final stage)
    const transitionSelectedRes = await request(`/api/applications/${newAppId}/status`, {
      method: 'PATCH',
      token: recruiterToken,
      body: { status: 'selected' }
    });
    assert(transitionSelectedRes.status === 200, 'Status transitioned to selected');

    // Student withdraw workflow test
    // Use student 6 (Aditya Verma) who applied for Microsoft Azure
    const msftJob = jobsListRes.body.data.find(j => j.company_name.includes('Microsoft'));
    const adityaLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'aditya.verma@campushire.edu', password: 'Student@123' }
    });
    const adityaToken = adityaLoginRes.body.data.token;
    const adityaApps = await request('/api/applications', { token: adityaToken });
    assert(adityaApps.body.data.length > 0, 'Aditya has submitted applications');
    const adityaAppId = adityaApps.body.data[0].id;

    const withdrawRes = await request(`/api/applications/${adityaAppId}/withdraw`, {
      method: 'POST',
      token: adityaToken
    });
    assert(withdrawRes.status === 200, 'Student withdrew their application successfully');
    assert(withdrawRes.body.data.status === 'withdrawn', 'Application status reflects "withdrawn"');

    // ----------------------------------------------------
    // TEST SUITE 5: Interview Scheduling
    // ----------------------------------------------------
    console.log('\n--- 5. Interview Scheduling ---');

    // Schedule an interview round for student 3 (Rohan Iyer) for Microsoft Azure
    const rohanUser = (await request('/api/students', { token: adminToken })).body.data.find(s => s.name === 'Rohan Iyer');
    
    const scheduleRes = await request('/api/interviews', {
      method: 'POST',
      token: recruiterToken,
      body: {
        job_id: msftJob.id,
        student_id: rohanUser.id,
        interviewer_name: 'Satya N. (Lead Principal Architect)',
        interview_time: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        round_name: 'Azure Cloud Architecture & Concurrency Round',
        notes: 'Prepare system design scenarios.'
      }
    });
    console.log('DEBUG scheduleRes:', scheduleRes.status, JSON.stringify(scheduleRes.body));
    assert(scheduleRes.status === 201, 'Interview round scheduled with 201');
    assert(scheduleRes.body.data.round_name.includes('Azure Cloud'), 'Round name persisted correctly');
    const interviewId = scheduleRes.body.data.id;

    // Update interview status to completed
    const updateInterviewRes = await request(`/api/interviews/${interviewId}`, {
      method: 'PATCH',
      token: recruiterToken,
      body: {
        status: 'completed',
        notes: 'Candidate passed round with strong distributed systems knowledge.'
      }
    });
    assert(updateInterviewRes.status === 200, 'Interview status updated to completed');
    assert(updateInterviewRes.body.data.status === 'completed', 'Interview reflects completed status');

    // ----------------------------------------------------
    // TEST SUITE 6: Dashboard & Reporting Analytics
    // ----------------------------------------------------
    console.log('\n--- 6. Dashboard & Reporting Analytics ---');

    const dashboardRes = await request('/api/admin/dashboard-stats', {
      token: adminToken
    });
    assert(dashboardRes.status === 200, 'Dashboard stats endpoint returns 200');
    const metrics = dashboardRes.body.data.metrics;
    console.log('  📊 Dashboard Metrics:', JSON.stringify(metrics, null, 2));

    assert(metrics.total_students >= 20, 'Metrics report 20+ total registered students');
    assert(metrics.placement_percentage > 0, 'Placement percentage is greater than 0%');
    assert(metrics.active_drives_count >= 3, 'Active drives count matches >= 3 companies');
    assert(metrics.open_roles_count >= 4, 'Open roles count matches >= 4 active unexpired postings');

    const appVol = dashboardRes.body.data.application_volume;
    console.log('  📈 Application Volume:', JSON.stringify(appVol, null, 2));
    assert(appVol.total >= 14, 'Total applications volume counted accurately');
    assert(appVol.selected >= 2, 'Selected applications counted accurately');
    assert(appVol.shortlisted >= 1, 'Shortlisted applications counted accurately');

    const branchBreakdown = dashboardRes.body.data.branch_breakdown;
    assert(Array.isArray(branchBreakdown) && branchBreakdown.length > 0, 'Branch breakdown data present');
    console.log(`  🏢 Branch stats available for ${branchBreakdown.length} academic branches.`);

    console.log('\n======================================================');
    console.log(` ALL TESTS COMPLETED: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});

