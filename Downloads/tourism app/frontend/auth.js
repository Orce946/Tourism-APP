const apiBaseUrl = 'http://localhost:3001/api';

const ADMIN_EMAIL_WHITELIST = new Set([
  'rebekasultanaorce455@gmail.com',
  'punam.papri@gmail.com'
]);

function getSession() {
  try {
    return JSON.parse(localStorage.getItem('tourismSession') || 'null');
  } catch (error) {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem('tourismSession', JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem('tourismSession');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isAdminEmail(email) {
  return ADMIN_EMAIL_WHITELIST.has(normalizeEmail(email));
}

function showAuthMode(mode) {
  const tabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-auth-panel]'));

  tabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.authTab === mode);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.authPanel !== mode);
  });

  // If hiding signup mode, hide all signup steps
  if (mode !== 'signup') {
    document.getElementById('signupStep1Form')?.classList.add('is-hidden');
    document.getElementById('signupStep2Form')?.classList.add('is-hidden');
    document.getElementById('signupStep3Form')?.classList.add('is-hidden');
    document.getElementById('signupStep4Form')?.classList.add('is-hidden');
    document.getElementById('signupStep5Success')?.classList.add('is-hidden');
  }
}

function updateAuthSuccess(session) {
  setSession(session);

  if (session.role === 'admin') {
    window.location.href = 'admin.html';
    return;
  }

  const loginGate = document.getElementById('loginGate');
  const homeApp = document.getElementById('homeApp');

  if (loginGate && homeApp) {
    loginGate.classList.add('is-hidden');
    homeApp.classList.remove('is-hidden');
    attachLogoutHandlers();
    return;
  }

  window.location.href = 'ui.html';
}

async function handleLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const loginGate = document.getElementById('loginGate');
  const homeApp = document.getElementById('homeApp');

  if (!loginForm) {
    if (homeApp) {
      homeApp.classList.remove('is-hidden');
      attachLogoutHandlers();
    }
    return;
  }

  const session = getSession();
  if (session?.token && session?.role) {
    if (session.role === 'admin') {
      window.location.href = 'admin.html';
      return;
    }

    if (loginGate) {
      loginGate.classList.add('is-hidden');
    }

    if (homeApp) {
      homeApp.classList.remove('is-hidden');
      attachLogoutHandlers();
    }
    return;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = 'Signing in...';

    const formData = new FormData(loginForm);
    const payload = {
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || '').trim()
    };

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      updateAuthSuccess({ token: data.token, role: data.role, user: data.user });
      loginMessage.textContent = 'Login successful. Redirecting...';
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && String(error.message).includes('Failed to fetch')) {
        loginMessage.textContent = 'Cannot reach backend. Start backend: open a terminal, run `cd backend && npm install && npm run dev`.';
      } else {
        loginMessage.textContent = error.message || 'Could not sign in';
      }
    }
  });
}

