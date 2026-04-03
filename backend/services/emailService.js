const nodemailer = require('nodemailer');

// Create transporter (Gmail App Password required)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

  return transporter.sendMail(mailOptions);
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
      <a href="${process.env.FRONTEND_URL}">Visit Website</a>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};
