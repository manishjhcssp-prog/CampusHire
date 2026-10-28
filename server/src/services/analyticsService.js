const { db } = require('../config/database');

async function getDashboardStats() {
  const nowIso = new Date().toISOString();

  // 1. Total Student Counts
  const totalStudentsRow = await db.get(
    "SELECT COUNT(*) as count FROM users WHERE role = 'student'"
  );
  const totalStudents = totalStudentsRow ? totalStudentsRow.count : 0;

  // 2. Placed Students (Students who have at least one application with status = 'selected')
  const placedStudentsRow = await db.get(
    `SELECT COUNT(DISTINCT student_id) as count 
     FROM applications 
     WHERE status = 'selected'`
  );
  const placedStudents = placedStudentsRow ? placedStudentsRow.count : 0;

  // Total Placement Percentage
  const placementPercentage = totalStudents > 0 
    ? parseFloat(((placedStudents / totalStudents) * 100).toFixed(2))
    : 0.0;

  // 3. Active Placement Drives Count (Companies that currently have active, unexpired job postings)
  const activeDrivesRow = await db.get(
    `SELECT COUNT(DISTINCT company_id) as count 
     FROM jobs 
     WHERE is_active = 1 AND deadline >= ?`,
    [nowIso]
  );
  const activeDrivesCount = activeDrivesRow ? activeDrivesRow.count : 0;

  // 4. Open Roles Count (Active job postings where deadline >= now)
  const openRolesRow = await db.get(
    `SELECT COUNT(*) as count 
     FROM jobs 
     WHERE is_active = 1 AND deadline >= ?`,
    [nowIso]
  );
  const openRolesCount = openRolesRow ? openRolesRow.count : 0;

  // Total Jobs (all time)
  const totalJobsRow = await db.get('SELECT COUNT(*) as count FROM jobs');
  const totalJobsCount = totalJobsRow ? totalJobsRow.count : 0;

  // Total Companies
  const totalCompaniesRow = await db.get('SELECT COUNT(*) as count FROM companies');
  const totalCompaniesCount = totalCompaniesRow ? totalCompaniesRow.count : 0;

  // 5. Application Volume Counts by Status
  const appStatusRows = await db.all(
    `SELECT status, COUNT(*) as count 
     FROM applications 
     GROUP BY status`
  );

  const applicationVolume = {
    total: 0,
    submitted: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0
  };

  appStatusRows.forEach(row => {
    if (applicationVolume.hasOwnProperty(row.status)) {
      applicationVolume[row.status] = row.count;
    }
    applicationVolume.total += row.count;
  });

  // 6. Branch-wise Placement Breakdown
  const branchBreakdownRows = await db.all(
    `SELECT sp.branch,
            COUNT(DISTINCT sp.student_id) as total_students,
            COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN sp.student_id END) as placed_students
     FROM student_profiles sp
     JOIN users u ON sp.student_id = u.id AND u.role = 'student'
     LEFT JOIN applications a ON sp.student_id = a.student_id
     GROUP BY sp.branch
     ORDER BY sp.branch ASC`
  );

  const branchPlacementStats = branchBreakdownRows.map(row => ({
    branch: row.branch,
    total_students: row.total_students,
    placed_students: row.placed_students,
    placement_rate: row.total_students > 0
      ? parseFloat(((row.placed_students / row.total_students) * 100).toFixed(2))
      : 0.0
  }));

  // 7. Upcoming Interviews Count
  const upcomingInterviewsRow = await db.get(
    `SELECT COUNT(*) as count 
     FROM interview_schedules 
     WHERE status = 'scheduled' AND interview_time >= ?`,
    [nowIso]
  );
  const upcomingInterviews = upcomingInterviewsRow ? upcomingInterviewsRow.count : 0;

  return {
    metrics: {
      total_students: totalStudents,
      placed_students: placedStudents,
      unplaced_students: totalStudents - placedStudents,
      placement_percentage: placementPercentage,
      active_drives_count: activeDrivesCount,
      open_roles_count: openRolesCount,
      total_jobs_count: totalJobsCount,
      total_companies_count: totalCompaniesCount,
      upcoming_interviews_count: upcomingInterviews
    },
    application_volume: applicationVolume,
    branch_breakdown: branchPlacementStats,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  getDashboardStats
};