async function handleSignupForm() {
  // State to track signup progress
  let signupState = {
    name: '',
    password: '',
    email: '',
    verificationCode: ''
  };

  const step1Form = document.getElementById('signupStep1Form');
  const step2Form = document.getElementById('signupStep2Form');
  const step3Form = document.getElementById('signupStep3Form');
  const step4Form = document.getElementById('signupStep4Form');
  const step5Success = document.getElementById('signupStep5Success');
  
  const step1Message = document.getElementById('signupStep1Message');
  const step2Message = document.getElementById('signupStep2Message');
  const step3Message = document.getElementById('signupStep3Message');
  const step4Message = document.getElementById('signupStep4Message');

  if (!step1Form) {
    return;
  }

  // STEP 1: Enter Name
  step1Form.addEventListener('submit', async (event) => {
    event.preventDefault();
    step1Message.textContent = '';

    const name = String(document.getElementById('signupName').value || '').trim();

    if (!name) {
      step1Message.textContent = 'Please enter your name.';
      return;
    }

    signupState.name = name;
    step1Message.textContent = '';
    
    // Show step 2
    step1Form.classList.add('is-hidden');
    step2Form.classList.remove('is-hidden');
    step2Message.textContent = '';
  });

  // STEP 2: Set Password
  step2Form.addEventListener('submit', async (event) => {
    event.preventDefault();
    step2Message.textContent = '';

    const password = String(document.getElementById('signupPassword').value || '').trim();
    const confirmPassword = String(document.getElementById('signupConfirmPassword').value || '').trim();

    if (!password) {
      step2Message.textContent = 'Please enter a password.';
      return;
    }

    if (password.length < 4) {
      step2Message.textContent = 'Password should be at least 4 characters.';
      return;
    }

    if (password !== confirmPassword) {
      step2Message.textContent = 'Passwords do not match.';
      return;
    }

    signupState.password = password;
    step2Message.textContent = '';
    
    // Show step 3
    step2Form.classList.add('is-hidden');
    step3Form.classList.remove('is-hidden');
    step3Message.textContent = '';
  });

  // STEP 3: Enter Email & Send Code
  step3Form.addEventListener('submit', async (event) => {
    event.preventDefault();
    step3Message.textContent = 'Sending verification code...';

    const email = String(document.getElementById('signupEmail').value || '').trim().toLowerCase();

    if (!email) {
      step3Message.textContent = 'Please enter an email address.';
      return;
    }

    const normalizedEmail = email.toLowerCase();
    if (ADMIN_EMAIL_WHITELIST.has(normalizedEmail)) {
      step3Message.textContent = 'This email is reserved for admin access.';
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      signupState.email = email;
      step3Message.textContent = data.devFallback && data.verificationCode
        ? `Dev fallback active. Verification code for ${email}: ${data.verificationCode}`
        : `Verification code sent to ${email}`;

      if (data.devFallback) {
        console.warn('Verification email was not sent. Dev fallback is enabled because SMTP credentials are missing.');
      }
      
      // Show step 4
      step3Form.classList.add('is-hidden');
      step4Form.classList.remove('is-hidden');
      document.getElementById('verificationEmailInfo').textContent = data.devFallback && data.verificationCode
        ? `Dev fallback active. Use this code: ${data.verificationCode}`
        : `Verification code sent to ${email}`;
      step4Message.textContent = '';
      
    } catch (error) {
      console.error('Send verification code error:', error);
      if (error instanceof TypeError && String(error.message).includes('Failed to fetch')) {
        step3Message.textContent = 'Cannot reach backend. Start backend server.';
      } else {
        step3Message.textContent = error.message || 'Could not send verification code';
      }
    }
  });

  // STEP 4: Verify Code & Create Account
  step4Form.addEventListener('submit', async (event) => {
    event.preventDefault();
    step4Message.textContent = 'Creating account...';

    const code = String(document.getElementById('verificationCode').value || '').trim();

    if (!code || code.length !== 6) {
      step4Message.textContent = 'Please enter a valid 6-digit code.';
      return;
    }

    try {
      // First verify the code
      const verifyResponse = await fetch(`${apiBaseUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupState.email, code })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Code verification failed');
      }

      signupState.verificationCode = code;

      // Now register the user
      const registerResponse = await fetch(`${apiBaseUrl}/auth/register-verified`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupState.email,
          code: signupState.verificationCode,
          name: signupState.name,
          password: signupState.password
        })
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Account creation failed');
      }

      step4Message.textContent = 'Account created successfully!';

      // Show success message
      step4Form.classList.add('is-hidden');
      step5Success.classList.remove('is-hidden');
      document.getElementById('successEmailDisplay').textContent = signupState.email;

    } catch (error) {
      console.error('Verify and register error:', error);
      step4Message.textContent = error.message || 'Could not verify code';
    }
  });

  // Resend code button
  const resendCodeBtn = document.getElementById('resendCodeBtn');
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      step4Message.textContent = 'Resending code...';

      try {
        const response = await fetch(`${apiBaseUrl}/auth/send-verification-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: signupState.email })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to resend code');
        }

        step4Message.textContent = `New code sent to ${signupState.email}`;
      } catch (error) {
        console.error('Resend code error:', error);
        step4Message.textContent = error.message || 'Could not resend code';
      }
    });
  }

  // Go to login button
  const goToLoginBtn = document.getElementById('goToLoginBtn');
  if (goToLoginBtn) {
    goToLoginBtn.addEventListener('click', () => {
      // Clear forms
      step1Form.classList.remove('is-hidden');
      step2Form.classList.add('is-hidden');
      step3Form.classList.add('is-hidden');
      step4Form.classList.add('is-hidden');
      step5Success.classList.add('is-hidden');
      
      document.getElementById('signupName').value = '';
      document.getElementById('signupPassword').value = '';
      document.getElementById('signupConfirmPassword').value = '';
      document.getElementById('signupEmail').value = '';
      document.getElementById('verificationCode').value = '';

      // Pre-fill login form
      const loginEmailInput = document.getElementById('loginEmail');
      const loginPasswordInput = document.getElementById('loginPassword');
      if (loginEmailInput) loginEmailInput.value = signupState.email;
      if (loginPasswordInput) loginPasswordInput.value = signupState.password;

      // Switch to login
      showAuthMode('login');
      const loginMessage = document.getElementById('loginMessage');
      if (loginMessage) loginMessage.textContent = 'Ready to login with your new account';
    });
  }
}

