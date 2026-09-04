import React, { useState } from 'react';
import { 
  X, Banknote, CheckCircle2, ArrowRight, Video, Upload, 
  Sparkles, ShieldCheck, Users, Award, Gift, 
  Zap, Calendar, Check, Clock, User, Building2, Briefcase, 
  Mail, Layers, Compass, Edit3, Star, ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatorWizardModal: React.FC = () => {
  const { 
    isCreatorWizardOpen, 
    setIsCreatorWizardOpen, 
    addExpert, 
    navigate, 
    userProfile,
    currentUser,
    showToast,
    updateUserProfile
  } = useApp();

  const [step, setStep] = useState<number>(1);
  
  // Step 1: Live Interactive Earnings Calculator State
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(3);
  const [calcRate, setCalcRate] = useState<number>(1299);

  // Step 2: Expert Profile State
  const [fullName, setFullName] = useState<string>(currentUser?.name || userProfile.name || 'Nisha Kumari');
  const [headline, setHeadline] = useState<string>(currentUser?.headline || userProfile.headline || 'Staff Frontend Architect & UI Lead @ Flipkart');
  const [company, setCompany] = useState<string>(currentUser?.company || userProfile.pastCompany || 'Flipkart');
  const [domain, setDomain] = useState<string>('Frontend & Web UI');
  const [bio, setBio] = useState<string>(
    userProfile.summary || 
    'Staff Frontend Architect with 6.8+ years of experience leading UI infrastructure and micro-frontends at Flipkart and Swiggy. Passionate about web performance, React 19 architecture, and mentoring engineers.'
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React.js', 'System Design', 'TypeScript', 'Next.js', 'Micro-Frontends'
  ]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // Step 3: Session Packages & Pricing
  const [selectedPackage, setSelectedPackage] = useState<string>('1:1 Trajectory Mentorship & CV Review');
  const [sessionPrice, setSessionPrice] = useState<number>(calcRate);
  const [sessionDuration, setSessionDuration] = useState<number>(45);

  // Step 4: Availability & Teaser Video
  const [selectedDays, setSelectedDays] = useState<string[]>(['Wed', 'Sat', 'Sun']);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([
    '07:00 PM - 08:00 PM', 
    '08:30 PM - 09:30 PM', 
    '11:00 AM - 12:00 PM'
  ]);
  const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(true);

  React.useEffect(() => {
    if (isCreatorWizardOpen) {
      setFullName(currentUser?.name || userProfile.name || 'Nisha Kumari');
      setHeadline(currentUser?.headline || userProfile.headline || 'Staff Frontend Architect & UI Lead @ Flipkart');
      setCompany(currentUser?.company || userProfile.pastCompany || 'Flipkart');
      setBio(userProfile.summary || 'Staff Frontend Architect with 6.8+ years of experience leading UI infrastructure and micro-frontends at Flipkart. Passionate about web performance and mentoring.');
      if (userProfile.skills && userProfile.skills.length > 0) {
        setSelectedSkills(userProfile.skills.slice(0, 6));
      }
    }
  }, [isCreatorWizardOpen, currentUser, userProfile]);

  if (!isCreatorWizardOpen) return null;

  // Real-time calculations
  const monthlyEarnings = sessionsPerWeek * sessionPrice * 4;
  const annualEarnings = monthlyEarnings * 12;
  const platformFeeSaved = Math.round(annualEarnings * 0.15); // Standard 15% industry platform cut saved!

  const handleToggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkillInput.trim()) {
      e.preventDefault();
      const val = newSkillInput.trim();
      if (!selectedSkills.includes(val)) {
        setSelectedSkills(prev => [...prev, val]);
      }
      setNewSkillInput('');
    }
  };

  const handleQuickAddSkill = (sk: string) => {
    if (!selectedSkills.includes(sk)) {
      setSelectedSkills(prev => [...prev, sk]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleBioPreset = (snippet: string) => {
    if (!bio.includes(snippet)) {
      setBio(prev => `${prev.trim()} ${snippet}`);
    }
  };

  const handlePublish = () => {
    addExpert({
      name: fullName,
      role: headline,
      company,
      domain,
      experience: currentUser?.experienceYears || userProfile.experienceYears || '6+ Years Exp.',
      rating: 5.0,
      reviewsCount: 1,
      sessionsCount: 0,
      price: sessionPrice,
      location: 'Bengaluru / Remote',
      duration: '01:15',
      avatar: currentUser?.avatar || '/avatars/nisha.jpg',
      videoPoster: currentUser?.avatar || '/avatars/nisha.jpg',
      teaserTitle: `Teaser: Mastering ${domain} & Cracking Tier-1 Tech`,
      skills: selectedSkills,
      bio,
      verifiedEmail: '@flipkart.com'
    });

    // Upgrade user profile to active mentor!
    updateUserProfile({
      isMentor: true,
      mentorRate: sessionPrice,
      mentorDuration: sessionDuration,
      mentorAvailability: { days: selectedDays, timeSlots: selectedTimeSlots },
      mentorRating: 5.0,
      mentorReviewsCount: 1,
      mentorSessionsCount: 0,
      mentorEarnings: 0,
      mentorTeaserVideo: isVideoUploaded ? {
        url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
        title: `Teaser: Mastering ${domain} & Cracking Tier-1 Tech`,
        duration: '01:15 min',
        thumbnail: currentUser?.avatar || '/avatars/nisha.jpg',
        uploadedAt: 'Just now'
      } : undefined
    });

    if (currentUser) {
      currentUser.role = 'mentor';
    }

    setIsCreatorWizardOpen(false);
    showToast('🚀 Welcome to the Founding Mentor Circle!', `Your profile is live with 0% platform fee.`, 'success');
    navigate('profile-view');
  };

  const stepList = [
    { num: 1, label: 'Earnings & Benefits', icon: Banknote },
    { num: 2, label: 'Expert Profile', icon: User },
    { num: 3, label: 'Sessions & Pricing', icon: Layers },
    { num: 4, label: 'Schedule & Intro', icon: Calendar },
    { num: 5, label: 'Review & Go Live', icon: Sparkles }
  ];

  const suggestedSkills = [
    'React 19', 'System Design', 'Micro-Frontends', 'Web Vitals & Performance', 
    'GraphQL', 'Node.js', 'Next.js App Router', 'State Machines'
  ];

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card creator-wizard-card modern-mentor-wizard-shell">
        
        {/* Modal Top Header with Brand & Close */}
        <div className="wizard-modal-top-bar">
          <div className="wmt-brand">
            <div className="wmt-brand-badge">
              <Sparkles size={13} className="text-gold" />
              <span>Founding Mentor Circle</span>
            </div>
            <span className="wmt-fee-pill">0% Platform Fee (6 Mos)</span>
          </div>

          <button 
            className="wizard-close-circle-btn" 
            onClick={() => setIsCreatorWizardOpen(false)}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modern Stepper Progress Bar */}
        <div className="wizard-stepper-modern-wrap">
          <div className="wizard-stepper-steps-row">
            {stepList.map((s) => {
              const isCurrent = step === s.num;
              const isCompleted = step > s.num;
              const StepIcon = s.icon;
              return (
                <button
                  key={s.num}
                  type="button"
                  className={`wizard-step-tab ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isCompleted && setStep(s.num)}
                  disabled={!isCompleted && !isCurrent}
                >
                  <div className="wst-icon-circle">
                    {isCompleted ? <Check size={13} /> : <StepIcon size={13} />}
                  </div>
                  <span className="wst-label">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Linear Progress Bar */}
          <div className="wizard-stepper-progress-track">
            <div 
              className="wizard-stepper-progress-fill" 
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modal Body Container with Smooth Scroll */}
        <div className="wizard-content-scroll-viewport">
          
          {/* STEP 1: VALUE PROPOSITION & LIVE CALCULATOR */}
          {step === 1 && (
            <div className="wizard-step-pane active animate-fade-in">
              <div className="mentor-founding-top-badge-banner">
                <div className="mft-badge-pill">
                  <Sparkles size={14} className="sparkle-anim" />
                  <span>FOUNDING MENTOR CIRCLE • VIP INVITATION</span>
                </div>
                <h1 className="mft-headline">
                  Monetize Your Tech Experience <span className="text-gold-gradient">on Your Own Schedule</span>
                </h1>
                <p className="mft-subtext">
                  Set your own session fees and take 1:1 calls when free. Shine automatically matches <strong>3.5 Crore active jobseekers</strong> directly to your calendar.
                </p>
              </div>

              <div className="wizard-calculator-matrix-grid">
                {/* Left Col: Interactive Live Calculator */}
                <div className="mentor-calc-card">
                  <div className="mcc-header">
                    <div className="mcc-icon-pill">
                      <Banknote size={16} />
                      <span>Estimated Earning Potential</span>
                    </div>
                    <span className="mcc-fee-tag">0% Commission</span>
                  </div>

                  {/* Slider 1: Sessions / Week */}
                  <div className="calc-slider-group">
                    <div className="csg-label-row">
                      <span className="csg-title">1:1 Sessions per Week:</span>
                      <strong className="csg-val-badge">{sessionsPerWeek} hrs / week</strong>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      step="1"
                      value={sessionsPerWeek} 
                      onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                      className="mentor-range-slider" 
                    />
                    <div className="csg-preset-chips">
                      {[1, 3, 5, 8].map(hrs => (
                        <button
                          key={hrs}
                          type="button"
                          className={`csg-chip ${sessionsPerWeek === hrs ? 'active' : ''}`}
                          onClick={() => setSessionsPerWeek(hrs)}
                        >
                          {hrs} hr{hrs > 1 ? 's' : ''} {hrs === 3 ? '(Recommended)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slider 2: Fee / Session */}
                  <div className="calc-slider-group">
                    <div className="csg-label-row">
                      <span className="csg-title">Your Price per Session:</span>
                      <strong className="csg-val-badge font-gold">₹{calcRate} / session</strong>
                    </div>
                    <input 
                      type="range" 
                      min="499" 
                      max="2499" 
                      step="100"
                      value={calcRate} 
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCalcRate(val);
                        setSessionPrice(val);
                      }}
                      className="mentor-range-slider" 
                    />
                    <div className="csg-preset-chips">
                      {[699, 1299, 1799, 2499].map(p => (
                        <button
                          key={p}
                          type="button"
                          className={`csg-chip ${calcRate === p ? 'active' : ''}`}
                          onClick={() => {
                            setCalcRate(p);
                            setSessionPrice(p);
                          }}
                        >
                          ₹{p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Calculation Output Highlight */}
                  <div className="calc-result-box">
                    <div className="crb-main-number">
                      <span className="crb-label">Estimated Monthly Potential</span>
                      <div className="crb-amount">
                        ₹{monthlyEarnings.toLocaleString('en-IN')}
                        <span className="crb-period">/ month*</span>
                      </div>
                    </div>
                    
                    <div className="crb-sub-metrics">
                      <div className="csm-item">
                        <span>Annual Potential</span>
                        <strong>₹{annualEarnings.toLocaleString('en-IN')}/yr</strong>
                      </div>
                      <div className="csm-item text-green">
                        <span>Platform Fee Saved</span>
                        <strong>₹{platformFeeSaved.toLocaleString('en-IN')} (100% Yours)</strong>
                      </div>
                    </div>
                  </div>

                  <p className="mcc-payout-note">
                    <ShieldCheck size={14} className="text-emerald" /> *Estimated based on {sessionsPerWeek} slots/week @ ₹{calcRate}. Actual earnings depend on your scheduled availability and candidate bookings.
                  </p>
                </div>

                {/* Right Col: Why Mentors Choose Shine Peerpath */}
                <div className="why-shine-mentor-column">
                  <h3 className="wsm-title">Why Top Leaders Choose Shine Peerpath</h3>
                  
                  <div className="wsm-benefit-card highlight-benefit">
                    <div className="wsm-icon-badge gold-bg">
                      <Users size={18} />
                    </div>
                    <div className="wsm-b-content">
                      <h4>Zero Self-Marketing (Auto-Matched Pipeline)</h4>
                      <p>No need to hunt for audience or self-promote. On Shine, our <strong>3.5Cr active candidate ecosystem</strong> routes relevant mentees directly to your calendar.</p>
                    </div>
                  </div>

                  <div className="wsm-benefit-card">
                    <div className="wsm-icon-badge green-bg">
                      <Gift size={18} />
                    </div>
                    <div className="wsm-b-content">
                      <h4>0% Commission Launch Guarantee</h4>
                      <p>Unlike standard creator tools that charge a <strong>15% to 20% platform cut</strong>, Shine Founding Mentors keep <strong>100% of their earnings</strong> for the first 6 months.</p>
                    </div>
                  </div>

                  <div className="wsm-benefit-card">
                    <div className="wsm-icon-badge purple-bg">
                      <Award size={18} />
                    </div>
                    <div className="wsm-b-content">
                      <h4>Executive Recruiter Inbounds (₹50L–₹1Cr+ Roles)</h4>
                      <p>Mentors get an exclusive Spotlight Profile seen directly by hiring managers & CEOs for VP/Director leadership opportunities.</p>
                    </div>
                  </div>

                  <div className="wsm-benefit-card">
                    <div className="wsm-icon-badge blue-bg">
                      <Zap size={18} />
                    </div>
                    <div className="wsm-b-content">
                      <h4>Zero-Prep Automated Candidate Dossier</h4>
                      <p>AI generates the candidate's resume ATS report, target job specs, and salary gap 15 minutes prior. Zero session prep needed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE & DOMAIN TRACK SETUP */}
          {step === 2 && (
            <div className="wizard-step-pane active animate-fade-in">
              {/* Pre-filled Verified Identity Card Header */}
              <div className="wizard-verified-identity-banner">
                <div className="wvib-avatar-wrap">
                  <img 
                    src={currentUser?.avatar || '/avatars/nisha.jpg'} 
                    alt={fullName} 
                    className="wvib-avatar" 
                  />
                  <span className="wvib-check-badge">✓</span>
                </div>
                <div className="wvib-meta">
                  <div className="wvib-name-row">
                    <h3>{fullName}</h3>
                    <span className="wvib-company-tag">
                      <Building2 size={12} /> {company} Verified Lead
                    </span>
                  </div>
                  <p className="wvib-sub">Pre-filled from your Shine CV. Mentees review this before booking 1:1 sessions.</p>
                </div>
                <div className="wvib-trust-badge">
                  <ShieldCheck size={16} className="text-emerald" />
                  <span>Official Verified Mentor</span>
                </div>
              </div>

              {/* Form Grid with modern icons and clean inputs */}
              <div className="wz-form-grid-modern">
                <div className="form-group-modern">
                  <label><User size={13} /> Full Name *</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="form-input-modern" 
                  />
                </div>

                <div className="form-group-modern">
                  <label><Building2 size={13} /> Current Company *</label>
                  <input 
                    type="text" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)} 
                    className="form-input-modern" 
                  />
                </div>

                <div className="form-group-modern full-width">
                  <label><Briefcase size={13} /> Headline / Professional Title *</label>
                  <input 
                    type="text" 
                    value={headline} 
                    onChange={(e) => setHeadline(e.target.value)} 
                    className="form-input-modern" 
                    placeholder="e.g. Staff Frontend Architect & UI Lead @ Flipkart • Ex-Swiggy"
                  />
                </div>

                <div className="form-group-modern">
                  <label><Compass size={13} /> Primary Mentorship Domain *</label>
                  <select 
                    className="form-select-modern" 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    <option value="Frontend & Web UI">Frontend & Web UI (React, Next.js, Micro-Frontends)</option>
                    <option value="System Design & Backend">System Design & Backend Architecture</option>
                    <option value="Product Management">Product Management & Growth Strategy</option>
                    <option value="AI/ML & Data Engineering">AI/ML & Distributed Data Systems</option>
                    <option value="Engineering Leadership">Engineering Leadership & EM / Director Track</option>
                    <option value="SaaS Sales & GTM">SaaS Enterprise Sales & GTM</option>
                  </select>
                </div>

                <div className="form-group-modern">
                  <label><Mail size={13} /> Work Email Verification (Instant Badge)</label>
                  <div className="verified-input-wrapper-modern">
                    <input 
                      type="text" 
                      defaultValue={`verified@${company.toLowerCase().replace(/\s+/g, '')}.com`} 
                      className="form-input-modern" 
                      disabled
                    />
                    <span className="input-verified-pill-modern">
                      <CheckCircle2 size={13} /> Verified Employer
                    </span>
                  </div>
                </div>

                <div className="form-group-modern full-width">
                  <div className="bio-label-row">
                    <label><Edit3 size={13} /> Your Mentorship Focus & Bio *</label>
                    <div className="bio-prompt-chips">
                      <span className="bpc-title">Quick Add:</span>
                      <button 
                        type="button" 
                        className="bpc-chip"
                        onClick={() => handleBioPreset('Specialized in Staff Frontend Architecture & Tier-1 FAANG interview prep.')}
                      >
                        + FAANG Prep
                      </button>
                      <button 
                        type="button" 
                        className="bpc-chip"
                        onClick={() => handleBioPreset('I help candidates master High-Scale System Design & React 19.')}
                      >
                        + System Design
                      </button>
                    </div>
                  </div>
                  <textarea 
                    rows={3} 
                    className="form-textarea-modern" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Describe how you help mentees crack interviews and level up..."
                  />
                </div>

                <div className="form-group-modern full-width">
                  <label><Layers size={13} /> Core Skills Mentored (Press Enter to add)</label>
                  <div className="skills-tag-editor-box-modern">
                    <div className="tags-chips-list-modern">
                      {selectedSkills.map((sk) => (
                        <span key={sk} className="mentor-skill-tag-modern">
                          {sk}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSkill(sk)} 
                            className="tag-remove-btn"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Add skill + Enter..."
                        className="tag-input-field-modern"
                      />
                    </div>
                  </div>

                  {/* 1-Click Suggested Skills */}
                  <div className="quick-skills-suggest-row">
                    <span className="qss-label">Suggestions:</span>
                    {suggestedSkills.filter(s => !selectedSkills.includes(s)).slice(0, 5).map(sk => (
                      <button
                        key={sk}
                        type="button"
                        className="qss-chip"
                        onClick={() => handleQuickAddSkill(sk)}
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SESSIONS & PRICING PACKAGES */}
          {step === 3 && (
            <div className="wizard-step-pane active animate-fade-in">
              <div className="wz-pane-header-clean">
                <h2>Step 3: Session Offerings & Smart Pricing</h2>
                <p>Choose high-converting mentorship formats recommended by Shine's market intelligence.</p>
              </div>

              <div className="session-templates-grid-modern">
                {[
                  {
                    title: '1:1 Trajectory Mentorship & CV Review',
                    duration: '45 Mins',
                    badge: 'Most Popular',
                    recPrice: 899,
                    desc: 'Deep-dive into candidate resume, ATS optimization, and exact skill gaps to reach Tier-1 companies.'
                  },
                  {
                    title: 'Mock Technical / System Design Interview + Verified Badge',
                    duration: '60 Mins',
                    badge: 'Verified Evaluator Status',
                    recPrice: 1499,
                    desc: 'Real-world FAANG style interview with rubric feedback and authority to issue official Shine Verified Skill Badges.'
                  },
                  {
                    title: 'Salary Negotiation & Offer Strategy',
                    duration: '30 Mins',
                    badge: 'High Impact',
                    recPrice: 999,
                    desc: 'Help candidates counter-offer, navigate multiple job offers, and secure 40-70% CTC jumps.'
                  }
                ].map((tmpl, idx) => {
                  const isSelected = selectedPackage === tmpl.title;
                  return (
                    <div 
                      key={idx} 
                      className={`session-template-card-modern ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedPackage(tmpl.title);
                        setSessionPrice(tmpl.recPrice);
                      }}
                    >
                      <div className="stc-badge-row">
                        <span className="stc-highlight-tag">{tmpl.badge}</span>
                        <span className="stc-duration-pill"><Clock size={11} /> {tmpl.duration}</span>
                      </div>
                      <h4 className="stc-title-modern">{tmpl.title}</h4>
                      <p className="stc-desc-modern">{tmpl.desc}</p>
                      
                      <div className="stc-footer-row">
                        <div className="stc-price-box">
                          <span className="stc-price-val">₹{tmpl.recPrice}</span>
                          <span className="stc-price-sub">/ session (100% Yours)</span>
                        </div>
                        <div className={`stc-select-radio ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <Check size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="custom-price-adjustment-strip-modern mt-4">
                <div className="cpa-left">
                  <strong>Custom Price Override:</strong>
                  <span>Set your own custom rate anytime. 100% transferred directly to your bank account via weekly UPI.</span>
                </div>
                <div className="cpa-input-wrap-modern">
                  <span className="cpa-curr">₹</span>
                  <input 
                    type="number" 
                    value={sessionPrice} 
                    onChange={(e) => setSessionPrice(Number(e.target.value))}
                    className="cpa-input" 
                  />
                  <span className="cpa-unit">/ session</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AVAILABILITY & TEASER VIDEO */}
          {step === 4 && (
            <div className="wizard-step-pane active animate-fade-in">
              <div className="wz-pane-header-clean">
                <h2>Step 4: Availability & Quick Teaser</h2>
                <p>Pick the days and hours you want to take calls. You maintain 100% control over your calendar.</p>
              </div>

              <div className="availability-config-box-modern">
                <div className="avail-header-row">
                  <label className="avail-section-label">1. Weekly Availability Days</label>
                  <div className="avail-quick-presets">
                    <button 
                      type="button" 
                      className="btn-quick-avail"
                      onClick={() => setSelectedDays(['Sat', 'Sun'])}
                    >
                      Weekend Only (Sat & Sun)
                    </button>
                    <button 
                      type="button" 
                      className="btn-quick-avail"
                      onClick={() => setSelectedDays(['Wed', 'Sat', 'Sun'])}
                    >
                      Balanced (Wed, Sat, Sun)
                    </button>
                  </div>
                </div>

                <div className="day-picker-row-modern">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const isSelected = selectedDays.includes(day);
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`day-pill-modern ${isSelected ? 'active' : ''} ${isWeekend ? 'weekend' : ''}`}
                        onClick={() => handleToggleDay(day)}
                      >
                        <span className="day-name">{day}</span>
                        {isWeekend && <span className="weekend-dot">★</span>}
                      </button>
                    );
                  })}
                </div>

                <label className="avail-section-label mt-4">2. Preferred Time Slots (Evenings & Weekends Recommended)</label>
                <div className="time-chips-wrap-modern">
                  {selectedTimeSlots.map((ts, idx) => (
                    <span key={idx} className="time-slot-chip-modern">
                      <Clock size={12} /> {ts}
                    </span>
                  ))}
                  <button 
                    type="button" 
                    className="btn-add-time-chip-modern" 
                    onClick={() => {
                      setSelectedTimeSlots(prev => [...prev, '06:00 PM - 07:00 PM']);
                      showToast('Slot Added', 'Added 06:00 PM - 07:00 PM to your schedule', 'success');
                    }}
                  >
                    + Add Evening Slot
                  </button>
                </div>
              </div>

              <div className="teaser-upload-strip-modern mt-4">
                <div className="tus-left">
                  <div className="tus-icon-circle-modern">
                    <Video size={22} className="text-amber-500" />
                  </div>
                  <div>
                    <h4>60-Second Video Intro (Optional Booster)</h4>
                    <p>Mentors with a short teaser receive <strong>3.4x more session bookings</strong> and executive recruiter inbounds.</p>
                  </div>
                </div>

                <div className="tus-action">
                  {isVideoUploaded ? (
                    <div className="video-ready-badge-modern">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>Ready (1:15 min Intro)</span>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-upload-video-modern" 
                      onClick={() => setIsVideoUploaded(true)}
                    >
                      <Upload size={14} /> Upload Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {step === 5 && (
            <div className="wizard-step-pane active animate-fade-in">
              <div className="wz-pane-header-clean">
                <h2>Step 5: Review & Go Live!</h2>
                <p>Here is how your verified profile will look to 3.5 Crore candidates and executive recruiters on Shine Peerpath.</p>
              </div>

              {/* Realistic Peerpath Mentor Card Preview */}
              <div className="preview-mentor-card-deluxe-modern">
                <div className="pmc-top-bar-modern">
                  <div className="pmc-founding-badge">
                    <Sparkles size={13} />
                    <span>FOUNDING MENTOR CIRCLE • 0% COMMISSION</span>
                  </div>
                  <div className="pmc-recruiter-badge">
                    <ShieldCheck size={13} />
                    <span>Executive Recruiter Spotlight Active</span>
                  </div>
                </div>

                <div className="pmc-body-grid-modern">
                  <div className="pmc-avatar-wrap">
                    <img 
                      src={currentUser?.avatar || '/avatars/nisha.jpg'} 
                      alt={fullName} 
                      className="pmc-avatar-img" 
                    />
                    <span className="pmc-verified-shield">🛡️</span>
                  </div>

                  <div className="pmc-info-col">
                    <div className="pmc-title-row">
                      <h3>{fullName}</h3>
                      <span className="pmc-company-pill">{company}</span>
                      <span className="pmc-star-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 5.0 (Founding)</span>
                    </div>
                    <p className="pmc-headline">{headline}</p>
                    <p className="pmc-bio-snip">{bio}</p>

                    <div className="pmc-skills-row">
                      {selectedSkills.slice(0, 5).map(sk => (
                        <span key={sk} className="pmc-skill-pill">{sk}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pmc-pricing-col-modern">
                    <div className="pmc-rate-box">
                      <span className="pmc-rate-amt">₹{sessionPrice}</span>
                      <span className="pmc-rate-unit">/ session</span>
                    </div>
                    <div className="pmc-instant-payout-tag">
                      <CheckCircle2 size={12} /> 100% Payout to Bank
                    </div>
                    <div className="pmc-slots-preview">
                      <span>Available: {selectedDays.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Unified Sticky Footer Bar */}
        <div className="wizard-modal-sticky-footer">
          <div className="wmsf-left">
            {step > 1 && (
              <button 
                type="button" 
                className="btn-wizard-back"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <span className="wmsf-step-indicator">
              Step {step} of 5 • {stepList[step - 1].label}
            </span>
          </div>

          <div className="wmsf-right">
            {step < 5 ? (
              <button 
                type="button" 
                className="btn-wizard-continue"
                onClick={() => setStep(step + 1)}
              >
                {step === 1 ? 'Claim 0% Founding Seat & Continue' : 'Continue to Next Step'} 
                <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn-wizard-publish glow-pulse"
                onClick={handlePublish}
              >
                <Sparkles size={18} /> Publish Profile & Activate Mentor Status
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
