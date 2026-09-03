import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Briefcase, MapPin, 
  Clock, Eye, ChevronDown, ArrowUpRight, Sparkles, Plus, Check 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { userProfile, navigate, addSkill } = useApp();
  const [skillQuery, setSkillQuery] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [experienceQuery, setExperienceQuery] = useState<string>('Select Experience');
  const [activeReelCategory, setActiveReelCategory] = useState<string>('sales');

  const suggestedSkills = [
    'Restful Apis',
    'Cross Browser Compatibility',
    'UI Development',
    'Responsive Web Design',
    'UI Performance Optimization',
    'TypeScript & React 19'
  ];

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
            <p className="prod-hero-subtitle">Discover 5 lakh+ Job Opportunities</p>

            {/* 3-Part Pill Search Bar */}
            <form className="prod-multi-search-bar" onSubmit={handleHeroSearch}>
              <div className="prod-ms-field">
                <input 
                  type="text" 
                  placeholder="Enter Skills/Roles" 
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
                <button type="button" className="trending-chip" onClick={() => navigate('guidance-view')}>
                  Java <ArrowUpRight size={13} />
                </button>
                <button type="button" className="trending-chip" onClick={() => navigate('guidance-view')}>
                  Android <ArrowUpRight size={13} />
                </button>
                <button type="button" className="trending-chip" onClick={() => navigate('guidance-view')}>
                  Operations <ArrowUpRight size={13} />
                </button>
                <button type="button" className="trending-chip" onClick={() => navigate('guidance-view')}>
                  Engineering <ArrowUpRight size={13} />
                </button>
                <button type="button" className="trending-chip" onClick={() => navigate('guidance-view')}>
                  Business Development <ArrowUpRight size={13} />
                </button>
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
                  <img src="/avatars/prakash.jpg" alt={userProfile.name} />
                </div>
                <div className="prod-score-badge">{userProfile.profileScore}%</div>
              </div>

              <h3 className="prod-card-user-name">{userProfile.name}</h3>
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

              {/* 2 Mini Metric Boxes */}
              <div className="prod-mini-metrics-row">
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
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className="content-wrapper prod-main-page-flow">
        
        {/* Recommended Jobs Section */}
        <section className="prod-section-block" style={{ marginTop: '36px' }}>
          <div className="prod-sec-header">
            <h2 className="prod-sec-title">Recommended Jobs</h2>
            <div className="prod-carousel-arrows">
              <button className="prod-arrow-btn"><ChevronLeft size={16} /></button>
              <button className="prod-arrow-btn"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="prod-rec-jobs-3col-grid">
            {/* Job Card 1 */}
            <div className="prod-job-card">
              <div className="pjc-top-row">
                <div>
                  <h3 className="pjc-title">UI Specialist</h3>
                  <span className="pjc-company">JOBTAILOR</span>
                </div>
                <div className="pjc-corp-icon icon-pink-building">
                  🏢
                </div>
              </div>

              <div className="pjc-meta-list">
                <div className="pjc-meta-item"><Briefcase size={14} /> 4 To 8 Yrs</div>
                <div className="pjc-meta-item"><MapPin size={14} /> Mumbai City</div>
                <div className="pjc-meta-item pjc-skills-item">
                  <span>JavaScript</span> • <span>RESTful APIs</span> • <span className="text-more">+8 More</span>
                </div>
              </div>

              <div className="pjc-bottom-row">
                <span className="pjc-time-posted"><Clock size={13} /> 28d ago</span>
                <button className="pjc-btn-apply" onClick={() => navigate('guidance-view')}>
                  Apply
                </button>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="prod-job-card">
              <div className="pjc-top-row">
                <div>
                  <h3 className="pjc-title">Title Not Specified</h3>
                  <span className="pjc-company">GROWBIZ SOLUTIONS INC.</span>
                </div>
                <div className="pjc-corp-icon icon-green-building">
                  🏢
                </div>
              </div>

              <div className="pjc-meta-list">
                <div className="pjc-meta-item"><Briefcase size={14} /> 0 To 4 Yrs</div>
                <div className="pjc-meta-item"><MapPin size={14} /> Chandigarh</div>
                <div className="pjc-meta-item pjc-skills-item">
                  <span>HTML</span> • <span>CSS</span> • <span className="text-more">+8 More</span>
                </div>
              </div>

              <div className="pjc-bottom-row">
                <span className="pjc-time-posted"><Clock size={13} /> 18h ago</span>
                <button className="pjc-btn-apply" onClick={() => navigate('guidance-view')}>
                  Apply
                </button>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="prod-job-card">
              <div className="pjc-top-row">
                <div>
                  <h3 className="pjc-title">UI Specialist - React & Node.Js (Pu...</h3>
                  <span className="pjc-company">YASH TECHNOLOGIES PRIVATE</span>
                </div>
                <div className="pjc-corp-icon icon-gold-building">
                  🏢
                </div>
              </div>

              <div className="pjc-meta-list">
                <div className="pjc-meta-item"><Briefcase size={14} /> 4 To 8 Yrs</div>
                <div className="pjc-meta-item"><MapPin size={14} /> Pune</div>
                <div className="pjc-meta-item pjc-skills-item">
                  <span>JavaScript</span> • <span>Git</span> • <span className="text-more">+8 More</span>
                </div>
              </div>

              <div className="pjc-bottom-row">
                <span className="pjc-time-posted"><Clock size={13} /> 26d ago</span>
                <button className="pjc-btn-apply" onClick={() => navigate('guidance-view')}>
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="prod-sec-bottom-center">
            <button className="prod-sec-view-all-link" onClick={() => navigate('guidance-view')}>
              View All
            </button>
          </div>
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
