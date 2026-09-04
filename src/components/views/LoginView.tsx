import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, User, Sparkles, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, switchUser, resetDemoData } = useApp();

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('password');
  const [identifier, setIdentifier] = useState<string>('prakash');
  const [password, setPassword] = useState<string>('shine@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your username, email, or phone number');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    const success = login(identifier.trim(), password);
    if (!success) {
      setErrorMessage('Invalid credentials. Hint: use "prakash" or "akash" with password "shine@123"');
    }
  };

  const handleOtpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    setOtpSent(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 4-digit OTP');
      return;
    }
    // Simulate OTP success by logging into whichever user is matched or prakash
    const matchedUser = identifier.toLowerCase().includes('akash') ? 'akash' : 'prakash';
    switchUser(matchedUser);
  };

  return (
    <div className="shine-official-login-container">
      <div className="shine-login-split-layout">
        
        {/* =========================================================================
            LEFT COLUMN: Official Branding, User Illustration, Value Proposition
           ========================================================================= */}
        <div className="shine-login-left-canvas">
          
          {/* Top-Left Official Logo */}
          <div className="shine-login-logo-wrap">
            <img 
              src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
              alt="Shine.com Logo" 
              className="shine-login-official-logo"
            />
          </div>

          {/* Center Graphic & Floating Icons Illustration */}
          <div className="shine-illustration-center-stage">
            <div className="shine-illustration-canvas-wrap">
              {/* Concentric Circle Background Highlights */}
              <div className="shine-glow-circle circle-outer"></div>
              <div className="shine-glow-circle circle-inner"></div>

              {/* Floating Skill Badges (Matching Official Page) */}
              <div className="floating-skill-chip chip-react" title="React.js">
                <span className="chip-emoji">⚛️</span>
              </div>
              <div className="floating-skill-chip chip-python" title="Python">
                <span className="chip-emoji">🐍</span>
              </div>
              <div className="floating-skill-chip chip-excel" title="Excel">
                <span className="chip-emoji">📊</span>
              </div>
              <div className="floating-skill-chip chip-arrow" title="Career Growth">
                <span className="chip-emoji">↗️</span>
              </div>

              {/* Official User Illustration SVG */}
              <img 
                src="https://www.shine.com/pages/myshine/images/user-illustration.svg" 
                alt="Find Your Dream Job" 
                className="shine-official-user-svg"
                onError={(e) => {
                  // Fallback if network blocked
                  (e.target as HTMLElement).style.opacity = '1';
                }}
              />
            </div>

            <h1 className="shine-login-hero-title">Find Your Dream Job</h1>
            <p className="shine-login-hero-subtitle">
              Your partner in finding a dream job that fuels your ambitions.
            </p>

            {/* Trust Proof Pill */}
            <div className="shine-trust-proof-pill">
              <div className="trust-avatars-group">
                <img src="/avatars/saheli.jpg" alt="User 1" className="trust-avatar-img" />
                <img src="/avatars/akash.jpg" alt="User 2" className="trust-avatar-img" />
                <img src="/avatars/prakash.jpg" alt="User 3" className="trust-avatar-img" />
              </div>
              <span className="trust-proof-text">1.5M+ job seekers trust us</span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: Login Form Box (OTP & Password Tabs, Demo Autofill)
           ========================================================================= */}
        <div className="shine-login-right-canvas">
          <div className="shine-login-card-wrapper">
            
            {/* Login Header */}
            <div className="shine-login-header-group">
              <span className="shine-login-eyebrow">LOG IN TO</span>
              <h2 className="shine-login-main-heading">Shine Account</h2>
            </div>

            {/* Segmented Control: Login Via OTP vs Password */}
            <div className="shine-segmented-tabs">
              <button 
                type="button" 
                className={`shine-seg-tab ${authMode === 'otp' ? 'active' : ''}`}
                onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
              >
                Login Via OTP
              </button>
              <button 
                type="button" 
                className={`shine-seg-tab ${authMode === 'password' ? 'active' : ''}`}
                onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
              >
                Login Via Password
              </button>
            </div>

            {/* Form Container Card */}
            <div className="shine-login-form-card">
              
              {errorMessage && (
                <div className="shine-login-error-box">
                  <span>{errorMessage}</span>
                </div>
              )}

              {authMode === 'password' ? (
                /* ----------------- Password Login Form ----------------- */
                <form onSubmit={handlePasswordSubmit} className="shine-auth-form">
                  <div className="shine-field-group">
                    <label className="shine-field-label">Email or Phone Number / Username</label>
                    <input 
                      type="text" 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your email /phone number"
                      className="shine-auth-input"
                      autoFocus
                    />
                  </div>

                  <div className="shine-field-group">
                    <div className="shine-label-with-action">
                      <label className="shine-field-label">Password</label>
                      <a href="#!" onClick={(e) => { e.preventDefault(); alert('Password for demo is shine@123'); }} className="shine-forgot-link">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="shine-password-input-wrap">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (shine@123)"
                        className="shine-auth-input"
                      />
                      <button 
                        type="button" 
                        className="shine-pwd-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`shine-btn-proceed ${identifier && password ? 'active-ready' : ''}`}
                  >
                    Proceed
                  </button>
                </form>
              ) : (
                /* ----------------- OTP Login Form ----------------- */
                !otpSent ? (
                  <form onSubmit={handleOtpRequest} className="shine-auth-form">
                    <div className="shine-field-group">
                      <label className="shine-field-label">Email or Phone Number</label>
                      <input 
                        type="text" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter your email /phone number"
                        className="shine-auth-input"
                        autoFocus
                      />
                    </div>

                    <button 
                      type="submit" 
                      className={`shine-btn-proceed ${identifier ? 'active-ready' : ''}`}
                    >
                      Proceed
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="shine-auth-form">
                    <div className="shine-field-group">
                      <label className="shine-field-label">Enter 4-Digit OTP sent to {identifier}</label>
                      <input 
                        type="text" 
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter OTP (e.g. 1234)"
                        maxLength={6}
                        className="shine-auth-input shine-otp-input"
                        autoFocus
                      />
                      <span className="shine-otp-hint">Tip: Enter any 4 digits (e.g. 1234) for demo verification</span>
                    </div>

                    <div className="shine-otp-btn-row">
                      <button type="submit" className="shine-btn-proceed active-ready">
                        Verify & Login
                      </button>
                      <button 
                        type="button" 
                        className="shine-btn-resend"
                        onClick={() => setOtpSent(false)}
                      >
                        Change Number / Email
                      </button>
                    </div>
                  </form>
                )
              )}

              {/* Quick 1-Click Demo Accounts Selector */}
              <div className="shine-demo-accounts-box">
                <span className="demo-accounts-header">⚡ Quick Demo 1-Click Login:</span>
                <div className="demo-cards-row">
                  <button 
                    type="button"
                    className="btn-demo-account-chip chip-candidate"
                    onClick={() => {
                      setIdentifier('prakash');
                      setPassword('shine@123');
                      login('prakash', 'shine@123');
                    }}
                  >
                    <User size={13} className="text-blue-600" />
                    <div className="demo-chip-text">
                      <strong>Candidate: Prakash</strong>
                      <span>Junior/Mid Jobseeker</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="btn-demo-account-chip chip-nisha"
                    onClick={() => {
                      setIdentifier('nisha');
                      setPassword('shine@123');
                      login('nisha', 'shine@123');
                    }}
                  >
                    <Sparkles size={13} className="text-amber-500" />
                    <div className="demo-chip-text">
                      <strong>Lead: Nisha (Campaign)</strong>
                      <span>Staff Lead @ Flipkart (Pitch Target)</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="btn-demo-account-chip chip-mentor"
                    onClick={() => {
                      setIdentifier('akash');
                      setPassword('shine@123');
                      login('akash', 'shine@123');
                    }}
                  >
                    <ShieldCheck size={13} className="text-purple-600" />
                    <div className="demo-chip-text">
                      <strong>Mentor: Akash</strong>
                      <span>Verified Host (48 Sessions)</span>
                    </div>
                  </button>
                </div>

                <button 
                  type="button" 
                  className="btn-reset-demo-login mt-3"
                  onClick={() => resetDemoData()}
                >
                  <RotateCcw size={12} /> Reset All 3 Persona Data to Baseline
                </button>
              </div>

            </div>

            {/* Under Card: Register Link */}
            <div className="shine-login-footer-links">
              <p className="shine-register-prompt">
                Don't have an account?{' '}
                <a href="#!" onClick={(e) => { e.preventDefault(); alert('Demo Registration: Simply select Prakash or Akash above to get started!'); }} className="shine-gold-register-link">
                  Register
                </a>
              </p>

              {/* OR Divider */}
              <div className="shine-or-divider">
                <span className="or-line"></span>
                <span className="or-text">OR</span>
                <span className="or-line"></span>
              </div>

              {/* Google Social Button */}
              <button 
                type="button" 
                className="shine-btn-google"
                onClick={() => {
                  switchUser('prakash');
                }}
              >
                <svg className="google-svg-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
