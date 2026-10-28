/**
 * Evaluates whether a student meets all eligibility criteria for a given job posting.
 * Returns transparent, itemized pass/fail reasons for auditability and student feedback.
 *
 * @param {Object} student - The student profile
 * @param {Object} job - The job posting object with eligibility rules
 * @returns {Object} { isEligible: boolean, reasons: Array, failedCount: number, passedCount: number }
 */
export function checkEligibility(student, job) {
  if (!student || !job || !job.eligibility) {
    return {
      isEligible: false,
      reasons: [{ criterion: "Data Error", expected: "Valid student & job", actual: "Missing data", passed: false, message: "Invalid student or job data." }],
      failedCount: 1,
      passedCount: 0,
      summary: "Cannot evaluate eligibility due to missing profile or job criteria."
    };
  }

  const { minCgpa = 0, allowedBranches = [], maxBacklogs = 0, graduationYear = 2026 } = job.eligibility;

  const reasons = [];

  // 1. CGPA Check
  const cgpaPassed = Number(student.cgpa) >= Number(minCgpa);
  reasons.push({
    id: "cgpa",
    criterion: "Minimum CGPA",
    expected: `≥ ${minCgpa.toFixed(2)}`,
    actual: `${Number(student.cgpa).toFixed(2)}`,
    passed: cgpaPassed,
    message: cgpaPassed
      ? `CGPA meets requirement (${student.cgpa} ≥ ${minCgpa})`
      : `CGPA is below requirement (${student.cgpa} < ${minCgpa})`
  });

  // 2. Branch Check
  const branchPassed = allowedBranches.includes(student.branch);
  reasons.push({
    id: "branch",
    criterion: "Degree Branch",
    expected: allowedBranches.join(", "),
    actual: student.branch,
    passed: branchPassed,
    message: branchPassed
      ? `Branch (${student.branch}) is eligible`
      : `Branch (${student.branch}) is not in accepted list`
  });

  // 3. Backlogs Check
  const backlogsPassed = Number(student.activeBacklogs || 0) <= Number(maxBacklogs);
  reasons.push({
    id: "backlogs",
    criterion: "Active Backlogs",
    expected: `Max ${maxBacklogs}`,
    actual: `${student.activeBacklogs || 0}`,
    passed: backlogsPassed,
    message: backlogsPassed
      ? `Backlog count within limit (${student.activeBacklogs || 0} ≤ ${maxBacklogs})`
      : `Too many active backlogs (${student.activeBacklogs} > ${maxBacklogs} allowed)`
  });

  // 4. Graduation Year
  const yearPassed = Number(student.graduationYear) === Number(graduationYear);
  reasons.push({
    id: "gradYear",
    criterion: "Graduation Batch",
    expected: `Class of ${graduationYear}`,
    actual: `${student.graduationYear}`,
    passed: yearPassed,
    message: yearPassed
      ? `Passing year matches batch of ${graduationYear}`
      : `Graduation year mismatch (${student.graduationYear} ≠ ${graduationYear})`
  });

  const passedCount = reasons.filter(r => r.passed).length;
  const failedCount = reasons.length - passedCount;
  const isEligible = failedCount === 0;

  const summary = isEligible
    ? "All 4 eligibility criteria satisfied. You are eligible to apply."
    : `Ineligible: Failed ${failedCount} out of ${reasons.length} criteria.`;

  return {
    isEligible,
    reasons,
    passedCount,
    failedCount,
    summary
  };
}