function protectAdminPage() {
  const adminIdentity = document.getElementById('adminIdentity');
  if (!adminIdentity) {
    return;
  }

  const session = getSession();

  if (!session?.token) {
    adminIdentity.textContent = 'No session found. Redirecting to login...';
    window.location.href = 'login.html';
    return;
  }

  if (session.role !== 'admin') {
    adminIdentity.textContent = 'Access denied. Admins only.';
    window.location.href = 'ui.html';
    return;
  }

  adminIdentity.textContent = `Logged in as ${session.user?.name || session.user?.email || 'Admin'}`;
  attachLogoutHandlers();
}

function attachLogoutHandlers() {
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutBtnNav = document.getElementById('logoutBtnNav');
  const logoutBtnAdminNav = document.getElementById('logoutBtnAdminNav');
  const logoutBtnAdmin = document.getElementById('logoutBtnAdmin');
  const userNavbar = document.getElementById('userNavbar');
  const adminNavbar = document.getElementById('adminNavbar');

  function showIfLoggedIn(btn, navBar) {
    if (!btn) return;
    const session = getSession();
    if (session && session.token) {
      btn.style.display = '';
      if (navBar) navBar.classList.remove('is-hidden');
    } else {
      btn.style.display = 'none';
      if (navBar) navBar.classList.add('is-hidden');
    }
    btn.addEventListener('click', () => {
      clearSession();
      window.location.href = 'ui.html';
    });
  }

  showIfLoggedIn(logoutBtn);
  showIfLoggedIn(logoutBtnNav, userNavbar);
  showIfLoggedIn(logoutBtnAdminNav, adminNavbar);
  showIfLoggedIn(logoutBtnAdmin);
}

document.addEventListener('DOMContentLoaded', () => {
  handleLoginForm();
  handleSignupForm();
  protectAdminPage();
  showAuthMode('login');

  const tabButtons = Array.from(document.querySelectorAll('[data-auth-tab]'));

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.authTab || 'login';
      showAuthMode(mode);
      
      // If switching to signup, show only step 1
      if (mode === 'signup') {
        const step1Form = document.getElementById('signupStep1Form');
        const step2Form = document.getElementById('signupStep2Form');
        const step3Form = document.getElementById('signupStep3Form');
        const step4Form = document.getElementById('signupStep4Form');
        const step5Success = document.getElementById('signupStep5Success');
        
        if (step1Form) step1Form.classList.remove('is-hidden');
        if (step2Form) step2Form.classList.add('is-hidden');
        if (step3Form) step3Form.classList.add('is-hidden');
        if (step4Form) step4Form.classList.add('is-hidden');
        if (step5Success) step5Success.classList.add('is-hidden');
      }
    });
  });

  attachLogoutHandlers();
});