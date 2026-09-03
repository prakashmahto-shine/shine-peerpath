import React, { useState } from 'react';
import { 
  Download, Sparkles, FileText, ArrowRight, 
  Trash2, Star, Upload, ChevronDown, Check, Edit2, Briefcase, 
  Plus, X, Phone, Mail, Calendar, DollarSign, Clock, CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    navigate, 
    updateProfileSummary, 
    addSkill, 
    removeSkill, 
    updateJobSearchStatus 
  } = useApp();

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
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

            <div className="profile-card-dashed-divider"></div>

            {/* Job Search Status Dropdown */}
            <div className="job-status-dropdown-wrap">
              <button 
                type="button"
                className="btn-prod-job-status"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span>{userProfile.jobSearchStatus || 'Set Your Current Job Search Status'}</span>
                <ChevronDown size={15} />
              </button>

              {isStatusDropdownOpen && (
                <div className="job-status-menu">
                  <div 
                    className={`status-option ${userProfile.jobSearchStatus === 'Actively looking for jobs' ? 'selected' : ''}`}
                    onClick={() => { updateJobSearchStatus('Actively looking for jobs'); setIsStatusDropdownOpen(false); }}
                  >
                    🟢 Actively looking for jobs (Immediate)
                  </div>
                  <div 
                    className={`status-option ${userProfile.jobSearchStatus === 'Serving Notice Period (30 Days)' ? 'selected' : ''}`}
                    onClick={() => { updateJobSearchStatus('Serving Notice Period (30 Days)'); setIsStatusDropdownOpen(false); }}
                  >
                    🟡 Serving Notice Period (30 Days)
                  </div>
                  <div 
                    className={`status-option ${userProfile.jobSearchStatus === 'Casually exploring opportunities' ? 'selected' : ''}`}
                    onClick={() => { updateJobSearchStatus('Casually exploring opportunities'); setIsStatusDropdownOpen(false); }}
                  >
                    ⚪ Casually exploring opportunities
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Exact Production Cards */}
        <div className="myprofile-right-col">
          
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

          {/* Card 2: "Is Your Resume Good Enough?" (ATS Score Banner) */}
          <div className="prod-ats-score-banner">
            <div className="ats-banner-left">
              <div className="ats-illustration-box">
                📊
              </div>
              <div className="ats-text-group">
                <h3 className="ats-title">Is Your Resume Good Enough?</h3>
                <p className="ats-subtitle">Check & see your resume ATS scores & optimize it</p>
              </div>
            </div>

            <button className="btn-check-resume-score" onClick={() => navigate('guidance-view')}>
              Check Resume Score
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
                    // Fallback to avatar if SVG path isn't local
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

      {/* Summary Edit Modal */}
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
