const nodemailer = require('nodemailer');

const isProduction = process.env.NODE_ENV === 'production';
const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const mailTimeoutMs = Number(process.env.MAIL_SEND_TIMEOUT_MS || 15000);

// Create transporter only when SMTP credentials are configured.
const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: mailTimeoutMs,
      greetingTimeout: mailTimeoutMs,
      socketTimeout: mailTimeoutMs
    })
  : null;

const EMAIL_ERROR_CODES = {
  NOT_CONFIGURED: 'SMTP_NOT_CONFIGURED',
  AUTH_FAILED: 'SMTP_AUTH_FAILED',
  SEND_TIMEOUT: 'SMTP_SEND_TIMEOUT'
};

const createEmailError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const classifyEmailError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  if (error?.code === 'EAUTH' || message.includes('invalid login') || message.includes('badcredentials')) {
    return createEmailError(
      EMAIL_ERROR_CODES.AUTH_FAILED,
      'SMTP authentication failed. Use a valid EMAIL_USER and Gmail App Password in EMAIL_PASS.'
    );
  }
  return error;
};

const sendMailWithTimeout = (mailOptions) => Promise.race([
  transporter.sendMail(mailOptions),
  new Promise((_, reject) => {
    setTimeout(() => reject(createEmailError(EMAIL_ERROR_CODES.SEND_TIMEOUT, 'Email send timed out.')), mailTimeoutMs);
  })
]);

const verifyEmailTransporter = async () => {
  const summary = {
    emailUserConfigured: Boolean(process.env.EMAIL_USER),
    emailPassConfigured: Boolean(process.env.EMAIL_PASS),
    verified: false,
    message: ''
  };

  if (!transporter) {
    summary.message = 'Email transporter not configured';
    return summary;
  }

  try {
    await transporter.verify();
    summary.verified = true;
    summary.message = 'SMTP transporter verified successfully';
  } catch (error) {
    const classified = classifyEmailError(error);
    summary.message = classified?.message || 'SMTP verification failed';
  }

  return summary;
};

const sendOrLogDevOtp = async (mailOptions, otpLabel) => {
  if (transporter) {
    try {
      return await sendMailWithTimeout(mailOptions);
    } catch (error) {
      const classified = classifyEmailError(error);

      // Development fallback: don't block OTP flows when SMTP is misconfigured.
      if (!isProduction && classified?.code === EMAIL_ERROR_CODES.AUTH_FAILED) {
        console.warn(`[DEV OTP] SMTP auth failed, fallback enabled. ${otpLabel}`);
        return { messageId: `dev-auth-fallback-${Date.now()}` };
      }

      throw classified;
    }
  }

  if (isProduction) {
    throw createEmailError(
      EMAIL_ERROR_CODES.NOT_CONFIGURED,
      'Email service is not configured. Set EMAIL_USER and EMAIL_PASS.'
    );
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
  EMAIL_ERROR_CODES,
  hasEmailCredentials,
  verifyEmailTransporter,
  sendOTPEmail,
  sendWelcomeEmail
};
