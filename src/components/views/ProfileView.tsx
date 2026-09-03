import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Play, Award, Rocket, FileText, ArrowRight, X, PhoneCall, Mail, MessageSquare } from 'lucide-react';
import { ViewType } from '../../types';

interface ProfileViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenCreatorWizard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  onOpenCreatorWizard,
}) => {
  const [searchVal, setSearchVal] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('guidance-view');
  };

  return (
    <div className="myshine-dashboard-page">
      <div className="content-wrapper myshine-dashboard-content">
        
        <div className="myshine-search-strip">
          <h2 className="explore-title">Explore 300,000+ jobs</h2>
          <form className="myshine-search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Job title, skills" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="myshine-search-input"
            />
            <button type="submit" className="myshine-search-submit-btn">
              <Search size={18} />
            </button>
          </form>
        </div>

        <div className="myshine-metrics-grid">
          
          <div className="metric-box box-peach">
            <div className="metric-icon-wrap icon-peach">
              <span className="m-icon-glyph">👁️</span>
            </div>
            <div className="metric-details">
              <span className="metric-count">2</span>
              <span className="metric-label">Appeared to Recruiters</span>
            </div>
          </div>

          <div className="metric-box box-blue">
            <div className="metric-icon-wrap icon-blue">
              <PhoneCall size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-count">1</span>
              <span className="metric-label">Recruiter Actions</span>
            </div>
          </div>

          <div className="metric-box box-pink">
            <div className="metric-icon-wrap icon-pink">
              <Mail size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-count">0</span>
              <span className="metric-label">Messages</span>
            </div>
          </div>

          <div className="metric-box box-green">
            <div className="metric-icon-wrap icon-green">
              <MessageSquare size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-count">0</span>
              <span className="metric-label">Job alerts</span>
            </div>
          </div>

        </div>

        <div className="myshine-main-2col-layout">
          <div className="myshine-left-column">
            
            <div className="dashboard-section-card">
              <div className="sec-header-flex">
                <h3 className="sec-heading">Recommended Jobs</h3>
                <div className="sec-header-right">
                  <a href="#!" className="sec-view-all-link">View all</a>
                  <div className="carousel-nav-arrows">
                    <button className="c-arrow"><ChevronLeft size={16} /></button>
                    <button className="c-arrow"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="recommended-jobs-grid">
                <div className="rec-job-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="job-badge-cyan">INTERVIEW ASSURED IN 15 MINS</span>
                    <span className="job-date-text">Aug 14, 2026</span>
                  </div>
                  <h4 className="job-title-text">Software Development Engineer - Backend (Node.js &...</h4>
                  <p className="job-company-name">CONSULTBAE INDIA PRIVATE LIMITED</p>
                  <p className="job-meta-line">• 3 to 7 Yrs • Mumbai City</p>
                  <div className="job-bottom-actions">
                    <button className="btn-job-ignore">Not Interested</button>
                    <button className="btn-job-apply" onClick={() => onNavigate('guidance-view')}>Apply</button>
                  </div>
                </div>

                <div className="rec-job-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="job-badge-cyan">INTERVIEW ASSURED IN 15 MINS</span>
                    <span className="job-date-text">Aug 28, 2026</span>
                  </div>
                  <h4 className="job-title-text">Full Stack Developer React.js & .NET Core</h4>
                  <p className="job-company-name">NetAnalytiks Technologies Limited</p>
                  <p className="job-meta-line">• 5 to 10 Yrs• Work From Home • Bangalore</p>
                  <div className="job-bottom-actions">
                    <button className="btn-job-ignore">Not Interested</button>
                    <button className="btn-job-apply" onClick={() => onNavigate('guidance-view')}>Apply</button>
                  </div>
                </div>

                <div className="rec-job-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="job-badge-cyan">INTERVIEW ASSURED IN 15 MINS</span>
                    <span className="job-date-text">Today</span>
                  </div>
                  <h4 className="job-title-text">Full Stack Developer</h4>
                  <p className="job-company-name">HARJAI COMPUTERS PRIVATE LIMITED</p>
                  <p className="job-meta-line">• 5 to 7 Yrs• Work From Home • Other M...</p>
                  <div className="job-bottom-actions">
                    <button className="btn-job-ignore">Not Interested</button>
                    <button className="btn-job-apply" onClick={() => onNavigate('guidance-view')}>Apply</button>
                  </div>
                </div>

              </div>
            </div>

            <div className="dashboard-section-card" style={{ marginTop: '24px' }}>
              <div className="sec-header-flex">
                <div>
                  <h3 className="sec-heading">Expert Edge: Quick Snippets</h3>
                  <p className="sec-subcaption">Learn from verified engineers and mentors before your next interview</p>
                </div>
                <div className="sec-header-right">
                  <a href="#!" onClick={() => onNavigate('experts-view')} className="sec-view-all-link">View all</a>
                  <div className="carousel-nav-arrows">
                    <button className="c-arrow"><ChevronLeft size={16} /></button>
                    <button className="c-arrow"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="expert-snippets-grid">
                <div className="snippet-card" onClick={() => onNavigate('experts-view')}>
                  <div className="snippet-thumb-frame">
                    <img 
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80" 
                      alt="Expert Edge" 
                      className="snippet-img" 
                    />
                    <div className="snippet-overlay-badge">
                      <span className="edge-logo-text">Expert Edge</span>
                    </div>
                    <div className="snippet-play-btn">
                      <Play size={18} fill="#ffffff" />
                    </div>
                    <span className="snippet-dur">01:12</span>
                  </div>
                  <div className="snippet-info">
                    <h4>How I cracked Enterprise SaaS Sales at Salesforce</h4>
                    <p>Amit Verma • Senior Lead</p>
                  </div>
                </div>

                <div className="snippet-card" onClick={() => onNavigate('experts-view')}>
                  <div className="snippet-thumb-frame">
                    <img 
                      src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80" 
                      alt="Expert Edge" 
                      className="snippet-img" 
                    />
                    <div className="snippet-overlay-badge">
                      <span className="edge-logo-text">Expert Edge</span>
                    </div>
                    <div className="snippet-play-btn">
                      <Play size={18} fill="#ffffff" />
                    </div>
                    <span className="snippet-dur">01:05</span>
                  </div>
                  <div className="snippet-info">
                    <h4>Production LLM Latency & Distributed PyTorch</h4>
                    <p>Ishita Sharma • Senior Data Scientist @ Swiggy</p>
                  </div>
                </div>

                <div className="snippet-card" onClick={() => onNavigate('experts-view')}>
                  <div className="snippet-thumb-frame">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80" 
                      alt="Expert Edge" 
                      className="snippet-img" 
                    />
                    <div className="snippet-overlay-badge">
                      <span className="edge-logo-text">Expert Edge</span>
                    </div>
                    <div className="snippet-play-btn">
                      <Play size={18} fill="#ffffff" />
                    </div>
                    <span className="snippet-dur">01:08</span>
                  </div>
                  <div className="snippet-info">
                    <h4>Transitioning from Inside Sales to Mid-Market AE</h4>
                    <p>Neha Gupta • Account Executive @ Zoho</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="dashboard-section-card" style={{ marginTop: '24px' }}>
              <div className="sec-header-flex">
                <h3 className="sec-heading">My Resume</h3>
                <button className="btn-upload-new-resume" onClick={() => alert('Select resume to upload')}>
                  Upload New
                </button>
              </div>
              <div className="resume-attached-item">
                <div className="res-icon-wrap"><FileText size={20} color="#EF4444" /></div>
                <div className="res-meta-col">
                  <strong>Prakash-Mahto1.pdf</strong>
                  <span>Uploaded: 24/06/2024 • Active on Shine Profile</span>
                </div>
                <button className="btn-shine-gold-sm" onClick={() => onNavigate('guidance-view')}>
                  Analyze Skill Gap With Peerpath <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>

          <div className="myshine-right-sidebar">
            <div className="sidebar-profile-gauge-card">
              <div className="top-applicant-alert">
                <span className="orange-indicator-bar"></span>
                <span>Achieve <strong>75%</strong> to Become a Top Applicant</span>
              </div>

              <div className="gauge-profile-row">
                <div className="circular-meter-box">
                  <svg className="meter-svg" viewBox="0 0 100 100">
                    <circle className="meter-track" cx="50" cy="50" r="40" />
                    <circle 
                      className="meter-fill" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="75.36" 
                    />
                  </svg>
                  <div className="meter-center-text">
                    <span className="meter-val">70%</span>
                    <span className="meter-tag">Good</span>
                  </div>
                </div>

                <div className="gauge-user-info">
                  <h3 className="g-user-name">Prakash Kumar</h3>
                  <p className="g-user-role">Senior Frontend Developer with 3+ year ...</p>
                  <span className="g-user-date">(Updated on September 02, 2026)</span>
                </div>

              </div>

              <div className="gauge-add-cert-row">
                <a href="#!" className="add-cert-link" onClick={() => alert('Add Certification Modal')}>
                  +5% Add Certification
                </a>
              </div>

              <p className="gauge-help-caption">
                Update your profile to increase your Visibility infront of recruiters
              </p>

              <button className="btn-purple-block" onClick={() => onNavigate('guidance-view')}>
                Update Profile
              </button>
            </div>

            <div className="sidebar-empower-hero-card">
              <h2 className="empower-heading">
                Empower <span className="bold-gold">Skills</span>, Elevate <span className="bold-navy">Careers</span>
              </h2>
              
              <p className="empower-body-text">
                Platform that connects you with the top 1% of mentors worldwide to train and empower your skills.
              </p>

              <div className="empower-illustration-box">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80" 
                  alt="Mentor" 
                  className="empower-mentor-img" 
                />
                <span className="floating-badge-icon icon-python">🐍</span>
                <span className="floating-badge-icon icon-react">⚛️</span>
              </div>

              <button className="btn-purple-workshops" onClick={() => onNavigate('guidance-view')}>
                View Upcoming Workshops & Mentors
              </button>
            </div>

            <div className="sidebar-booster-card">
              <div className="booster-row">
                <div className="booster-rocket-circle">
                  <Rocket size={22} color="#ffffff" />
                </div>
                <div className="booster-text-col">
                  <h4>Profile Booster</h4>
                  <p>Get 3x recruiter views by boosting your profile</p>
                </div>
              </div>
              <button className="btn-purple-sm-block" onClick={() => onNavigate('recruiter-view')}>
                Boost now
              </button>
            </div>

            <div className="sidebar-creator-card" onClick={onOpenCreatorWizard}>
              <div className="creator-row">
                <Award size={22} className="text-brand-gold" />
                <div>
                  <h4>Become an Expert <span className="new-tag-gold">NEW</span></h4>
                  <p>Share your experience, mentor peers & earn ₹20k+/month with Creator Mode.</p>
                </div>
              </div>
              <button className="btn-shine-gold w-100 mt-2">
                Join as an Expert <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
