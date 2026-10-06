const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

let cachedTransporter = null;
let testAccountDetails = null;

/**
 * Initializes and caches the Nodemailer transporter.
 * If SMTP configuration is provided in env, it uses it.
 * Otherwise, it lazy-creates an Ethereal test account.
 */
const getTransporter = async () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    console.log('Initializing production SMTP transport...');
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // Development fallback: Ethereal Mail
  console.log('No SMTP configuration found. Creating temporary Ethereal Mail account...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    testAccountDetails = testAccount;
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`Ethereal Mail test account created: ${testAccount.user}`);
    return cachedTransporter;
  } catch (error) {
    console.error('Failed to create Ethereal Mail account:', error);
    throw error;
  }
};

/**
 * Writes sent email log to a local file for offline verification.
 */
const logEmailToFile = (emailDetails) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, 'sent_emails.json');
    let emailLogs = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        emailLogs = JSON.parse(fileContent);
      } catch (parseError) {
        console.error('Failed to parse existing email log file, starting fresh:', parseError);
      }
    }

    emailLogs.push({
      timestamp: new Date().toISOString(),
      ...emailDetails,
    });

    fs.writeFileSync(filePath, JSON.stringify(emailLogs, null, 2), 'utf8');
    console.log(`Email log saved to offline file: ${filePath}`);
  } catch (err) {
    console.error('Failed to write email to log file:', err);
  }
};

/**
 * Sends a status update email to the student.
 * 
 * @param {string} studentEmail - Receiver's email
 * @param {string} studentName - Student's name
 * @param {string} jobTitle - Title of the job
 * @param {string} companyName - Name of the company
 * @param {string} status - New application status ('Shortlisted', 'Selected', 'Rejected')
 */
