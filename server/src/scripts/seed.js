const { db, initDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('--- Initializing CampusHire Database for Seeding ---');
  await initDatabase();

  // Clear existing data cleanly in reverse order of foreign key dependency
  await db.exec(`
    DELETE FROM interview_schedules;
    DELETE FROM applications;
    DELETE FROM jobs;
    DELETE FROM companies;
    DELETE FROM student_profiles;
    DELETE FROM users;
  `);

  console.log('Cleared existing records.');

  // Pre-compute common password hashes for seeding efficiency
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const recruiterPasswordHash = await bcrypt.hash('Recruiter@123', salt);
  const studentPasswordHash = await bcrypt.hash('Student@123', salt);

  // 1. Seed Admin User
  const adminResult = await db.run(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    ['Campus Placement Admin', 'admin@campushire.edu', adminPasswordHash, 'admin']
  );
  console.log(`Created Admin user: admin@campushire.edu (ID: ${adminResult.lastID})`);

  // 2. Seed Recruiter Users
  const recruitersData = [
    { name: 'Sarah Jenkins (Google)', email: 'recruiter.google@campushire.edu' },
    { name: 'David Miller (Microsoft)', email: 'recruiter.msft@campushire.edu' },
    { name: 'Priya Sharma (Amazon)', email: 'recruiter.amazon@campushire.edu' }
  ];

  for (const rec of recruitersData) {
    await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'recruiter')`,
      [rec.name, rec.email, recruiterPasswordHash]
    );
  }
  console.log(`Created ${recruitersData.length} recruiter accounts.`);

  // 3. Seed Companies
  const companies = [
    { name: 'Deloitte', industry: 'Strategy, Risk & Financial Advisory', website: 'https://deloitte.com/careers', location: 'Hyderabad / Bangalore, India' },
    {
      name: 'Google LLC',
      industry: 'Information Technology & Cloud',
      website: 'https://careers.google.com',
      location: 'Mountain View, CA / Bangalore, India'
    },
    {
      name: 'Microsoft Corporation',
      industry: 'Software & Enterprise Cloud',
      website: 'https://careers.microsoft.com',
      location: 'Redmond, WA / Hyderabad, India'
    },
    {
      name: 'Amazon Web Services',
      industry: 'E-commerce & Distributed Systems',
      website: 'https://amazon.jobs',
      location: 'Seattle, WA / Bangalore, India'
    },
    {
      name: 'Tata Consultancy Services (TCS)',
      industry: 'IT Consulting & Digital Services',
      website: 'https://www.tcs.com/careers',
      location: 'Mumbai, India / Global'
    }
  ];

  const companyIds = {};
  for (const comp of companies) {
    const res = await db.run(
      `INSERT INTO companies (name, industry, website, location) VALUES (?, ?, ?, ?)`,
      [comp.name, comp.industry, comp.website, comp.location]
    );
    companyIds[comp.name] = res.lastID;
  }
  console.log(`Created ${companies.length} companies.`);

  // 4. Seed Job Postings
  // Set future deadline: 30 days from now
  const futureDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  // Set an expired deadline for testing deadline eligibility failure
  const pastDeadline = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

  const jobsData = [
    {
      company_id: companyIds['Google LLC'],
      role_title: 'Software Development Engineer I (SDE-1)',
      description: 'Design and build large-scale distributed systems, search algorithms, and high-throughput microservices.',
      location: 'Bangalore, India',
      package_range: '₹28 - ₹36 LPA',
      deadline: futureDeadline,
      min_cgpa: 8.5,
      allowed_branches: JSON.stringify(['CSE', 'IT']),
      max_backlogs: 0,
      is_active: 1
    },
    {
      company_id: companyIds['Microsoft Corporation'],
      role_title: 'Cloud Software Engineer (Azure)',
      description: 'Develop resilient cloud infrastructure, hyper-scale APIs, and enterprise security platforms.',
      location: 'Hyderabad, India',
      package_range: '₹22 - ₹28 LPA',
      deadline: futureDeadline,
      min_cgpa: 8.0,
      allowed_branches: JSON.stringify(['CSE', 'IT', 'ECE']),
      max_backlogs: 0,
      is_active: 1
    },
    {
      company_id: companyIds['Amazon Web Services'],
      role_title: 'Systems Development Engineer',
      description: 'Build backend pipelines, automation frameworks, and distributed containerized cloud platforms.',
      location: 'Bangalore, India',
      package_range: '₹18 - ₹24 LPA',
      deadline: futureDeadline,
      min_cgpa: 7.0,
      allowed_branches: JSON.stringify(['CSE', 'IT', 'ECE', 'EEE']),
      max_backlogs: 1,
      is_active: 1
    },
    {
      company_id: companyIds['Tata Consultancy Services (TCS)'],
      role_title: 'Digital Technology Consultant',
      description: 'Consulting on AI transformation, full-stack enterprise web platforms, and mobile development.',
      location: 'Pune / Chennai, India',
      package_range: '₹7.5 - ₹10 LPA',
      deadline: futureDeadline,
      min_cgpa: 6.0,
      allowed_branches: JSON.stringify(['ALL']),
      max_backlogs: 2,
      is_active: 1
    },
    {
      company_id: companyIds['Google LLC'],
      role_title: 'Summer Tech Specialist (Past Drive)',
      description: 'Closed archival drive for testing eligibility deadline rules.',
      location: 'Bangalore, India',
      package_range: '₹15 - ₹20 LPA',
      deadline: pastDeadline,
      min_cgpa: 7.5,
      allowed_branches: JSON.stringify(['CSE']),
      max_backlogs: 0,
      is_active: 0
    }
  ];

  const jobIds = [];
  for (const job of jobsData) {
    const res = await db.run(
      `INSERT INTO jobs (company_id, role_title, description, location, package_range, deadline, min_cgpa, allowed_branches, max_backlogs, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [job.company_id, job.role_title, job.description, job.location, job.package_range, job.deadline, job.min_cgpa, job.allowed_branches, job.max_backlogs, job.is_active]
    );
    jobIds.push(res.lastID);
  }
  console.log(`Created ${jobsData.length} job postings.`);

  // 5. Seed 20 Synthetic Student Profiles with Varied CGPA, Branches, and Backlogs
  const studentSeeds = [
    { name: 'Rahul Sharma', email: 'rahul.sharma@campushire.edu', branch: 'CSE', cgpa: 8.6, backlogs: 0, skills: ['React', 'TypeScript', 'Node.js', 'System Design'], course: 'B.Tech' },
    { name: 'Aarav Patel', email: 'aarav.patel@campushire.edu', branch: 'CSE', cgpa: 9.6, backlogs: 0, skills: ['Go', 'Kubernetes', 'Distributed Systems', 'Python'], course: 'B.Tech' },
    { name: 'Diya Sen', email: 'diya.sen@campushire.edu', branch: 'CSE', cgpa: 9.1, backlogs: 0, skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'], course: 'B.Tech' },
    { name: 'Rohan Iyer', email: 'rohan.iyer@campushire.edu', branch: 'IT', cgpa: 8.8, backlogs: 0, skills: ['Java', 'Spring Boot', 'AWS', 'Docker'], course: 'B.Tech' },
    { name: 'Ananya Roy', email: 'ananya.roy@campushire.edu', branch: 'ECE', cgpa: 8.6, backlogs: 0, skills: ['C++', 'Embedded Systems', 'IoT', 'Python'], course: 'B.Tech' },
    { name: 'Kavya Nair', email: 'kavya.nair@campushire.edu', branch: 'CSE', cgpa: 8.2, backlogs: 0, skills: ['Python', 'FastAPI', 'Machine Learning', 'PyTorch'], course: 'B.Tech' },
    { name: 'Aditya Verma', email: 'aditya.verma@campushire.edu', branch: 'IT', cgpa: 8.1, backlogs: 0, skills: ['React Native', 'Node.js', 'MongoDB', 'GraphQL'], course: 'B.Tech' },
    { name: 'Neha Kulkarni', email: 'neha.kulkarni@campushire.edu', branch: 'ECE', cgpa: 7.9, backlogs: 0, skills: ['VLSI', 'Verilog', 'C++', 'MATLAB'], course: 'B.Tech' },
    { name: 'Vikram Joshi', email: 'vikram.joshi@campushire.edu', branch: 'EEE', cgpa: 7.6, backlogs: 0, skills: ['Power Systems', 'PLC', 'Python', 'AutoCAD'], course: 'B.Tech' },
    { name: 'Sanya Gupta', email: 'sanya.gupta@campushire.edu', branch: 'CSE', cgpa: 7.4, backlogs: 1, skills: ['JavaScript', 'HTML5', 'CSS3', 'MySQL'], course: 'B.Tech' },
    { name: 'Arjun Das', email: 'arjun.das@campushire.edu', branch: 'MECH', cgpa: 7.3, backlogs: 0, skills: ['SolidWorks', 'ANSYS', 'Python Data Science'], course: 'B.Tech' },
    { name: 'Ishita Sharma', email: 'ishita.sharma@campushire.edu', branch: 'ECE', cgpa: 7.1, backlogs: 1, skills: ['Signals & Systems', 'C', 'Python', 'Arduino'], course: 'B.Tech' },
    { name: 'Manish Pandey', email: 'manish.pandey@campushire.edu', branch: 'IT', cgpa: 6.9, backlogs: 0, skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript'], course: 'B.Tech' },
    { name: 'Pooja Reddy', email: 'pooja.reddy@campushire.edu', branch: 'CIVIL', cgpa: 6.8, backlogs: 0, skills: ['Revit', 'ETABS', 'AutoCAD', 'Surveying'], course: 'B.Tech' },
    { name: 'Gaurav Mehta', email: 'gaurav.mehta@campushire.edu', branch: 'EEE', cgpa: 6.5, backlogs: 1, skills: ['Circuit Design', 'Microcontrollers', 'C'], course: 'B.Tech' },
    { name: 'Bhavna Chauhan', email: 'bhavna.chauhan@campushire.edu', branch: 'CSE', cgpa: 6.4, backlogs: 2, skills: ['Java', 'SQL', 'Git', 'Linux'], course: 'B.Tech' },
    { name: 'Rahul Singhania', email: 'rahul.singhania@campushire.edu', branch: 'MECH', cgpa: 6.2, backlogs: 1, skills: ['Thermodynamics', 'AutoCAD', 'Excel Analysis'], course: 'B.Tech' },
    { name: 'Tanvi Agarwal', email: 'tanvi.agarwal@campushire.edu', branch: 'IT', cgpa: 6.0, backlogs: 0, skills: ['Quality Assurance', 'Selenium', 'Java', 'Jira'], course: 'B.Tech' },
    { name: 'Kunal Deshmukh', email: 'kunal.deshmukh@campushire.edu', branch: 'CIVIL', cgpa: 5.9, backlogs: 2, skills: ['Civil Drafting', 'Structural Estimations'], course: 'B.Tech' },
    { name: 'Meera Nambiar', email: 'meera.nambiar@campushire.edu', branch: 'EEE', cgpa: 5.8, backlogs: 3, skills: ['Basic Electronics', 'C Programming'], course: 'B.Tech' },
    { name: 'Siddharth Rao', email: 'siddharth.rao@campushire.edu', branch: 'CSE', cgpa: 8.9, backlogs: 0, skills: ['Fullstack MERN', 'DevOps', 'Next.js', 'PostgreSQL'], course: 'B.Tech' }
  ];

  const studentUserIds = [];

  for (const s of studentSeeds) {
    const userRes = await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student')`,
      [s.name, s.email, studentPasswordHash]
    );

    const sId = userRes.lastID;
    studentUserIds.push(sId);

    await db.run(
      `INSERT INTO student_profiles (student_id, course, graduation_year, cgpa, backlogs_count, branch, skills, resume_url)
       VALUES (?, ?, 2026, ?, ?, ?, ?, ?)`,
      [sId, s.course, s.cgpa, s.backlogs, s.branch, JSON.stringify(s.skills), `https://campushire.storage/resumes/${sId}_resume.pdf`]
    );
  }
  console.log(`Created ${studentSeeds.length} synthetic student accounts & profiles.`);

  // 6. Seed Sample Applications across various lifecycle stages
  // Job 1 (Google SDE): Aarav (selected), Diya (interview), Siddharth (shortlisted)
  // Job 2 (Microsoft Azure): Diya (selected), Rohan (interview), Ananya (shortlisted), Aditya (submitted)
  // Job 3 (Amazon Systems): Kavya (shortlisted), Neha (interview), Vikram (submitted), Arjun (rejected)
  // Job 4 (TCS Digital): Bhavna (submitted), Tanvi (shortlisted), Rahul (withdrawn)

  const sampleApps = [
    { student_id: studentUserIds[0], job_id: jobIds[0], status: 'selected' },    // Aarav -> Google
    { student_id: studentUserIds[1], job_id: jobIds[0], status: 'interview' },   // Diya -> Google
    { student_id: studentUserIds[19], job_id: jobIds[0], status: 'shortlisted' }, // Siddharth -> Google
    
    { student_id: studentUserIds[1], job_id: jobIds[1], status: 'selected' },    // Diya -> Microsoft
    { student_id: studentUserIds[2], job_id: jobIds[1], status: 'interview' },   // Rohan -> Microsoft
    { student_id: studentUserIds[3], job_id: jobIds[1], status: 'shortlisted' }, // Ananya -> Microsoft
    { student_id: studentUserIds[5], job_id: jobIds[1], status: 'submitted' },   // Aditya -> Microsoft

    { student_id: studentUserIds[4], job_id: jobIds[2], status: 'shortlisted' }, // Kavya -> Amazon
    { student_id: studentUserIds[6], job_id: jobIds[2], status: 'interview' },   // Neha -> Amazon
    { student_id: studentUserIds[7], job_id: jobIds[2], status: 'submitted' },   // Vikram -> Amazon
    { student_id: studentUserIds[9], job_id: jobIds[2], status: 'rejected' },    // Arjun -> Amazon

    { student_id: studentUserIds[14], job_id: jobIds[3], status: 'submitted' },  // Bhavna -> TCS
    { student_id: studentUserIds[16], job_id: jobIds[3], status: 'shortlisted' },// Tanvi -> TCS
    { student_id: studentUserIds[15], job_id: jobIds[3], status: 'withdrawn' }   // Rahul -> TCS
  ];

  for (const app of sampleApps) {
    await db.run(
      `INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, ?)`,
      [app.student_id, app.job_id, app.status]
    );
  }
  console.log(`Created ${sampleApps.length} sample applications across workflow states.`);

  // 7. Seed Sample Interview Schedules
  const sampleInterviews = [
    {
      job_id: jobIds[0],
      student_id: studentUserIds[1], // Diya
      interviewer_name: 'Dr. Alan Turing (Google Eng Lead)',
      interview_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      round_name: 'Data Structures & Algorithms Round',
      notes: 'Focus on graphs, dynamic programming, and concurrency.'
    },
    {
      job_id: jobIds[1],
      student_id: studentUserIds[2], // Rohan
      interviewer_name: 'Satya N. (Microsoft Cloud Architect)',
      interview_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      round_name: 'System Design & Azure Architecture',
      notes: 'Evaluate distributed caching and microservice patterns.'
    },
    {
      job_id: jobIds[2],
      student_id: studentUserIds[6], // Neha
      interviewer_name: 'Priya Sharma (Amazon SDE-3)',
      interview_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      round_name: 'Technical Round 1 (Linux & Systems)',
      notes: 'Review IPC, kernel basics, and scripting proficiency.'
    }
  ];

  for (const iv of sampleInterviews) {
    await db.run(
      `INSERT INTO interview_schedules (job_id, student_id, interviewer_name, interview_time, round_name, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
      [iv.job_id, iv.student_id, iv.interviewer_name, iv.interview_time, iv.round_name, iv.notes]
    );
  }
  console.log(`Created ${sampleInterviews.length} sample interview schedules.`);

  // 8. Scale to Match Campus Placement Cohort (840 candidates, 705 placed = 84%, 24 active drives, 148 open roles)
  console.log('Scaling dataset to campus cohort (840 students, 705 placed, 24 active drives, 148 open roles)...');
  
  const additionalCompanies = [
    'Meta Platforms', 'Apple Inc', 'Netflix', 'Uber Technologies', 'Goldman Sachs',
    'JPMorgan Chase', 'Cisco Systems', 'Adobe Systems', 'Oracle Corporation', 'Salesforce',
    'Intel Corporation', 'Qualcomm', 'IBM Global', 'McKinsey & Company', 'Boston Consulting Group',
    'Bain & Company', 'Morgan Stanley', 'Palantir Technologies', 'Stripe'
  ];

  const newCompanyIds = [];
  for (const compName of additionalCompanies) {
    const res = await db.run(
      "INSERT INTO companies (name, industry, website, location) VALUES (?, 'Technology & Advisory', 'https://careers.com', 'Bangalore / Global')",
      [compName]
    );
    newCompanyIds.push(res.lastID);
  }

  // Create additional open jobs up to 148 total active postings
  const currentJobsCount = jobIds.length;
  const targetJobs = 148;
  const branchesList = ['["CSE","IT"]', '["CSE","IT","ECE"]', '["ALL"]', '["CSE"]'];
  
  for (let j = currentJobsCount; j < targetJobs; j++) {
    const cId = newCompanyIds[(j - currentJobsCount) % newCompanyIds.length];
    const res = await db.run(
      "INSERT INTO jobs (company_id, role_title, description, location, package_range, deadline, min_cgpa, allowed_branches, max_backlogs, is_active) VALUES (?, ?, 'Full-stack engineering & operations', 'Hybrid / Bangalore', '₹18 - ₹26 LPA', ?, 7.0, ?, 0, 1)",
      [cId, 'Engineering Associate #' + (j + 1), futureDeadline, branchesList[j % branchesList.length]]
    );
    jobIds.push(res.lastID);
  }

  // Insert additional synthetic students up to 840 total students
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  for (let sIdx = studentSeeds.length; sIdx < 840; sIdx++) {
    const studentNum = sIdx + 1;
    const branch = branches[sIdx % branches.length];
    const cgpa = parseFloat((6.5 + ((sIdx * 17) % 35) / 10).toFixed(2));
    const userRes = await db.run(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student')",
      ['Candidate #' + studentNum, 'student.' + studentNum + '@campushire.edu', studentPasswordHash]
    );
    const sid = userRes.lastID;
    studentUserIds.push(sid);

    await db.run(
      "INSERT INTO student_profiles (student_id, course, graduation_year, cgpa, backlogs_count, branch, skills, resume_url) VALUES (?, 'B.Tech', 2026, ?, 0, ?, ?, ?)",
      [sid, cgpa, branch, JSON.stringify(['Python', 'Java', 'SQL']), 'https://campushire.storage/resumes/' + sid + '_resume.pdf']
    );
  }

  // Create placed applications so exactly 705 students have status selected
  // Preserve primary 21 test students untouched, and place 703 of the cohort students (indices 21 to 723)
  const remainingNeeded = 705 - 2; // 703 additional placements
  for (let p = 21; p < 21 + remainingNeeded; p++) {
    const sid = studentUserIds[p];
    const jid = jobIds[(p - 21) % jobIds.length];
    await db.run(
      "INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, 'selected')",
      [sid, jid]
    );
  }
  console.log('Successfully scaled campus cohort: 840 candidates, 705 placed (84%), 24 active drives, 148 open roles.');

  console.log('\n=============================================================');
  console.log(' SEEDING COMPLETED SUCCESSFULLY!');
  console.log('=============================================================');
  console.log('Pre-loaded Accounts for Testing:');
  console.log('-------------------------------------------------------------');
  console.log('Role       | Email                              | Password');
  console.log('-------------------------------------------------------------');
  console.log('admin      | admin@campushire.edu               | Admin@123');
  console.log('recruiter  | recruiter.google@campushire.edu     | Recruiter@123');
  console.log('recruiter  | recruiter.msft@campushire.edu       | Recruiter@123');
  console.log('recruiter  | recruiter.amazon@campushire.edu     | Recruiter@123');
  console.log('student #1 | aarav.patel@campushire.edu         | Student@123');
  console.log('student #2 | diya.sen@campushire.edu            | Student@123');
  console.log('student #10| arjun.das@campushire.edu           | Student@123');
  console.log('student #20| siddharth.rao@campushire.edu       | Student@123');
  console.log('=============================================================\n');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seed };

