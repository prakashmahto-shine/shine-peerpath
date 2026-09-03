import React, { useState } from 'react';
import { 
  Download, Sparkles, FileText, ArrowRight, 
  Trash2, Star, Upload, ChevronDown, Check, Edit2, Briefcase, 
  Plus, X, Phone, Mail, Calendar, DollarSign, Clock, CheckCircle2,
  GraduationCap, TrendingUp, Zap, User, Video, RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    sessions,
    setActiveSession,
    navigate, 
    updateProfileSummary, 
    addSkill, 
    removeSkill, 
    updateJobSearchStatus 
  } = useApp();

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

  const [showJobStatusModal, setShowJobStatusModal] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    userProfile.jobSearchStatus || 'Actively Looking For Jobs'
  );
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryInput, setSummaryInput] = useState<string>(userProfile.summary);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [showAddSkillInput, setShowAddSkillInput] = useState<boolean>(false);

  // Blue circular arc calculation
  const strokeDashoffset = 314.15 - (314.15 * (userProfile.profileScore / 100));

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileSummary(summaryInput);
    setShowSummaryModal(false);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      addSkill(newSkillInput.trim());
      setNewSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Actively Looking For Jobs' || status === 'Actively looking for jobs') {
      return (
        <img 
          src="https://www.shine.com/next/static/images/nova/activejobs.svg" 
          alt="Actively Looking" 
          className="js-btn-icon" 
        />
      );
    }
    if (status === 'Casually Exploring Jobs' || status === 'Casually exploring opportunities') {
      return (
        <img 
          src="https://www.shine.com/next/static/images/nova/casualjobs.svg" 
          alt="Casually Exploring" 
          className="js-btn-icon" 
        />
      );
    }
    if (status === 'Not Looking For Jobs') {
      return (
        <img 
          src="https://www.shine.com/next/static/images/nova/notactivejobs.svg" 
          alt="Not Looking" 
          className="js-btn-icon" 
        />
      );
    }
    return (
      <img 
        src="https://www.shine.com/next/static/images/nova/activejobs.svg" 
        alt="Status" 
        className="js-btn-icon" 
      />
    );
  };

  return (
    <div className="content-wrapper shine-official-myprofile-page">
      
      <div className="myprofile-layout-2col">
        
        {/* Left Column: Floating Profile Card */}
        <div className="myprofile-left-col">
          <div className="myprofile-card prod-profile-overview-card">
            <span className="updated-today-pill">Updated today</span>

            {/* Blue Circular Arc Meter */}
            <div className="prod-profile-gauge-box">
              <svg className="prod-gauge-circle-svg" viewBox="0 0 120 120">
                <circle 
                  className="gauge-track-bg" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                />
                <circle 
                  className="gauge-blue-fill" 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  strokeDasharray="314.15" 
                  strokeDashoffset={strokeDashoffset} 
                />
              </svg>
              
              <div className="prod-avatar-inner-wrap">
                <img 
                  src="/avatars/prakash.jpg" 
                  alt={userProfile.name} 
                  className="prod-user-avatar-img"
                />
              </div>

              <div className="prod-gauge-score-badge">{userProfile.profileScore}%</div>
            </div>

            <h2 className="prod-user-fullname">{userProfile.name || 'Prakash Kumar'}</h2>
            <p className="prod-user-designation-sub">Senior frontend developer</p>

            {/* Hook 1: Visual & Easy-to-Understand Salary Jump Card */}
            <div className="profile-salary-unlock-cta" onClick={() => navigate('guidance-view')}>
              <div className="psu-header-row">
                <span className="psu-tag-chip">
                  <TrendingUp size={12} /> SALARY GROWTH PATH
                </span>
                <span className="psu-growth-badge">+3x Jump</span>
              </div>

              <div className="psu-salary-compare-row">
                <div className="psu-col">
                  <span className="psu-col-label">Current</span>
                  <strong className="psu-col-val">₹5.5L</strong>
                </div>

                <div className="psu-arrow-track">
                  <span className="psu-arrow-symbol">➔</span>
                </div>

                <div className="psu-col psu-col-target">
                  <span className="psu-col-label">Target</span>
                  <strong className="psu-col-val text-emerald-600">₹24L+</strong>
                </div>
              </div>

              <p className="psu-simple-desc">
                Your foundation is strong! Add 2 booster skills to unlock ₹24L+ roles.
              </p>

              <div className="psu-link-button">
                <span>See How to Get ₹24L</span>
                <ArrowRight size={13} />
              </div>
            </div>

            <div className="profile-card-dashed-divider"></div>

            {/* Job Search Status Button -> Opens Production Popup Modal */}
            <div className="job-status-dropdown-wrap">
              <button 
                type="button"
                className="btn-prod-job-status"
                onClick={() => {
                  setSelectedStatus(userProfile.jobSearchStatus || 'Actively Looking For Jobs');
                  setShowJobStatusModal(true);
                }}
              >
                <div className="btn-prod-js-left">
                  {getStatusIcon(userProfile.jobSearchStatus || 'Actively Looking For Jobs')}
                  <span>{userProfile.jobSearchStatus || 'Set Your Current Job Search Status'}</span>
                </div>
                <ChevronDown size={15} className="btn-prod-js-arrow" />
              </button>
            </div>
          </div>

          {/* Left Column Navigation List */}
          <div className="myprofile-card prod-side-nav-card">
            <button className="prod-side-nav-btn active">
              <User size={15} /> <span>My Profile</span>
            </button>
            
            <button className="prod-side-nav-btn" onClick={() => navigate('sessions-view')}>
              <Video size={15} className="text-purple-600" /> 
              <span>My Mentorship Sessions</span>
              {upcomingSessions.length > 0 && (
                <span className="prod-side-badge-count">{upcomingSessions.length}</span>
              )}
            </button>
            
            <button className="prod-side-nav-btn" onClick={() => navigate('guidance-view')}>
              <Sparkles size={15} className="text-amber-500" /> 
              <span>Career Roadmap (Peerpath)</span>
            </button>
            
            <button className="prod-side-nav-btn" onClick={() => navigate('experts-view')}>
              <TrendingUp size={15} className="text-blue-500" /> 
              <span>Explore Verified Mentors</span>
            </button>
          </div>

        </div>

        {/* Right Column: Exact Production Cards */}
        <div className="myprofile-right-col">
          
          {/* Card: Active Mentorship Sessions Widget (High Visibility) */}
          {upcomingSessions.length > 0 && (
            <div className="myprofile-card prod-sessions-widget-card">
              <div className="prod-card-top-row">
                <div className="ps-widget-title-row">
                  <div className="ps-icon-circle"><Video size={16} /></div>
                  <div>
                    <h3 className="prod-card-title">Active 1:1 Mentorship Sessions ({upcomingSessions.length})</h3>
                    <span className="ps-sub-hint">Scheduled live guidance calls with verified tech leaders</span>
                  </div>
                </div>
                <button className="btn-text-arrow" onClick={() => navigate('sessions-view')}>
                  View All Sessions <ArrowRight size={14} />
                </button>
              </div>

              <div className="ps-widget-list">
                {upcomingSessions.slice(0, 2).map((sess) => (
                  <div key={sess.id} className="ps-widget-item">
                    <div className="ps-widget-left">
                      <img src={sess.expert.avatar} alt={sess.expert.name} className="ps-widget-avatar" />
                      <div>
                        <div className="ps-name-tag-row">
                          <strong className="ps-mentor-name">{sess.expert.name}</strong>
                          <span className="ps-live-ready-badge"><span className="pulse-dot"></span> Confirmed & Ready</span>
                        </div>
                        <p className="ps-role-text">{sess.expert.role} • {sess.expert.company}</p>
                        <div className="ps-time-chip">
                          <Clock size={12} /> {sess.date} at {sess.timeSlot}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ps-widget-actions">
                      <button 
                        type="button"
                        className="btn-reschedule-action"
                        onClick={() => navigate('sessions-view')}
                        title="Reschedule or Cancel this session"
                      >
                        <RotateCcw size={13} />
                        <span>Reschedule / Cancel</span>
                      </button>
                      
                      <button 
                        type="button"
                        className="btn-join-call-prominent"
                        onClick={() => {
                          setActiveSession(sess);
                          navigate('live-call-view');
                        }}
                      >
                        <span className="live-cam-pulse-dot"></span>
                        <Video size={14} />
                        <span>Join Video Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 1: Resume */}
          <div className="myprofile-card prod-resume-card">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Resume</h3>
              <button className="btn-prod-upload-resume" onClick={() => alert('Select resume to upload')}>
                <Upload size={14} /> Upload
              </button>
            </div>

            <div className="prod-resume-item-row">
              <div className="res-details-left">
                <strong className="res-file-name">Prakash-Mahto1.pdf</strong>
                <div className="res-sub-meta">
                  <span>Uploaded: 26/06/2026</span>
                  <span className="res-default-blue-chip">Default</span>
                </div>
              </div>

              <div className="res-actions-right-icons">
                <button className="res-action-circle-btn" title="Download" onClick={() => alert('Downloading resume...')}>
                  <Download size={15} />
                </button>
                <button className="res-action-circle-btn star-gold-btn" title="Set as default">
                  <Star size={15} fill="#EAB308" color="#EAB308" />
                </button>
                <button className="res-action-circle-btn" title="Delete" onClick={() => alert('Cannot delete default resume')}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Hook 2 - Motivating Headline B + Subtext A Banner */}
          <div className="prod-ats-score-banner" onClick={() => navigate('guidance-view')}>
            <div className="ats-banner-left">
              <div className="ats-illustration-box">
                🚀
              </div>
              <div className="ats-text-group">
                <div className="ats-tag-row">
                  <span className="ats-hot-tag">70% READY</span>
                  <span className="ats-salary-tag">₹24 LPA Target</span>
                </div>
                <h3 className="ats-title">You’re Ready for Your Next Big Salary Jump: ₹24 Lakhs</h3>
                <p className="ats-subtitle">Your profile is already 70% ready with strong core skills. Add just 1–2 booster skills to get shortlisted by top companies (Swiggy, Razorpay).</p>
              </div>
            </div>

            <button className="btn-check-resume-score" onClick={() => navigate('guidance-view')}>
              See How to Get ₹24L ➔
            </button>
          </div>

          {/* Card 3: Work Profile */}
          <div className="myprofile-card prod-work-profile-card">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Work Profile</h3>
              <button className="btn-edit-gold-square" onClick={() => { setSummaryInput(userProfile.summary); setShowSummaryModal(true); }}>
                <Edit2 size={15} />
              </button>
            </div>

            <div className="prod-work-profile-grid">
              <div className="wp-item-row">
                <Briefcase size={16} className="wp-icon" />
                <span>Senior frontend developer</span>
              </div>

              <div className="wp-item-row">
                <Clock size={16} className="wp-icon" />
                <span>2+ Months</span>
              </div>

              <div className="wp-item-row">
                <DollarSign size={16} className="wp-icon" />
                <span>5.5 LPA</span>
              </div>

              <div className="wp-item-row">
                <Phone size={16} className="wp-icon" />
                <span>+91 7042653680</span>
                <CheckCircle2 size={14} className="verified-green-check" />
              </div>

              <div className="wp-item-row">
                <Calendar size={16} className="wp-icon" />
                <span>3 yrs 6 Months</span>
              </div>

              <div className="wp-item-row">
                <Mail size={16} className="wp-icon" />
                <span>prakashkr806@gmail.com</span>
                <CheckCircle2 size={14} className="verified-green-check" />
              </div>
            </div>

            {/* Hook 3: Peer Transition Proof Callout inside Work Profile */}
            <div className="work-profile-peerpath-callout" onClick={() => navigate('guidance-view')}>
              <div className="wpc-avatars">
                <img src="/avatars/saheli.jpg" alt="Saheli" />
                <img src="/avatars/akash.jpg" alt="Akash" />
              </div>
              <div className="wpc-text">
                <strong>Candidates with your profile jumped from ₹5.5L to ₹26L</strong>
                <span>See what skills they learned and how they got hired.</span>
              </div>
              <button className="btn-wpc-arrow" onClick={() => navigate('guidance-view')}>
                See How ➔
              </button>
            </div>
          </div>

          {/* Card 4: Employment History */}
          <div className="myprofile-card prod-employment-card">
            <div className="prod-card-top-row">
              <div></div>
              <span className="boost-green-chip">↑ 15%</span>
            </div>

            <div className="employment-center-content">
              <div className="emp-briefcase-3d-icon">
                💼
              </div>
              <h3 className="emp-main-title">Employment History</h3>
              <p className="emp-caption">Your past roles and organizations details help recruiters understand your expertise.</p>
              <button className="btn-prod-add-gold" onClick={() => alert('Add past organization details')}>
                + Add
              </button>
            </div>
          </div>

          {/* Card 5: Key Skills (Exact List Row Style) */}
          <div className="myprofile-card prod-key-skills-card" id="skills-section">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Key Skills</h3>
              <div className="skills-header-actions-row">
                <button className="btn-prod-upload-resume" onClick={() => setShowAddSkillInput(true)}>
                  Add
                </button>
                <button className="btn-edit-gold-square" onClick={() => setShowAddSkillInput(!showAddSkillInput)}>
                  <Edit2 size={14} />
                </button>
              </div>
            </div>

            {showAddSkillInput && (
              <form className="add-skill-inline-form" onSubmit={handleAddSkillSubmit} style={{ marginBottom: '14px' }}>
                <input 
                  type="text" 
                  placeholder="Enter skill name (e.g. Node.js, React.js, GraphQL)..." 
                  value={newSkillInput} 
                  onChange={(e) => setNewSkillInput(e.target.value)} 
                  autoFocus 
                  className="add-skill-input"
                />
                <button type="submit" className="btn-shine-gold-sm">Add</button>
                <button type="button" className="btn-ghost-sm" onClick={() => setShowAddSkillInput(false)}>Cancel</button>
              </form>
            )}

            <div className="prod-skills-rows-list">
              {userProfile.skills.map((sk, idx) => (
                <div key={idx} className="prod-skill-item-row">
                  <span className="skill-name-text">{sk}</span>
                  <button 
                    type="button" 
                    className="btn-remove-skill-trash" 
                    onClick={() => removeSkill(sk)}
                    title={`Remove ${sk}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Stand Out with Assessment Banner */}
          <div className="prod-standout-assessment-banner">
            <div className="standout-left-group">
              <div className="standout-photo-wrap">
                <img 
                  src="https://www.shine.com/next/static/images/nova/skill-assesment-illustration.svg" 
                  alt="Skill Assessment" 
                  className="standout-avatar-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="standout-text-group">
                <h3 className="standout-title">Stand Out with Assessment</h3>
                <p className="standout-subtitle">Show employers what sets you apart.</p>
              </div>
            </div>

            <button className="btn-take-assessment" onClick={() => navigate('guidance-view')}>
              Take Assessment
            </button>
          </div>

          {/* Card 7: Education */}
          <div className="myprofile-card prod-education-card">
            <div className="prod-card-top-row">
              <h3 className="prod-card-title">Education</h3>
              <button className="btn-prod-upload-resume" onClick={() => alert('Add education details')}>
                Add
              </button>
            </div>

            <div className="prod-education-item-row">
              <div className="edu-left-details">
                <strong className="edu-degree-title">B.Tech / B.E - Computers</strong>
                <p className="edu-college-name">Jaipur Engineering College And Research Centre Rajasthan Technical University</p>
              </div>
              <button className="btn-edit-gold-square" onClick={() => alert('Edit education details')}>
                <Edit2 size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 1. Official Set Your Job Status Modal Dialog */}
      {showJobStatusModal && (
        <div className="modal-backdrop-blur">
          <div className="job-status-modal-surface">
            <div className="job-status-modal-header">
              <h3 className="js-modal-title">Set Your Job Status</h3>
              <button 
                type="button"
                className="btn-icon-close" 
                onClick={() => setShowJobStatusModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="job-status-modal-body">
              
              {/* Option 1: Actively Looking For Jobs */}
              <div 
                className={`job-status-option-card ${selectedStatus === 'Actively Looking For Jobs' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('Actively Looking For Jobs')}
              >
                <div className="js-opt-left">
                  <div className="js-opt-icon-wrap">
                    <img 
                      src="https://www.shine.com/next/static/images/nova/activejobs.svg" 
                      alt="Actively Looking" 
                    />
                  </div>
                  <div className="js-opt-text">
                    <strong className="js-opt-title">Actively Looking For Jobs</strong>
                    <p className="js-opt-sub">I'm open to being reached out by recruiters</p>
                  </div>
                </div>
                <div className="js-radio-circle">
                  {selectedStatus === 'Actively Looking For Jobs' && <div className="js-radio-inner" />}
                </div>
              </div>

              {/* Option 2: Casually Exploring Jobs */}
              <div 
                className={`job-status-option-card ${selectedStatus === 'Casually Exploring Jobs' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('Casually Exploring Jobs')}
              >
                <div className="js-opt-left">
                  <div className="js-opt-icon-wrap">
                    <img 
                      src="https://www.shine.com/next/static/images/nova/casualjobs.svg" 
                      alt="Casually Exploring" 
                    />
                  </div>
                  <div className="js-opt-text">
                    <strong className="js-opt-title">Casually Exploring Jobs</strong>
                    <p className="js-opt-sub">Apply at your own pace with being approached by recruiters</p>
                  </div>
                </div>
                <div className="js-radio-circle">
                  {selectedStatus === 'Casually Exploring Jobs' && <div className="js-radio-inner" />}
                </div>
              </div>

              {/* Option 3: Not Looking For Jobs */}
              <div 
                className={`job-status-option-card ${selectedStatus === 'Not Looking For Jobs' ? 'selected' : ''}`}
                onClick={() => setSelectedStatus('Not Looking For Jobs')}
              >
                <div className="js-opt-left">
                  <div className="js-opt-icon-wrap">
                    <img 
                      src="https://www.shine.com/next/static/images/nova/notactivejobs.svg" 
                      alt="Not Looking" 
                    />
                  </div>
                  <div className="js-opt-text">
                    <strong className="js-opt-title">Not Looking For Jobs</strong>
                    <p className="js-opt-sub">You are not active in the job market at the moment</p>
                  </div>
                </div>
                <div className="js-radio-circle">
                  {selectedStatus === 'Not Looking For Jobs' && <div className="js-radio-inner" />}
                </div>
              </div>

            </div>

            <div className="job-status-modal-footer">
              <button 
                type="button" 
                className="btn-set-job-status-now"
                onClick={() => {
                  updateJobSearchStatus(selectedStatus);
                  setShowJobStatusModal(false);
                }}
              >
                Set Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Summary Edit Modal */}
      {showSummaryModal && (
        <div className="modal-backdrop-blur">
          <div className="modal-surface-card" style={{ maxWidth: '600px' }}>
            <div className="modal-top-header">
              <h3>Edit Profile Summary</h3>
              <button className="btn-icon-close" onClick={() => setShowSummaryModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveSummary}>
              <div className="modal-body-pad">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Highlight your key technical achievements and career aspirations:
                </label>
                <textarea 
                  value={summaryInput} 
                  onChange={(e) => setSummaryInput(e.target.value)} 
                  rows={5}
                  className="custom-textarea"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                />
              </div>
              <div className="modal-footer-flex">
                <button type="button" className="btn-ghost-sm" onClick={() => setShowSummaryModal(false)}>Cancel</button>
                <button type="submit" className="btn-shine-gold-sm">Save & Boost Score (+5%)</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
