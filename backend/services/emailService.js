const nodemailer = require('nodemailer');

const isProduction = process.env.NODE_ENV === 'production';
const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// Create transporter only when SMTP credentials are configured.
const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

const sendOrLogDevOtp = async (mailOptions, otpLabel) => {
  if (transporter) {
    return transporter.sendMail(mailOptions);
  }

  if (isProduction) {
    throw new Error('Email service is not configured. Set EMAIL_USER and EMAIL_PASS.');
  }

  console.warn(`[DEV OTP] ${otpLabel}`);
  return { messageId: `dev-${Date.now()}` };
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"Shadi Card" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Verify Your Email - Shadi Card',
    html: `
      <h2>Hello ${name || 'User'},</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:6px;">${otp}</h1>
      <p>This OTP is valid for <b>10 minutes</b>.</p>
      <p>If you didn’t request this, please ignore.</p>
    `
  };

  return sendOrLogDevOtp(mailOptions, `OTP for ${email}: ${otp}`);
};

// Send Welcome Email
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"Shadi Card" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Welcome to Shadi Card',
    html: `
      <h2>Welcome ${name} 🎉</h2>
      <p>Your account has been created successfully.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Visit Website</a>
    `
  };

  return sendOrLogDevOtp(mailOptions, `Welcome email for ${email}`);
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};
