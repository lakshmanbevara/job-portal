const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;
    
    let transporter;
    if (hasSmtp) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 2525,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.log('--- EMAIL SIMULATOR (No SMTP Configured) ---');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message:\n${options.message}`);
      console.log('---------------------------------------------');
      return { success: true, simulated: true };
    }

    const message = {
      from: `${process.env.FROM_NAME || 'StudentJobPortal'} <${process.env.FROM_EMAIL || 'noreply@studentjobportal.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('SMTP Mail Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
