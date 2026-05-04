const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { signToken } = require('../middleware/auth');
const { findUserByEmail, createPublicUser } = require('../repositories/usersRepository');

// In-memory storage for verification codes (in production, use a database)
const verificationCodes = new Map();
const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes
const VERIFICATION_RESEND_COOLDOWN = 60 * 1000; // 1 minute

// Generate a random 6-digit code
function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function cleanupExpiredVerificationCodes() {
  const now = Date.now();

  for (const [email, record] of verificationCodes.entries()) {
    if (record.expiresAt <= now) {
      verificationCodes.delete(email);
    }
  }
}

setInterval(cleanupExpiredVerificationCodes, 5 * 60 * 1000).unref();

function getMailTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
}

// Send email with verification code
async function sendVerificationEmail(email, code) {
  return new Promise((resolve) => {
    const transporter = getMailTransporter();

    if (!transporter) {
      console.log('Mail Error: missing EMAIL_USER or EMAIL_PASS');
      resolve({ sent: false, reason: 'missing-email-config' });
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${code}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Mail Error:', err);
        resolve({ sent: false, reason: 'send-failed', error: err.message });
      } else {
        console.log('Mail Sent:', info.response);
        resolve({ sent: true, response: info.response });
      }
    });
  });
}

const authRouter = express.Router();
const ADMIN_EMAIL_WHITELIST = new Set([
  'rebekasultanaorce455@gmail.com',
  'punam.papri@gmail.com'
]);

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await findUserByEmail(email);

  const normalizedEmail = String(email).trim().toLowerCase();
  const isAdminEmail = ADMIN_EMAIL_WHITELIST.has(normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Account not found. Please sign up first.' });
  }

  if (isAdminEmail && user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin account is not allowed' });
  }

  const storedPassword = user.password_hash || user.password || '';
  const isBcryptHash = String(storedPassword).startsWith('$2');
  const passwordMatches = isBcryptHash
    ? await bcrypt.compare(password, storedPassword)
    : storedPassword === password;

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.role === 'admin' && !isAdminEmail) {
    return res.status(403).json({ message: 'Admin account is not allowed' });
  }

  const token = signToken(user);

  return res.json({
    message: 'Login successful',
    accountStatus: 'existing',
    token,
    role: user.role,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (String(password).length < 4) {
    return res.status(400).json({ message: 'Password should be at least 4 characters' });
  }

  // If caller provided confirmPassword, ensure it matches (defensive)
  if (req.body.confirmPassword && String(password) !== String(req.body.confirmPassword)) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (ADMIN_EMAIL_WHITELIST.has(normalizedEmail)) {
    return res.status(403).json({ message: 'Use the admin login. This email is reserved for admin access.' });
  }

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: 'Account already exists. Please login instead.' });
  }

  const createdUser = await createPublicUser({
    name: String(name).trim(),
    email: normalizedEmail,
    password
  });

  const token = signToken(createdUser);

  return res.status(201).json({
    message: 'Account created successfully',
    accountStatus: 'created',
    token,
    role: createdUser.role,
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role
    }
  });
});

authRouter.get('/me', (req, res) => {
  return res.json({
    message: 'Use the token from /login to protect this route in the next step.'
  });
});

