# Run this script in the SAME terminal where you run 'mvn spring-boot:run'
# to set the Gmail SMTP credentials for the current session.
#
# HOW TO GET YOUR GMAIL APP PASSWORD:
#   1. Go to https://myaccount.google.com/security
#   2. Enable 2-Step Verification (required)
#   3. Search "App passwords" → create one for "WorkflowX"
#   4. Copy the 16-character password (no spaces)
#
# USAGE:
#   . .\set-mail-env.ps1           (dot-source to apply to current shell)
#   Then run: mvn spring-boot:run

$env:MAIL_USERNAME    = "your-gmail@gmail.com"   # <-- replace
$env:MAIL_APP_PASSWORD = "xxxx xxxx xxxx xxxx"   # <-- replace (16-char app password)

Write-Host "Mail env vars set for this session." -ForegroundColor Green
Write-Host "  MAIL_USERNAME     = $env:MAIL_USERNAME"
Write-Host "  MAIL_APP_PASSWORD = [set]"