const sendStatusUpdateEmail = async (studentEmail, studentName, jobTitle, companyName, status) => {
  try {
    const transporter = await getTransporter();

    // Define colors and content depending on the status
    let statusColor = '#4b5563'; // neutral gray
    let statusBg = '#f3f4f6';
    let statusGreeting = 'Application Update';
    let statusMessage = '';
    let actionText = 'View Application Status';

    if (status === 'Shortlisted') {
      statusColor = '#d97706'; // warm orange
      statusBg = '#fef3c7';
      statusGreeting = 'Good news! You have been Shortlisted!';
      statusMessage = `We are pleased to inform you that your application for **${jobTitle}** has been shortlisted by **${companyName}**. The hiring team will be in touch with you shortly to outline the next steps in the selection process.`;
    } else if (status === 'Selected') {
      statusColor = '#059669'; // emerald green
      statusBg = '#d1fae5';
      statusGreeting = 'Congratulations! You are Selected!';
      statusMessage = `Wonderful news! **${companyName}** has officially selected you for the **${jobTitle}** position. Congratulations on this fantastic opportunity! The HR contact will reach out to you with your offer details and onboarding information shortly.`;
      actionText = 'Go to Student Dashboard';
    } else if (status === 'Rejected') {
      statusColor = '#6b7280'; // gray
      statusBg = '#f3f4f6';
      statusGreeting = 'Application Status Update';
      statusMessage = `Thank you for your interest in the **${jobTitle}** position at **${companyName}**. After careful review of all candidates, the company has decided not to proceed with your application at this time. We appreciate your time and efforts, and wish you the best of luck in your search.`;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            padding: 30px 24px;
            background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 30px 24px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .message {
            font-size: 15px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 24px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 8px;
            color: ${statusColor};
            background-color: ${statusBg};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 24px;
          }
          .divider {
            height: 1px;
            background-color: #1e293b;
            margin: 24px 0;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .details-table td {
            padding: 8px 0;
            font-size: 14px;
            color: #9ca3af;
          }
          .details-table td.label {
            width: 30%;
            font-weight: 600;
            color: #6b7280;
          }
          .details-table td.value {
            color: #ffffff;
          }
          .btn-container {
            text-align: center;
            margin-top: 30px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            transition: all 0.3s ease;
          }
          .footer {
            padding: 20px 24px;
            background-color: #0d1222;
            border-top: 1px solid #1e293b;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Student Job Portal</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${studentName},</div>
            <div class="status-badge">${status}</div>
            <div class="greeting" style="color: ${statusColor}; font-size: 16px;">${statusGreeting}</div>
            <div class="message">
              ${statusMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>
            
            <div class="divider"></div>
            
            <table class="details-table">
              <tr>
                <td class="label">Job Title</td>
                <td class="value">${jobTitle}</td>
              </tr>
              <tr>
                <td class="label">Company</td>
                <td class="value">${companyName}</td>
              </tr>
              <tr>
                <td class="label">Current Status</td>
                <td class="value" style="color: ${statusColor}; font-weight: bold;">${status}</td>
              </tr>
            </table>

            <div class="btn-container">
              <a href="http://localhost:5173/student-dashboard" class="btn" target="_blank">${actionText}</a>
            </div>
          </div>
          <div class="footer">
            This is an automated notification from Placement & Internship Cell.<br>
            Please do not reply directly to this email.
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Placement Cell" <${transporter.options.auth.user}>`,
      to: studentEmail,
      subject: `Application Update: ${jobTitle} at ${companyName} - [${status}]`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent: ${info.messageId}`);

    let etherealUrl = null;
    if (testAccountDetails) {
      etherealUrl = nodemailer.getTestMessageUrl(info);
      console.log(`=======================================================`);
      console.log(`✉️  PREVIEW EMAIL LIVE: ${etherealUrl}`);
      console.log(`=======================================================`);
    }

    // Write to offline sent log
    logEmailToFile({
      recipient: studentEmail,
      studentName,
      jobTitle,
      companyName,
      status,
      messageId: info.messageId,
      etherealUrl,
    });

    return {
      success: true,
      messageId: info.messageId,
      etherealUrl,
    };
  } catch (error) {
    console.error('Error sending application status update email:', error);
    // Log error but do not throw to prevent breaking API requests
    logEmailToFile({
      recipient: studentEmail,
      studentName,
      jobTitle,
      companyName,
      status,
      error: error.message,
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sends a password reset OTP email to user.
 * 
 * @param {string} userEmail - Receiver's email
 * @param {string} userName - User's name
 * @param {string} otpCode - 6-digit verification OTP code
 */
const sendPasswordResetOtpEmail = async (userEmail, userName, otpCode) => {
  try {
    const transporter = await getTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 540px;
            margin: 40px auto;
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            padding: 28px 24px;
            background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 32px 24px;
            text-align: center;
          }
          .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 12px;
          }
          .message {
            font-size: 14px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 24px;
          }
          .otp-container {
            margin: 28px 0;
            padding: 20px;
            background: #1e293b;
            border: 2px dashed #6366f1;
            border-radius: 12px;
            display: inline-block;
          }
          .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 10px;
            color: #38bdf8;
            margin: 0;
          }
          .expire-note {
            font-size: 13px;
            color: #f59e0b;
            margin-top: 10px;
            font-weight: 600;
          }
          .security-tip {
            font-size: 12px;
            color: #64748b;
            line-height: 1.5;
            background: #0b0f19;
            padding: 12px;
            border-radius: 8px;
            margin-top: 24px;
            text-align: left;
          }
          .footer {
            padding: 20px 24px;
            background-color: #0d1222;
            border-top: 1px solid #1e293b;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${userName || 'User'},</div>
            <div class="message">
              We received a request to reset your password for the Student Job and Internship Portal. Use the verification code below to complete your reset:
            </div>
            
            <div class="otp-container">
              <div class="otp-code">${otpCode}</div>
              <div class="expire-note">⏱️ Code expires in 10 minutes</div>
            </div>

            <div class="security-tip">
              🛡️ <strong>Security Tip:</strong> If you did not request a password reset, please ignore this email or change your password immediately if you suspect unauthorized access. Never share this code with anyone.
            </div>
          </div>
          <div class="footer">
            Student Job and Internship Portal<br>
            Automated Authentication System • Do not reply to this email
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Job Portal Security" <${transporter.options.auth.user}>`,
      to: userEmail,
      subject: `${otpCode} is your Password Reset Code`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP email successfully sent: ${info.messageId}`);

    let etherealUrl = null;
    if (testAccountDetails) {
      etherealUrl = nodemailer.getTestMessageUrl(info);
      console.log(`=======================================================`);
      console.log(`🔑 PASSWORD RESET OTP: ${otpCode}`);
      console.log(`✉️  PREVIEW EMAIL LIVE: ${etherealUrl}`);
      console.log(`=======================================================`);
    }

    logEmailToFile({
      recipient: userEmail,
      userName,
      action: 'PASSWORD_RESET_OTP',
      otpCode,
      messageId: info.messageId,
      etherealUrl,
    });

    return {
      success: true,
      messageId: info.messageId,
      etherealUrl,
    };
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    logEmailToFile({
      recipient: userEmail,
      userName,
      action: 'PASSWORD_RESET_OTP',
      error: error.message,
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendStatusUpdateEmail,
  sendPasswordResetOtpEmail,
};
