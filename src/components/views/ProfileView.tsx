import React, { useState } from 'react';
import { 
  User, Download, Sparkles, Award, ShieldCheck, FileText, ArrowRight, 
  Trash2, Star, Upload, ChevronDown, Check, Compass, Edit3, Briefcase, Plus
} from 'lucide-react';
import { ViewType } from '../../types';

interface ProfileViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenCreatorWizard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  onOpenCreatorWizard,
}) => {
  const [jobStatus, setJobStatus] = useState<string>('Actively looking for jobs');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string>(
    'Senior Frontend Engineer with 4+ years of hands-on experience building scalable, high-performance web applications using React.js, TypeScript, and Next.js. Passionate about UI/UX performance optimization and micro-frontends.'
  );
  const [isSummarySaved, setIsSummarySaved] = useState<boolean>(true);

  return (
    <div className="content-wrapper shine-official-myprofile-page">
      
      <div className="myprofile-layout-2col">
        
        <div className="myprofile-left-col">
          <div className="myprofile-card user-overview-card">
            <span className="updated-today-tag">Updated today</span>

            <div className="profile-gauge-avatar-wrap">
              <svg className="profile-gauge-svg" viewBox="0 0 120 120">
                <circle 
                  className="gauge-bg-circle" 
                  cx="60" 
                  cy="60" 
                  r="52" 
                />
                <circle 
                  className="gauge-fill-circle" 
                  cx="60" 
                  cy="60" 
                  r="52" 
                  strokeDasharray="326.7" 
                  strokeDashoffset="98.0" 
                />
              </svg>
              
              <div className="profile-avatar-inner-circle">
                <img 
                  src="/avatars/prakash.jpg" 
                  alt="Prakash Kumar" 
                  className="profile-real-avatar-img"
                />
              </div>

              <div className="gauge-score-badge">70%</div>
            </div>

            <h2 className="user-profile-name">Prakash Mahto</h2>
            <p className="user-profile-designation">Senior frontend developer</p>

            <div className="job-status-dropdown-wrap">
              <button 
                className="btn-job-status-select"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span>{jobStatus || 'Set Your Current Job Search Status'}</span>
                <ChevronDown size={15} />
              </button>

              {isStatusDropdownOpen && (
                <div className="job-status-menu">
                  <div 
                    className={`status-option ${jobStatus === 'Actively looking for jobs' ? 'selected' : ''}`}
                    onClick={() => { setJobStatus('Actively looking for jobs'); setIsStatusDropdownOpen(false); }}
                  >
                    🟢 Actively looking for jobs (Immediate)
                  </div>
                  <div 
                    className={`status-option ${jobStatus === 'Serving notice period' ? 'selected' : ''}`}
                    onClick={() => { setJobStatus('Serving notice period'); setIsStatusDropdownOpen(false); }}
                  >
                    🟡 Serving notice period (15 days)
                  </div>
                  <div 
                    className={`status-option ${jobStatus === 'Casually exploring opportunities' ? 'selected' : ''}`}
                    onClick={() => { setJobStatus('Casually exploring opportunities'); setIsStatusDropdownOpen(false); }}
                  >
                    ⚪ Casually exploring opportunities
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="myprofile-card quick-nav-card">
            <h4 className="quick-nav-title">Quick Profile Sections</h4>
            <div className="quick-links-list">
              <a href="#summary-section" className="q-link">Profile Summary <Check size={13} className="text-success" /></a>
              <a href="#resume-section" className="q-link">Resume Attached <Check size={13} className="text-success" /></a>
              <a href="#peerpath-section" className="q-link highlight-purple">✨ Peerpath Verified Badges <span className="pill-new-badge">NEW</span></a>
              <a href="#skills-section" className="q-link">Key Skills</a>
              <a href="#experience-section" className="q-link">Employment History</a>
              <a href="#education-section" className="q-link">Education</a>
            </div>
          </div>

          <div className="myprofile-card creator-promote-card" onClick={onOpenCreatorWizard}>
            <div className="creator-promote-header">
              <Award size={20} className="text-brand-gold" />
              <h4>Join Shine Creator Mode</h4>
            </div>
            <p>Monetize your frontend experience by offering paid 1:1 mentorship calls on Peerpath.</p>
            <button className="btn-shine-gold-sm w-100">
              Claim Your Creator Profile <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="myprofile-right-col">
          
          <div className="shine-alert-banner alert-orange">
            <div className="alert-left-content">
              <div className="alert-circle-icon orange-icon">
                <User size={18} />
              </div>
              <div className="alert-texts">
                <h4 className="alert-heading">Profile is not updated!</h4>
                <p className="alert-subheading">Your Profile was last updated almost a year ago</p>
              </div>
            </div>
            <button className="btn-shine-outline-yellow" onClick={() => alert('Profile updated successfully!')}>
              Update
            </button>
          </div>

          <div className="shine-alert-banner alert-peach">
            <div className="alert-left-content">
              <div className="alert-circle-icon peach-icon">
                <User size={18} />
              </div>
              <div className="alert-texts">
                <p className="alert-single-text">Your profile is incomplete! Add details and increase your profile score</p>
              </div>
            </div>
          </div>

          <div className="myprofile-section-card summary-box" id="summary-section">
            <div className="summary-boost-tag">
              <span className="text-success font-bold">↑ 5%</span>
            </div>

            <div className="summary-card-inner">
              <div className="summary-folder-icon">
                📁
              </div>
              <h3 className="section-main-heading">Profile Summary</h3>
              
              {isSummarySaved && summaryText ? (
                <div className="saved-summary-display">
                  <p className="summary-paragraph">{summaryText}</p>
                  <button className="btn-shine-outline-yellow" onClick={() => setShowSummaryModal(true)}>
                    <Edit3 size={13} /> Edit Summary
                  </button>
                </div>
              ) : (
                <>
                  <p className="summary-caption-text">
                    A well-crafted professional summary lets recruiters understand you in under 30 seconds.
                  </p>
                  <button className="btn-shine-outline-yellow" onClick={() => setShowSummaryModal(true)}>
                    Add
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="myprofile-section-card resume-box" id="resume-section">
            <div className="section-card-top-bar">
              <h3 className="section-main-heading">Resume</h3>
              <button className="btn-shine-outline-yellow" onClick={() => alert('Select resume to upload')}>
                <Upload size={14} /> Upload
              </button>
            </div>

            <div className="resume-item-row">
              <div className="res-file-details">
                <span className="res-filename">Prakash-Mahto1.pdf</span>
                <div className="res-meta-line">
                  <span>Uploaded: 26/06/2024</span>
                  <span className="res-default-badge">Default</span>
                </div>
              </div>

              <div className="res-actions-right">
                <button className="icon-action-btn" title="Download Resume" onClick={() => alert('Downloading Prakash-Mahto1.pdf...')}>
                  <Download size={16} />
                </button>
                <button className="icon-action-btn text-warning" title="Starred / Primary">
                  <Star size={16} fill="#F59E0B" />
                </button>
                <button className="icon-action-btn text-danger" title="Delete" onClick={() => alert('Resume cannot be deleted as it is default.')}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="myprofile-section-card resume-eval-box">
            <div className="resume-eval-flex">
              <div className="eval-left-illo">
                <div className="eval-gauge-icon">
                  📊
                </div>
                <div>
                  <h4 className="eval-title">Is Your Resume Good Enough?</h4>
                  <p className="eval-desc">
                    Check your ATS score and get 1:1 CV gap analysis with verified leaders on Shine Peerpath.
                  </p>
                </div>
              </div>

              <button className="btn-shine-yellow-solid" onClick={() => onNavigate('guidance-view')}>
                <Compass size={15} /> Analyze With Peerpath
              </button>
            </div>
          </div>

          <div className="myprofile-section-card peerpath-badges-box" id="peerpath-section">
            <div className="section-card-top-bar">
              <div className="peer-title-row">
                <Sparkles size={18} className="text-brand-purple" />
                <h3 className="section-main-heading">Peerpath Verified Credentials & Badges</h3>
              </div>
              <button className="btn-secondary-purple-sm" onClick={() => onNavigate('guidance-view')}>
                View Trajectory
              </button>
            </div>

            <p className="peer-subcaption">
              Badges awarded through verified 1:1 sessions with industry leaders. Displayed prominently in Recruiter Talent Search.
            </p>

            <div className="badges-2col-grid">
              <div className="peer-badge-tile">
                <div className="badge-tile-header">
                  <div className="tile-icon-shield">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="badge-pill-gold">TIER-1 VERIFIED</span>
                    <h4 className="badge-role-title">Frontend Architecture & System Design</h4>
                  </div>
                </div>
                <p className="badge-quote-text">
                  "Demonstrated robust understanding of scalable micro-frontends, high-performance UI optimization, and cross-functional product delivery."
                </p>
                <div className="badge-verifier-strip">
                  <img src="/avatars/akash.jpg" alt="Akash Jain" className="v-thumb" />
                  <div>
                    <strong>Akash Jain</strong>
                    <span>Lead Product Manager @ Shine</span>
                  </div>
                </div>
              </div>

              <div className="peer-badge-tile">
                <div className="badge-tile-header">
                  <div className="tile-icon-shield bg-blue-subtle">
                    <ShieldCheck size={20} color="#2563EB" />
                  </div>
                  <div>
                    <span className="badge-pill-blue">VERIFIED BY PEER</span>
                    <h4 className="badge-role-title">FastAPI & Python Microservices Integration</h4>
                  </div>
                </div>
                <p className="badge-quote-text">
                  "Clean API contracts, excellent error-handling, and robust state coordination with backend services."
                </p>
                <div className="badge-verifier-strip">
                  <img src="/avatars/nisha.jpg" alt="Nisha Kumari" className="v-thumb" />
                  <div>
                    <strong>Nisha Kumari</strong>
                    <span>Senior Python Backend & AI Engineer @ Shine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="myprofile-section-card skills-box" id="skills-section">
            <div className="section-card-top-bar">
              <h3 className="section-main-heading">Key Skills</h3>
              <button className="btn-shine-outline-yellow" onClick={() => alert('Add skill modal')}>
                <Plus size={14} /> Add Skills
              </button>
            </div>

            <div className="skills-tags-cluster">
              <span className="skill-bubble primary">React.js <span className="exp-num">4 Yrs</span></span>
              <span className="skill-bubble primary">TypeScript <span className="exp-num">3 Yrs</span></span>
              <span className="skill-bubble primary">Next.js <span className="exp-num">2 Yrs</span></span>
              <span className="skill-bubble">JavaScript (ES6+)</span>
              <span className="skill-bubble">System Design</span>
              <span className="skill-bubble">Redux Toolkit</span>
              <span className="skill-bubble">HTML5 / CSS3 / SCSS</span>
              <span className="skill-bubble">Micro-Frontends</span>
              <span className="skill-bubble">Vite / Webpack</span>
              <span className="skill-bubble">REST APIs</span>
              <span className="skill-bubble">Jest / RTL</span>
            </div>
          </div>

          <div className="myprofile-section-card experience-box" id="experience-section">
            <div className="section-card-top-bar">
              <h3 className="section-main-heading">Work Experience</h3>
              <button className="btn-shine-outline-yellow" onClick={() => alert('Add experience modal')}>
                <Plus size={14} /> Add Experience
              </button>
            </div>

            <div className="experience-timeline">
              <div className="exp-entry">
                <div className="exp-icon-dot">
                  <Briefcase size={16} />
                </div>
                <div className="exp-entry-content">
                  <div className="exp-role-row">
                    <h4 className="exp-job-title">Senior Frontend Engineer</h4>
                    <span className="exp-dates">Mar 2022 — Present (2 yrs 6 mos)</span>
                  </div>
                  <p className="exp-company-text">Tech Innovators Private Limited • Full-time • Bengaluru</p>
                  <p className="exp-desc-text">
                    Leading web UI architecture for customer-facing SaaS products. Responsible for component library design, state management, and performance optimization.
                  </p>
                </div>
              </div>

              <div className="exp-entry">
                <div className="exp-icon-dot">
                  <Briefcase size={16} />
                </div>
                <div className="exp-entry-content">
                  <div className="exp-role-row">
                    <h4 className="exp-job-title">Frontend Software Engineer</h4>
                    <span className="exp-dates">Jun 2020 — Feb 2022 (1 yr 9 mos)</span>
                  </div>
                  <p className="exp-company-text">Web Solutions India • Full-time • Bengaluru</p>
                  <p className="exp-desc-text">
                    Developed cross-browser responsive frontend web pages and SPAs in React, Redux, and modern JavaScript.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="myprofile-section-card education-box" id="education-section">
            <div className="section-card-top-bar">
              <h3 className="section-main-heading">Education</h3>
              <button className="btn-shine-outline-yellow" onClick={() => alert('Add education modal')}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            <div className="edu-entry-item">
              <div className="edu-icon-badge">🎓</div>
              <div>
                <h4 className="edu-degree-title">Bachelor of Technology (B.Tech) - Computer Science & Engineering</h4>
                <p className="edu-univ-name">Visvesvaraya Technological University (VTU)</p>
                <span className="edu-time">2016 — 2020 • Full-time</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {showSummaryModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowSummaryModal(false)}>
          <div className="modal-surface-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>Edit Profile Summary</h3>
            <textarea 
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '13.5px',
                lineHeight: '1.5',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              placeholder="Write a brief professional summary..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn-outline-dark-sm" onClick={() => setShowSummaryModal(false)}>Cancel</button>
              <button className="btn-shine-yellow-solid" onClick={() => { setIsSummarySaved(true); setShowSummaryModal(false); }}>Save Summary</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
