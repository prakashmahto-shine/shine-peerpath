import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Briefcase, MapPin, 
  Clock, Eye, ChevronDown, ArrowUpRight, Sparkles, Plus, Check,
  ShieldCheck, Banknote, Gift, Award, ArrowRight, Zap, CheckCircle2, Star, Users, TrendingUp, Video,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    navigate, 
    addSkill,
    setIsCreatorWizardOpen,
    updateJobSearchStatus
  } = useApp();
  const [skillQuery, setSkillQuery] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [experienceQuery, setExperienceQuery] = useState<string>('Select Experience');
  const [activeReelCategory, setActiveReelCategory] = useState<string>('sales');

  const isMentor = currentUser?.role === 'mentor';
  const isExecutive = isMentor || currentUser?.isMentorEligible || userProfile.isMentorEligible;

  const isNotLooking = (userProfile.jobSearchStatus || '').toLowerCase().includes('not looking');

  const suggestedSkills = isExecutive
    ? ['Product Strategy', 'Search & Ranking AI', 'Growth Hacking', 'Micro-Frontends', 'System Architecture', 'Design Systems']
    : ['Restful Apis', 'Cross Browser Compatibility', 'UI Development', 'Responsive Web Design', 'UI Performance Optimization', 'TypeScript & React 19'];

  const trendingSearches = isExecutive 
    ? ['Director of Engineering', 'Staff Architect', 'VP Product', 'Engineering Leadership', 'Micro-Frontends', 'System Design']
    : ['Java', 'Android', 'Operations', 'Engineering', 'Business Development', 'React.js'];

  const candidateJobs = [
    {
      id: 'job-1',
      title: 'UI Specialist',
      company: 'JOBTAILOR',
      iconClass: 'icon-pink-building',
      exp: '4 To 8 Yrs',
      loc: 'Mumbai City / Remote',
      skills: ['React.js', 'RESTful APIs', 'TypeScript'],
      posted: '28d ago'
    },
    {
      id: 'job-2',
      title: 'Senior Frontend Developer',
      company: 'GROWBIZ SOLUTIONS INC.',
      iconClass: 'icon-green-building',
      exp: '3 To 5 Yrs',
      loc: 'Bengaluru / Hybrid',
      skills: ['React.js', 'Next.js', 'Tailwind CSS'],
      posted: '18h ago'
    },
    {
      id: 'job-3',
      title: 'UI Specialist - React & Node.Js',
      company: 'YASH TECHNOLOGIES PRIVATE',
      iconClass: 'icon-gold-building',
      exp: '4 To 8 Yrs',
      loc: 'Pune / Remote',
      skills: ['JavaScript', 'Git', 'System Design'],
      posted: '26d ago'
    }
  ];

  const nishaLeadershipJobs = [
    {
      id: 'njob-1',
      title: 'Director of Frontend Architecture',
      company: 'SWIGGY TECH',
      iconClass: 'icon-gold-building',
      exp: '7 To 12 Yrs • ₹55L – ₹70L',
      loc: 'Bengaluru / Hybrid',
      skills: ['Micro-Frontends', 'React 19', 'Design Systems', 'Leadership'],
      posted: 'Direct Inbound • 1d ago'
    },
    {
      id: 'njob-2',
      title: 'Staff UI Platform Architect',
      company: 'ZEPTO QUICK COMMERCE',
      iconClass: 'icon-pink-building',
      exp: '6 To 10 Yrs • ₹50L – ₹65L',
      loc: 'Bengaluru / Remote',
      skills: ['Web Performance', 'Next.js', 'Core Web Vitals'],
      posted: 'Direct Inbound • 3h ago'
    },
    {
      id: 'njob-3',
      title: 'VP of Engineering - Client Experience',
      company: 'RAZORPAY FINTECH',
      iconClass: 'icon-green-building',
      exp: '8+ Yrs • ₹75L – ₹95L',
      loc: 'Bengaluru / Remote',
      skills: ['Enterprise UI', 'P&L Management', 'Cross-Platform SDKs'],
      posted: 'Executive Inbound • 2d ago'
    }
  ];

  const mentorJobs = [
    {
      id: 'mjob-1',
      title: 'Director of Product - AI & Search',
      company: 'SHINE / HT DIGITAL',
      iconClass: 'icon-gold-building',
      exp: '8 To 12 Yrs • ₹50L – ₹65L',
      loc: 'Gurugram / Bengaluru',
      skills: ['Product Strategy', 'Search Algorithms', 'GTM'],
      posted: 'Direct Inbound • 2d ago'
    },
    {
      id: 'mjob-2',
      title: 'Lead Product Manager - Trajectory & Growth',
      company: 'INMOBI TECH',
      iconClass: 'icon-pink-building',
      exp: '6 To 10 Yrs • ₹45L – ₹60L',
      loc: 'Bengaluru / Hybrid',
      skills: ['Growth PM', 'A/B Testing', 'Monetization'],
      posted: 'Direct Inbound • 1d ago'
    },
    {
      id: 'mjob-3',
      title: 'VP of Product Management',
      company: 'FINTECH UNICORN LABS',
      iconClass: 'icon-green-building',
      exp: '8+ Yrs • ₹65L – ₹85L',
      loc: 'Remote / Mumbai',
      skills: ['Executive Leadership', 'P&L Management', 'Scaling'],
      posted: 'Executive Inbound • 5d ago'
    }
  ];

  const displayedJobs = isMentor 
    ? mentorJobs 
    : (currentUser?.id === 'nisha' || userProfile.name?.toLowerCase().includes('nisha')) 
      ? nishaLeadershipJobs 
      : candidateJobs;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('guidance-view');
  };

  return (
    <div className="myshine-dashboard-page">
      
      {/* 1. Production Top Hero Banner Section */}
      <section className="prod-dashboard-hero-section">
        <div className="content-wrapper prod-hero-layout-grid">
          
          {/* Left Column: Search & Trending */}
          <div className="prod-hero-left-col">
            <h1 className="prod-hero-title">Search Your Dream Job</h1>
            <p className="prod-hero-subtitle">
              {isMentor 
                ? 'Discover 500+ Executive & Product Leadership Opportunities' 
                : 'Discover 5 lakh+ Job Opportunities'}
            </p>

            {/* 3-Part Pill Search Bar */}
            <form className="prod-multi-search-bar" onSubmit={handleHeroSearch}>
              <div className="prod-ms-field">
                <input 
                  type="text" 
                  placeholder={isMentor ? "Enter Role (e.g. Director of Product, VP, Lead PM)" : "Enter Skills/Roles"} 
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  className="prod-ms-input"
                />
              </div>

              <div className="prod-ms-divider"></div>

              <div className="prod-ms-field select-field">
                <select 
                  value={experienceQuery} 
                  onChange={(e) => setExperienceQuery(e.target.value)}
                  className="prod-ms-select"
                >
                  <option value="Select Experience">Select Experience</option>
                  <option value="Fresher">Fresher (0 Years)</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                  <option value="8+ Years">8+ Years (Leadership)</option>
                </select>
                <ChevronDown size={14} className="prod-ms-chevron" />
              </div>

              <div className="prod-ms-divider"></div>

              <div className="prod-ms-field">
                <input 
                  type="text" 
                  placeholder="Enter Location" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="prod-ms-input"
                />
              </div>

              <button type="submit" className="prod-ms-search-btn">
                Search
              </button>
            </form>

            {/* Trending Searches Row */}
            <div className="prod-trending-searches-wrap">
              <span className="trending-label">TRENDING SEARCHES</span>
              <div className="trending-chips-row">
                {trendingSearches.map((term, idx) => (
                  <button key={idx} type="button" className="trending-chip" onClick={() => navigate('guidance-view')}>
                    {term} <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Floating Profile Card */}
          <div className="prod-hero-right-col">
            <div className="prod-hero-profile-card">
              <div className="card-top-eye-btn" title="View Profile Visibility">
                <Eye size={15} />
                <ChevronDown size={12} />
              </div>

              {/* Gauge Score Circle */}
              <div className="prod-gauge-avatar-box">
                <svg className="prod-gauge-svg" viewBox="0 0 120 120">
                  <circle 
                    className="prod-gauge-bg" 
                    cx="60" 
                    cy="60" 
                    r="50" 
                  />
                  <circle 
                    className="prod-gauge-fill" 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    strokeDasharray="314.15" 
                    strokeDashoffset={314.15 - (314.15 * userProfile.profileScore / 100)} 
                  />
                </svg>
                <div className="prod-avatar-circle">
                  <img src={currentUser?.avatar || '/avatars/prakash.jpg'} alt={userProfile.name} />
                </div>
                <div className="prod-score-badge">{userProfile.profileScore}%</div>
              </div>

              <h3 className="prod-card-user-name">{userProfile.name || currentUser?.name || 'Prakash Mahto'}</h3>
              
              {isMentor ? (
                <p className="prod-card-incomplete-caption">
                  <span style={{ color: '#059669', fontWeight: 700 }}>🛡️ Verified Mentor</span> •{' '}
                  <button 
                    type="button" 
                    className="prod-update-profile-link" 
                    onClick={() => navigate('profile-view')}
                  >
                    View Profile ➔
                  </button>
                </p>
              ) : (
                <p className="prod-card-incomplete-caption">
                  Your Profile is Incomplete{' '}
                  <button 
                    type="button" 
                    className="prod-update-profile-link" 
                    onClick={() => navigate('profile-view')}
                  >
                    Update Profile
                  </button>
                </p>
              )}

              {/* 2 Mini Metric Boxes */}
              <div className="prod-mini-metrics-row">
                {isMentor ? (
                  <>
                    <div className="prod-mini-metric-box" style={{ cursor: 'pointer' }} onClick={() => navigate('profile-view')}>
                      <div className="pmm-header">
                        <span className="pmm-count">1</span>
                        <div className="pmm-play-icon">
                          <Play size={10} fill="#7C3AED" />
                        </div>
                      </div>
                      <strong className="pmm-title" style={{ color: '#6D28D9' }}>Active Bookings</strong>
                      <span className="pmm-sub">Calls to host</span>
                    </div>

                    <div className="prod-mini-metric-box" style={{ cursor: 'pointer' }} onClick={() => navigate('profile-view')}>
                      <div className="pmm-header">
                        <span className="pmm-count" style={{ fontSize: '15px', color: '#059669' }}>₹47.9k</span>
                        <div className="pmm-play-icon">
                          <Play size={10} fill="#059669" />
                        </div>
                      </div>
                      <strong className="pmm-title">Total Earnings</strong>
                      <span className="pmm-sub">₹999 / session</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="prod-mini-metric-box">
                      <div className="pmm-header">
                        <span className="pmm-count">2</span>
                        <div className="pmm-play-icon">
                          <Play size={10} fill="#64748B" />
                        </div>
                      </div>
                      <strong className="pmm-title">Search Appearance</strong>
                      <span className="pmm-sub">Last 30 days</span>
                    </div>

                    <div className="prod-mini-metric-box">
                      <div className="pmm-header">
                        <span className="pmm-count">1</span>
                        <div className="pmm-play-icon">
                          <Play size={10} fill="#64748B" />
                        </div>
                      </div>
                      <strong className="pmm-title">Recruiters Activity</strong>
                      <span className="pmm-sub">Last 30 days</span>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className="content-wrapper prod-main-page-flow">
        
        {/* Role-Based Banner Flow: Active Mentor vs Verified Expert Candidate (Nisha) vs Jobseeker Candidate (Prakash) */}
        {isMentor ? (
          <section className="dashboard-mentor-alert-strip" onClick={() => navigate('sessions-view')}>
            <div className="dmas-left">
              <div className="dmas-badge">
                <ShieldCheck size={12} className="text-emerald" />
                <span>ACTIVE MENTOR & EVALUATOR</span>
              </div>
              <div className="dmas-text">
                <strong>Next Candidate Session:</strong> Prakash Mahto (Senior Frontend Engineer) • <span className="dmas-time">Saturday, 7:00 PM</span>
              </div>
            </div>

            <div className="dmas-right">
              <button 
                type="button" 
                className="btn-dmas-host"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('sessions-view');
                }}
              >
                <Video size={13} /> Host Video Room <ArrowRight size={13} />
              </button>
            </div>
          </section>
        ) : (currentUser?.isMentorEligible || userProfile.isMentorEligible) ? (
          /* Mentor Eligible Candidates (Nisha - VIP Mentor Circle Acquisition) */
          <section className="dashboard-mentor-acquisition-banner compact-vip-banner" onClick={() => setIsCreatorWizardOpen(true)}>
            <div className="dmab-glow-bg"></div>
            
            <div className="dmab-compact-grid">
              {/* Left Side: Punchy 2-Second Scannable Pitch */}
              <div className="dmab-compact-left">
                <div className="dmab-title-vip-row">
                  <span className="dmab-pill-gold">
                    <Sparkles size={11} className="sparkle-anim" /> VIP INVITATION
                  </span>
                  <h2 className="dmab-compact-title">
                    {userProfile.name ? `${userProfile.name.split(' ')[0]}, turn` : 'Turn'} your {userProfile.pastCompany || 'tech'} expertise into <span className="text-gold-gradient">1:1 Mentorship</span>
                  </h2>
                </div>

                {/* 3 High-Impact Visual Badges */}
                <div className="dmab-punchy-badges-row">
                  <span className="dp-badge dp-fire">
                    🔥 <strong>184+ Mentees</strong> actively looking for {userProfile.skills[0] || 'React'}
                  </span>
                  <span className="dp-badge dp-green">
                    <Banknote size={12} /> <strong>0% Commission</strong> • Keep 100% Payouts
                  </span>
                  <span className="dp-badge dp-purple">
                    <Award size={12} /> <strong>Unlocks ₹50L+</strong> Recruiter Inbounds
                  </span>
                </div>
              </div>

              {/* Right Side: Sleek One-Tap CTA */}
              <div className="dmab-compact-right">
                <button 
                  type="button" 
                  className="btn-shine-gold dmab-compact-cta-btn glow-pulse"
                >
                  <Sparkles size={14} /> Activate in 60s <ArrowRight size={14} />
                </button>
                <span className="dmab-compact-caption">
                  ⚡ Pre-filled from Shine CV
                </span>
              </div>
            </div>
          </section>
        ) : (
          /* Standard Candidates (Prakash - Searching for jobs & mentorship) */
          <section className="dashboard-candidate-trajectory-banner" onClick={() => navigate('guidance-view')}>
            <div className="dctb-compact-layout">
              <div className="dctb-left">
                <div className="dctb-top-row">
                  <span className="dctb-badge">
                    <Sparkles size={12} className="text-purple-600" />
                    <span>Career Multiplier</span>
                  </span>
                  <h2 className="dctb-title">
                    {userProfile.name?.split(' ')[0] || 'Prakash'}, Fast-Track Your Career to <span className="dctb-salary-highlight">{userProfile.targetCtc || '₹18L – ₹24L'}</span>
                  </h2>
                  <span className="dctb-growth-tag">
                    <TrendingUp size={11} /> +320% Growth
                  </span>
                </div>

                <div className="dctb-meta-row">
                  <span className="dctb-meta-item">
                    <ShieldCheck size={12} className="text-purple-600" />
                    <span>1:1 Mentors from Google & Swiggy</span>
                  </span>
                  <span className="dctb-dot">•</span>
                  <span className="dctb-meta-item">
                    <Briefcase size={12} className="text-blue-600" />
                    <span>2,850+ Direct Jobs on Shine</span>
                  </span>
                  <span className="dctb-dot">•</span>
                  <span className="dctb-meta-item">
                    <Zap size={12} className="text-amber-500" />
                    <span>Live Mock Interviews & Code Prep</span>
                  </span>
                </div>
              </div>

              <div className="dctb-right">
                <button 
                  type="button" 
                  className="btn-dctb-explore"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('guidance-view');
                  }}
                >
                  <span>Explore Pathways</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Jobs / Leadership Opportunities Section */}
        <section className="prod-section-block" style={{ marginTop: '32px' }}>
          <div className="prod-sec-header">
            <h2 className="prod-sec-title">
              {isExecutive ? 'Recommended Leadership & Executive Inbounds' : 'Recommended Jobs'}
            </h2>
            {!isNotLooking && (
              <div className="prod-carousel-arrows">
                <button className="prod-arrow-btn"><ChevronLeft size={16} /></button>
                <button className="prod-arrow-btn"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>

          {isNotLooking ? (
            <div className="prod-job-suggestions-paused-card">
              <div className="jsp-left">
                <div className="jsp-icon-wrap">
                  <EyeOff size={18} className="jsp-icon-svg" />
                </div>
                <div className="jsp-content">
                  <div className="jsp-header-row">
                    <h3 className="jsp-title">Opportunity Inbounds are Paused</h3>
                    <span className="jsp-status-pill">● Status: Not Looking For Jobs</span>
                  </div>
                  <p className="jsp-desc">
                    Inbound executive inquiries & matching recommendations are currently sleeping.
                  </p>
                </div>
              </div>
              <div className="jsp-actions">
                <button 
                  type="button" 
                  className="btn-jsp-resume" 
                  onClick={() => updateJobSearchStatus(isExecutive ? 'Casually Exploring Leadership Roles' : 'Actively Looking For Jobs')}
                >
                  <Zap size={13} /> Resume Inbounds
                </button>
                <button 
                  type="button" 
                  className="btn-jsp-settings" 
                  onClick={() => navigate('profile-view')}
                  title="Configure in Profile"
                >
                  Change Status ➔
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="prod-rec-jobs-3col-grid">
                {displayedJobs.map((job) => (
                  <div key={job.id} className="prod-job-card">
                    <div className="pjc-top-row">
                      <div>
                        <h3 className="pjc-title">{job.title}</h3>
                        <span className="pjc-company">{job.company}</span>
                      </div>
                      <div className={`pjc-corp-icon ${job.iconClass}`}>
                        🏢
                      </div>
                    </div>

                    <div className="pjc-meta-list">
                      <div className="pjc-meta-item"><Briefcase size={14} /> {job.exp}</div>
                      <div className="pjc-meta-item"><MapPin size={14} /> {job.loc}</div>
                      <div className="pjc-meta-item pjc-skills-item">
                        {job.skills.map((s, sIdx) => (
                          <span key={sIdx}>{s} • </span>
                        ))}
                        <span className="text-more">+6 More</span>
                      </div>
                    </div>

                    <div className="pjc-bottom-row">
                      <span className="pjc-time-posted"><Clock size={13} /> {job.posted}</span>
                      <button className="pjc-btn-apply" onClick={() => navigate('guidance-view')}>
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="prod-sec-bottom-center">
                <button className="prod-sec-view-all-link" onClick={() => navigate('guidance-view')}>
                  View All
                </button>
              </div>
            </>
          )}
        </section>

        {/* 3. Promo Banners Strip (HCL Walk-In & Shine Express) */}
        <section className="prod-banners-carousel-section">
          <button className="banner-nav-btn prev-btn"><ChevronLeft size={18} /></button>

          <div className="prod-banners-2col-row">
            {/* Banner 1: YES BANK & HCLTech Hiring */}
            <div className="prod-promo-banner-card" onClick={() => navigate('guidance-view')}>
              <img 
                src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/hcl-banner.png" 
                alt="YES BANK & HCLTech Hiring Walk-in Drives" 
                className="promo-banner-img"
              />
            </div>

            {/* Banner 2: Shine Express - AI That Hires For You */}
            <div className="prod-promo-banner-card" onClick={() => navigate('experts-view')}>
              <img 
                src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/img_shineExpress.png" 
                alt="Shine Express - AI That Hires For You" 
                className="promo-banner-img"
              />
            </div>
          </div>

          <button className="banner-nav-btn next-btn"><ChevronRight size={18} /></button>
        </section>

        {/* 4. Expert Edge Reels Section (With Exact M S Kumar & Neeraj Athalye Photos) */}
        <section className="prod-section-block" style={{ marginTop: '48px' }}>
          <div className="prod-sec-header">
            <div className="reels-title-wrap">
              <h2 className="prod-sec-title">
                Expert Edge Reels <Sparkles size={20} className="sparkle-gold-icon" />
              </h2>
            </div>
            <div className="prod-carousel-arrows">
              <button className="prod-arrow-btn"><ChevronLeft size={16} /></button>
              <button className="prod-arrow-btn"><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Filter Category Pills */}
          <div className="reels-category-pills-row">
            <button 
              className={`reel-pill ${activeReelCategory === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveReelCategory('sales')}
            >
              Sales and Marketing
            </button>
            <button 
              className={`reel-pill ${activeReelCategory === 'tech' ? 'active' : ''}`}
              onClick={() => setActiveReelCategory('tech')}
            >
              IT & Software
            </button>
            <button 
              className={`reel-pill ${activeReelCategory === 'bfsi' ? 'active' : ''}`}
              onClick={() => setActiveReelCategory('bfsi')}
            >
              BFSI
            </button>
          </div>

          {/* 2 Wide Reels Cards with Exact M S Kumar & Neeraj Athalye Images */}
          <div className="reels-cards-2col-grid">
            {/* Reel 1: M S Kumar */}
            <div className="reel-horizontal-card" onClick={() => navigate('experts-view')}>
              <div className="reel-avatar-box">
                <img 
                  src="https://staticcand.shine.com/c/s1/images/candidate/banner/image_mskumar_web.webp" 
                  alt="M S Kumar" 
                  className="reel-avatar-photo" 
                />
              </div>
              <div className="reel-meta-col">
                <h4 className="reel-title">Digital Marketing Fundamentals: The A-Z Guide t...</h4>
                <p className="reel-author">Founder & Digital Marketing Corporate Trainer • Course...</p>
              </div>
              <button className="reel-play-circle-btn">
                <Play size={14} fill="#0F172A" />
              </button>
            </div>

            {/* Reel 2: Neeraj Athalye */}
            <div className="reel-horizontal-card" onClick={() => navigate('experts-view')}>
              <div className="reel-avatar-box">
                <img 
                  src="https://staticcand.shine.com/c/s1/images/candidate/banner/image_neerajathalye_web.webp" 
                  alt="Neeraj Athalye" 
                  className="reel-avatar-photo" 
                />
              </div>
              <div className="reel-meta-col">
                <h4 className="reel-title">Key growth learnings from 27 years in sales and...</h4>
                <p className="reel-author">Vice President & Head-APAC • Icertis</p>
              </div>
              <button className="reel-play-circle-btn">
                <Play size={14} fill="#0F172A" />
              </button>
            </div>
          </div>

          <div className="prod-sec-bottom-center">
            <button className="prod-sec-view-all-link" onClick={() => navigate('experts-view')}>
              View All
            </button>
          </div>
        </section>

      </div>

      {/* 5. "Small Updates, Big Impact!" Section with full-width linear-gradient background */}
      <section className="prod-impact-wrapper-section">
        <div className="content-wrapper">
          <div className="prod-impact-card">
            
            {/* Left Column: Icon & Headline */}
            <div className="impact-left-hero">
              <div className="impact-svg-wrap">
                <img 
                  src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/geometric_shape_loader.svg" 
                  alt="Small Updates Geometric Icon" 
                  className="impact-geometric-svg-img"
                />
              </div>
              <h3 className="impact-title">Small Updates, Big Impact!</h3>
              <p className="impact-subtitle">
                Add these must have skills to boost your profile and make every opportunity count.
              </p>
            </div>

            {/* Right Column: Interactive Suggested Skills Chips */}
            <div className="impact-right-skills">
              <div className="impact-skills-wrap">
                {suggestedSkills.map((sk) => {
                  const isAdded = userProfile.skills.includes(sk);
                  return (
                    <button 
                      key={sk} 
                      className={`impact-skill-chip ${isAdded ? 'added' : ''}`}
                      onClick={() => addSkill(sk)}
                      disabled={isAdded}
                    >
                      {sk} {isAdded ? <Check size={13} className="text-success" /> : <Plus size={13} />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
