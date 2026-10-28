Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft David Desktop")
$synth.Rate = 0  # Standard natural speed

$scripts = @(
  @{ id = "part1"; text = "Welcome to CampusHire, an intelligent college placement and recruitment automation portal, developed for Problem Statement HACK-P410 by Team ByteCraft. Our team consists of RAMAGIRI MANISH as lead, Challa Bharat, kanuri Thanush Sree Ram, and Devata sai nihar from branch CSE AI. In this video, we present our complete full-stack solution to automate university recruitment drives." },
  @{ id = "part2"; text = "Every placement season, university placement cells face a massive operational challenge. Managing student eligibility across dozens of conflicting spreadsheets and WhatsApp groups takes three to five days per company, leading to human verification errors and missed opportunities. CampusHire solves this by unifying students, recruiters, and placement officers into a single automated platform. Our rule-based engine performs sub-second academic auditing, tracks candidates across dynamic pipeline stages, and gives university leadership real-time visibility into placement benchmarks." },
  @{ id = "part3"; text = "Let us dive into the live working application running on our React single-page frontend. At the top, real-time metric cards stream aggregated statistics directly from our backend: an 84 percent placement rate representing 705 placed candidates out of 841, across 23 active partner drives and 147 open job roles. In the Ongoing Drives panel, placement officers track live applicant counts across Google, Microsoft, and Deloitte, advancing candidates smoothly across screening, technical rounds, and interview stages. On the right, our Smart Eligibility engine conducts instant candidate audits. Evaluating Rahul Sharma against Google's Software Engineer role immediately confirms his 8.6 CGPA, zero backlogs, and computer science branch with green checkmarks. When criteria fail, the system highlights the exact discrepancies. For special circumstances, administrators can open the Dean Exception Override modal to log policy justifications and approve fast-track passes. At the bottom, our integrated calendar displays scheduled interview slots with direct Google Meet conferencing links. Switching to the Student Persona, students get a transparent view of their academic profile, explore eligible job drives, and submit one-click applications with real-time status tracking. Switching to the Recruiter view gives corporate teams an intuitive applicant tracking pipeline." },
  @{ id = "part4"; text = "Now let us examine the backend architecture and database operations. CampusHire is powered by a high-throughput Node.js Express REST API connected to a native SQLite database with zero external C++ dependencies. Querying our dashboard aggregation endpoint returns live cohort metrics in under 20 milliseconds. Our eligibility checker endpoint evaluates complex academic rules in memory and returns detailed criteria diagnostics. In the database, foreign key constraints maintain strict relational integrity across students, companies, job postings, and interview schedules, scaled to a cohort of 841 students. Here is our automated test suite executing 52 end-to-end integration tests across authentication, RBAC authorization, rule engine validation, and pipeline state machines, with 100 percent passing and zero failures." },
  @{ id = "part5"; text = "In conclusion, CampusHire is fully deployed and verified, running smoothly with concurrent frontend and backend services. Developed by Team ByteCraft from branch CSE AI, we successfully achieved 100 percent automated eligibility verification, eliminated spreadsheet data silos, and delivered a production-ready portal for modern campus recruitment. Thank you for watching!" }
)

if (-not (Test-Path "audio")) { New-Item -ItemType Directory -Path "audio" }

foreach ($s in $scripts) {
  $file = "audio\$($s.id).wav"
  $synth.SetOutputToWaveFile($file)
  $synth.Speak($s.text)
  Write-Host "Generated $file"
}
$synth.Dispose()