// NEW ENDPOINT: Send verification code to email
authRouter.post('/send-verification-code', async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const ADMIN_EMAIL_WHITELIST = new Set([
    'rebekasultanaorce455@gmail.com',
    'punam.papri@gmail.com'
  ]);

  if (ADMIN_EMAIL_WHITELIST.has(normalizedEmail)) {
    return res.status(403).json({ message: 'This email is reserved for admin access.' });
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists. Please login instead.' });
  }

  cleanupExpiredVerificationCodes();

  const existingRecord = verificationCodes.get(normalizedEmail);
  if (existingRecord && Date.now() - existingRecord.lastSentAt < VERIFICATION_RESEND_COOLDOWN) {
    return res.status(429).json({
      message: 'Please wait before requesting another code for this email.',
      retryAfterSeconds: Math.ceil((VERIFICATION_RESEND_COOLDOWN - (Date.now() - existingRecord.lastSentAt)) / 1000)
    });
  }

  try {
    const code = generateVerificationCode();
    
    // Store the code with expiry
    verificationCodes.set(normalizedEmail, {
      code,
      expiresAt: Date.now() + VERIFICATION_CODE_EXPIRY,
      attempts: 0,
      lastSentAt: Date.now()
    });

    // Send email
    const emailResult = await sendVerificationEmail(normalizedEmail, code);

    if (!emailResult.sent) {
      const allowDevFallback = String(process.env.USE_FAKE_EMAIL || '') === 'true';
      if (allowDevFallback) {
        // Log the code and return success so developers can test without SMTP
        console.log(`[DEV-FALLBACK] Verification code for ${normalizedEmail}: ${code}`);
        return res.json({
          message: 'Verification code sent (dev fallback - code logged on server).',
          email: normalizedEmail,
          devFallback: true,
          verificationCode: code
        });
      }

      verificationCodes.delete(normalizedEmail);

      return res.status(500).json({
        message: 'Email service is not configured. Set EMAIL_USER, EMAIL_PASS, and EMAIL_FROM in backend/.env using a Gmail App Password.'
      });
    }

    return res.json({
      message: 'Verification code sent to your email',
      email: normalizedEmail
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    return res.status(500).json({ message: 'Failed to send verification code' });
  }
});

// NEW ENDPOINT: Verify the code
authRouter.post('/verify-code', (req, res) => {
  const { email, code } = req.body || {};

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const storedData = verificationCodes.get(normalizedEmail);

  if (!storedData) {
    return res.status(400).json({ message: 'No verification code found for this email. Please request a new one.' });
  }

  if (Date.now() > storedData.expiresAt) {
    verificationCodes.delete(normalizedEmail);
    return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
  }

  if (storedData.attempts >= 5) {
    verificationCodes.delete(normalizedEmail);
    return res.status(429).json({ message: 'Too many failed attempts. Please request a new verification code.' });
  }

  if (storedData.code !== code) {
    storedData.attempts += 1;
    return res.status(400).json({ message: 'Invalid verification code. Please try again.' });
  }

  // Code is valid - mark as verified
  storedData.verified = true;
  storedData.verifiedAt = Date.now();

  return res.json({
    message: 'Code verified successfully',
    verified: true
  });
});

// NEW ENDPOINT: Register with verified email
authRouter.post('/register-verified', async (req, res) => {
  const { email, code, name, password } = req.body || {};

  if (!email || !code || !name || !password) {
    return res.status(400).json({ message: 'Email, code, name and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const storedData = verificationCodes.get(normalizedEmail);

  // Verify that the code was already verified
  if (!storedData || !storedData.verified) {
    return res.status(400).json({ message: 'Email verification required. Please verify your code first.' });
  }

  if (storedData.code !== code) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  if (String(password).length < 4) {
    return res.status(400).json({ message: 'Password should be at least 4 characters' });
  }

  const ADMIN_EMAIL_WHITELIST = new Set([
    'rebekasultanaorce455@gmail.com',
    'punam.papri@gmail.com'
  ]);

  if (ADMIN_EMAIL_WHITELIST.has(normalizedEmail)) {
    return res.status(403).json({ message: 'This email is reserved for admin access.' });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: 'Account already exists. Please login instead.' });
    }

    // Create the user
    const createdUser = await createPublicUser({
      name: String(name).trim(),
      email: normalizedEmail,
      password
    });

    // Clear the verification code
    verificationCodes.delete(normalizedEmail);

    const token = signToken(createdUser);

    return res.status(201).json({
      message: 'Account created successfully',
      accountStatus: 'created',
      token,
      role: createdUser.role,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
      }
    });
  } catch (error) {
    console.error('Register verified error:', error);
    return res.status(500).json({ message: 'Failed to create account' });
  }
});

module.exports = { authRouter };