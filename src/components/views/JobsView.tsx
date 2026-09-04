import React, { useState, useMemo } from 'react';
import { 
  Briefcase, MapPin, Clock, Share2, Bookmark, ArrowRight, Check, 
  Edit3, Filter, ArrowUpDown, ChevronDown, Search, X
} from 'lucide-react';
import { ViewType } from '../../types';
import { useApp } from '../../context/AppContext';

export interface ShineJobListing {
  id: string;
  title: string;
  company: string;
  companyInitials?: string;
  companyColor?: string;
  postedTime: string;
  exp: string;
  salary: string;
  loc: string;
  requiredSkills: string[];
  isActivelyHiring?: boolean;
  isEarlyApplicant?: boolean;
}

const SHINE_JOBS_SRP_DB: ShineJobListing[] = [
  {
    id: 'srp-job-1',
    title: 'Senior React / Java Developer',
    company: 'IQuest Management Consultants Pvt Ltd.',
    companyInitials: 'IM',
    companyColor: '#C026D3', // Magenta square from screenshot
    postedTime: '3 days ago',
    exp: '5 to 10 Yrs',
    salary: '5 – 12 Lakh/Yr',
    loc: 'Pune',
    requiredSkills: ['react.js', 'java', 'sql'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-2',
    title: 'AWS Java Full Stack Developer',
    company: 'SP Staffing Services Private Limited Hiring For Leading MNC Company',
    companyInitials: 'SS',
    companyColor: '#7C3AED', // Purple square from screenshot
    postedTime: '4 days ago',
    exp: '8 to 12 Yrs',
    salary: '26 – 38 Lakh/Yr',
    loc: 'Chennai, Hyderabad, Pune, Delhi, Kochi, Gurugram, Kolkata, Noida, Bangalore',
    requiredSkills: ['java', 'spring boot', 'core java', 'aws'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-3',
    title: 'Java Fullstack Developer',
    company: 'HARJAI COMPUTERS PRIVATE LIMITED',
    postedTime: '1 week ago',
    exp: '3 to 6 Yrs',
    salary: '1.5 – 4.5 Lakh/Yr',
    loc: 'Mumbai City',
    requiredSkills: ['java', 'postgresql', 'react.js', 'springboot'],
    isActivelyHiring: true,
    isEarlyApplicant: false
  },
  {
    id: 'srp-job-4',
    title: 'Java Full Stack/ Spring Boot Developer 6PlusYrs Blore Chennai Pune',
    company: 'WHITE HORSE MANPOWER CONSULTANCY (P) LTD',
    companyInitials: 'WH',
    companyColor: '#0284C7',
    postedTime: '1 month ago',
    exp: '6 to 11 Yrs',
    salary: '10 – 14 Lakh/Yr',
    loc: 'Chennai, Pune',
    requiredSkills: ['java', 'spring boot', 'microservices', 'hibernate'],
    isActivelyHiring: true,
    isEarlyApplicant: false
  },
  {
    id: 'srp-job-5',
    title: 'Lead UI & Micro-Frontend Architect',
    company: 'Swiggy Tech Labs',
    companyInitials: 'SW',
    companyColor: '#FC8019',
    postedTime: '1 day ago',
    exp: '4 to 8 Yrs',
    salary: '26 – 35 Lakh/Yr',
    loc: 'Bengaluru / Hybrid',
    requiredSkills: ['react.js', 'micro-frontends', 'module federation', 'typescript'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-6',
    title: 'Staff UI Platform Architect',
    company: 'Razorpay Fintech Technologies',
    companyInitials: 'RZ',
    companyColor: '#0C2340',
    postedTime: '18 hours ago',
    exp: '5 to 9 Yrs',
    salary: '28 – 38 Lakh/Yr',
    loc: 'Remote / Bengaluru',
    requiredSkills: ['react.js', 'component architecture', 'micro-frontends', 'rest apis'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-7',
    title: 'Lead Technical Product Manager',
    company: 'Shine (HT Media Group)',
    companyInitials: 'SH',
    companyColor: '#1E3A8A',
    postedTime: '2 days ago',
    exp: '5 to 9 Yrs',
    salary: '28 – 38 Lakh/Yr',
    loc: 'Gurugram / Hybrid',
    requiredSkills: ['prd discovery', 'product metrics', 'tech scoping', 'growth funnels'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-8',
    title: 'Principal Search & Solr Database Cloud Architect',
    company: 'Adobe Systems India',
    companyInitials: 'AD',
    companyColor: '#E11D48',
    postedTime: '2 days ago',
    exp: '7 to 12 Yrs',
    salary: '38 – 50 Lakh/Yr',
    loc: 'Noida / Remote',
    requiredSkills: ['apache solr', 'lucene engine', 'sub-10ms query optimization', 'rest apis'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  }
];

interface JobsViewProps {
  onNavigate: (view: ViewType) => void;
  onSelectExpert?: (expertId: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  onNavigate,
  onSelectExpert: _onSelectExpert
}) => {
  const { 
    userProfile, 
    addSkill, 
    showToast, 
    peerpathJobContext, 
    clearPeerpathJobContext 
  } = useApp();
  
  const [showEditSearch, setShowEditSearch] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [selectedLocFilter, setSelectedLocFilter] = useState<string>('all');
  
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});
  const [savedJobIds, setSavedJobIds] = useState<Record<string, boolean>>({});

  // Booster skill requirement calculation when coming from Peerpath CTA
  const requiredBoosterSkills = useMemo(() => {
    return peerpathJobContext?.requiredBoosterSkills || [];
  }, [peerpathJobContext]);

  const missingBoosterSkills = useMemo(() => {
    if (!peerpathJobContext?.isFromPeerpath || requiredBoosterSkills.length === 0) {
      return [];
    }
    const currentSkills = (userProfile.skills || []).map(s => s.toLowerCase());
    return requiredBoosterSkills.filter(reqSkill => {
      const rLower = reqSkill.toLowerCase();
      return !currentSkills.some(s => 
        s.includes(rLower) || 
        rLower.includes(s) || 
        s.replace(/[^a-z0-9]/g, '') === rLower.replace(/[^a-z0-9]/g, '')
      );
    });
  }, [peerpathJobContext, requiredBoosterSkills, userProfile.skills]);

  const isEligibleFromPeerpath = Boolean(
    peerpathJobContext?.isFromPeerpath && missingBoosterSkills.length === 0
  );

  const filteredJobs = useMemo(() => {
    let list = [...SHINE_JOBS_SRP_DB];

    // If coming from Peerpath trajectory, prioritize relevant high-salary role cards on top
    if (peerpathJobContext?.isFromPeerpath) {
      const trackKey = peerpathJobContext.trackKey;
      if (trackKey === 'arch') {
        list.sort((a, b) => {
          const aMatch = a.requiredSkills.includes('micro-frontends') ? -1 : 1;
          const bMatch = b.requiredSkills.includes('micro-frontends') ? -1 : 1;
          return aMatch - bMatch;
        });
      } else if (trackKey === 'pm') {
        list.sort((a, b) => {
          const aMatch = a.requiredSkills.includes('prd discovery') ? -1 : 1;
          const bMatch = b.requiredSkills.includes('prd discovery') ? -1 : 1;
          return aMatch - bMatch;
        });
      } else if (trackKey === 'search') {
        list.sort((a, b) => {
          const aMatch = a.requiredSkills.includes('apache solr') ? -1 : 1;
          const bMatch = b.requiredSkills.includes('apache solr') ? -1 : 1;
          return aMatch - bMatch;
        });
      }
    }

    return list.filter(job => {
      if (selectedLocFilter !== 'all' && !job.loc.toLowerCase().includes(selectedLocFilter.toLowerCase())) {
        return false;
      }
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchSkills = job.requiredSkills.some(s => s.toLowerCase().includes(query));
        if (!matchTitle && !matchCompany && !matchSkills) return false;
      }
      return true;
    });
  }, [selectedLocFilter, searchKeyword, peerpathJobContext]);

  const handleApply = (job: ShineJobListing) => {
    setAppliedJobIds(prev => ({ ...prev, [job.id]: true }));
    showToast(
      `Applied to ${job.company}!`,
      `Your Shine profile was sent to the recruiter.`,
      'success'
    );
  };

  const handleSave = (job: ShineJobListing) => {
    const nextState = !savedJobIds[job.id];
    setSavedJobIds(prev => ({ ...prev, [job.id]: nextState }));
    showToast(
      nextState ? `Job Saved!` : `Job Removed`,
      `${job.title}`,
      'info'
    );
  };

  const handleShare = (job: ShineJobListing) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Link Copied!`, `Share ${job.title}`, 'info');
  };

  const handleQuickAddSkills = () => {
    missingBoosterSkills.forEach(skill => {
      addSkill(skill);
    });
    showToast(
      'Skills Added to Profile! 🚀',
      `Added ${missingBoosterSkills.join(' & ')} to your profile. You are now 100% eligible for recruiter shortlist!`,
      'success'
    );
  };

  const handleGoToProfileSkills = () => {
    onNavigate('profile-view');
    setTimeout(() => {
      const el = document.getElementById('skills-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-section-pulse');
        setTimeout(() => el.classList.remove('highlight-section-pulse'), 2500);
      }
    }, 120);
  };

  return (
    <div className="shine-srp-clean-page">
      
      {/* Top Sub-Action Bar (Exact 1:1 match to Shine SRP Image 2) */}
      <div className="shine-srp-subbar">
        <div className="srp-clean-container srp-subbar-row">
          
          {/* Left: Edit Search button */}
          <button 
            type="button" 
            className="srp-pill-btn srp-btn-edit"
            onClick={() => setShowEditSearch(!showEditSearch)}
          >
            <Edit3 size={13} className="mr-1.5" />
            <span>Edit search</span>
          </button>

          {/* Right: Sort & Filter buttons */}
          <div className="srp-subbar-right">
            <button 
              type="button" 
              className="srp-pill-btn srp-btn-sort"
              onClick={() => setSortBy(sortBy === 'relevance' ? 'date' : 'relevance')}
            >
              <ArrowUpDown size={13} className="mr-1.5 text-slate-500" />
              <span>Sort: <strong>{sortBy === 'relevance' ? 'Relevance' : 'Recent'}</strong></span>
              <ChevronDown size={13} className="ml-1 text-slate-400" />
            </button>

            <button 
              type="button" 
              className={`srp-pill-btn srp-btn-filter ${showFilterDropdown ? 'active' : ''}`}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={13} className="mr-1.5 text-slate-500" />
              <span>Filter</span>
            </button>
          </div>

        </div>

        {/* Collapsible Edit Search Bar if opened */}
        {showEditSearch && (
          <div className="srp-clean-container srp-edit-search-drawer">
            <div className="srp-drawer-inner">
              <input 
                type="text" 
                placeholder="Search by Job Title, Skill or Company (e.g. Java, React, Pune)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="srp-inline-search-input"
                autoFocus
              />
              {searchKeyword && (
                <button 
                  type="button" 
                  className="srp-clear-btn" 
                  onClick={() => setSearchKeyword('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Filter Bar if opened */}
        {showFilterDropdown && (
          <div className="srp-clean-container srp-filters-drawer">
            <div className="srp-filter-chips">
              <span className="srp-filter-label">Location:</span>
              <button 
                type="button" 
                className={`srp-filter-chip ${selectedLocFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedLocFilter('all')}
              >
                All
              </button>
              <button 
                type="button" 
                className={`srp-filter-chip ${selectedLocFilter === 'Pune' ? 'active' : ''}`}
                onClick={() => setSelectedLocFilter('Pune')}
              >
                Pune
              </button>
              <button 
                type="button" 
                className={`srp-filter-chip ${selectedLocFilter === 'Bengaluru' ? 'active' : ''}`}
                onClick={() => setSelectedLocFilter('Bengaluru')}
              >
                Bengaluru
              </button>
              <button 
                type="button" 
                className={`srp-filter-chip ${selectedLocFilter === 'Chennai' ? 'active' : ''}`}
                onClick={() => setSelectedLocFilter('Chennai')}
              >
                Chennai
              </button>
              <button 
                type="button" 
                className={`srp-filter-chip ${selectedLocFilter === 'Mumbai' ? 'active' : ''}`}
                onClick={() => setSelectedLocFilter('Mumbai')}
              >
                Mumbai
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONDITIONAL PEERPATH ELIGIBILITY BANNER (Only shows when navigating from Peerpath CTA) */}
      {peerpathJobContext?.isFromPeerpath && (
        <div className="srp-clean-container srp-peerpath-banner-wrapper">
          {missingBoosterSkills.length > 0 ? (
            /* Warning / Eligibility Gating Banner */
            <div className="srp-peerpath-eligibility-card srp-eligibility-warning">
              <div className="spe-card-header">
                <div className="spe-pill-wrap">
                  <span className="spe-track-badge">
                    <Briefcase size={12} className="mr-1 text-purple-600" />
                    PEERPATH MATCH: {peerpathJobContext.trackTitle.toUpperCase()}
                  </span>
                  <span className="spe-target-pkg">{peerpathJobContext.targetPackage}</span>
                </div>
                <button 
                  type="button" 
                  className="spe-btn-close" 
                  onClick={clearPeerpathJobContext}
                  title="Close Peerpath filter & view normal search"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="spe-body">
                <div className="spe-main-content">
                  <h3 className="spe-title">
                    ⚠️ In jobs pe tabhi eligible hai jab aap in {missingBoosterSkills.length} skills ko profile me update karenge
                  </h3>
                  <div className="spe-missing-chips">
                    <span className="spe-req-label">Required Booster Skills:</span>
                    {missingBoosterSkills.map((skillName, idx) => (
                      <span key={idx} className="spe-missing-chip">
                        + {skillName}
                      </span>
                    ))}
                  </div>
                  <p className="spe-desc">
                    Recruiters at Swiggy, Razorpay & Adobe filter applicants with these {missingBoosterSkills.length} booster skills. Update your profile to qualify for 1-click recruiter shortlisting.
                  </p>
                </div>

                <div className="spe-actions-column">
                  <button 
                    type="button" 
                    className="btn-spe-add-now"
                    onClick={handleQuickAddSkills}
                  >
                    <span>+ Add {missingBoosterSkills.length} Skills to Profile</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-spe-profile-link"
                    onClick={handleGoToProfileSkills}
                  >
                    <span>Update in Profile Page ➔</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Success / 100% Eligible Banner */
            <div className="srp-peerpath-eligibility-card srp-eligibility-success">
              <div className="spe-card-header">
                <div className="spe-pill-wrap">
                  <span className="spe-track-badge spe-badge-green">
                    <Check size={13} strokeWidth={3} className="mr-1 text-emerald-700" />
                    100% ELIGIBLE FOR SHORTLISTING
                  </span>
                  <span className="spe-target-pkg spe-pkg-green">{peerpathJobContext.targetPackage}</span>
                </div>
                <button 
                  type="button" 
                  className="spe-btn-close" 
                  onClick={clearPeerpathJobContext}
                  title="Close filter"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="spe-body">
                <div className="spe-main-content">
                  <h3 className="spe-title text-emerald-900">
                    🎉 Great! Your profile has all verified skills required for {peerpathJobContext.trackTitle} roles.
                  </h3>
                  <p className="spe-desc text-emerald-800">
                    Skills ({peerpathJobContext.requiredBoosterSkills.join(' & ')}) are updated on your profile. Apply below to be shortlisted directly!
                  </p>
                </div>
                <div className="spe-actions-column">
                  <button 
                    type="button" 
                    className="btn-spe-view-all"
                    onClick={clearPeerpathJobContext}
                  >
                    <span>View Standard Shine Jobs</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Jobs Feed List (Exact 1:1 match to Screenshot Cards) */}
      <div className="srp-clean-container srp-cards-stack">
        {filteredJobs.map((job) => {
          const isApplied = Boolean(appliedJobIds[job.id]);
          const isSaved = Boolean(savedJobIds[job.id]);

          return (
            <div key={job.id} className="srp-job-card-official">
              
              {/* Top Row: Company Logo Badge + Company Name + Posted Date + Status Badges */}
              <div className="sjc-top-row">
                <div className="sjc-company-info">
                  {job.companyInitials && (
                    <div 
                      className="sjc-initials-badge" 
                      style={{ backgroundColor: job.companyColor || '#7C3AED' }}
                    >
                      {job.companyInitials}
                    </div>
                  )}
                  <span className="sjc-company-name">{job.company}</span>
                  <span className="sjc-dot-sep">•</span>
                  <span className="sjc-posted-time">{job.postedTime}</span>
                </div>

                <div className="sjc-badges-wrap">
                  {job.isActivelyHiring && (
                    <span className="sjc-badge-actively-hiring">Actively Hiring</span>
                  )}
                  {job.isEarlyApplicant && (
                    <span className="sjc-badge-early-applicant">Be An Early Applicant</span>
                  )}
                </div>
              </div>

              {/* Row 2: Big Bold Job Title */}
              <h2 className="sjc-title">
                {job.title}
              </h2>

              {/* Row 3: Metadata (Exp • Salary • Location) */}
              <div className="sjc-meta-row">
                <div className="sjc-meta-item">
                  <Briefcase size={14} className="sjc-icon" />
                  <span>{job.exp}</span>
                </div>
                <span className="sjc-dot-sep">•</span>
                <div className="sjc-meta-item">
                  <Clock size={14} className="sjc-icon" />
                  <span>{job.salary}</span>
                </div>
                <span className="sjc-dot-sep">•</span>
                <div className="sjc-meta-item">
                  <MapPin size={14} className="sjc-icon" />
                  <span>{job.loc}</span>
                </div>
              </div>

              {/* Row 4: Required Skills (Left) + Action Buttons (Right) */}
              <div className="sjc-bottom-row">
                <div className="sjc-skills-block">
                  <span className="sjc-required-text">Required:</span>
                  <div className="sjc-skills-tags">
                    {job.requiredSkills.map((skill, idx) => {
                      const isBoosterMatch = peerpathJobContext?.isFromPeerpath && 
                        requiredBoosterSkills.some(bs => bs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(bs.toLowerCase()));
                      
                      return (
                        <React.Fragment key={idx}>
                          <strong className={`sjc-skill-name ${isBoosterMatch ? 'sjc-skill-booster-highlight' : ''}`}>
                            {skill}
                          </strong>
                          {idx < job.requiredSkills.length - 1 && (
                            <span className="sjc-skill-bullet">•</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div className="sjc-actions-block">
                  {/* Share Icon */}
                  <button 
                    type="button" 
                    className="sjc-btn-icon" 
                    onClick={() => handleShare(job)}
                    title="Share Job"
                  >
                    <Share2 size={16} />
                  </button>

                  {/* Bookmark Icon */}
                  <button 
                    type="button" 
                    className={`sjc-btn-icon ${isSaved ? 'is-saved' : ''}`} 
                    onClick={() => handleSave(job)}
                    title={isSaved ? "Saved" : "Save Job"}
                  >
                    <Bookmark size={16} className={isSaved ? "fill-blue-600 text-blue-600" : ""} />
                  </button>

                  {/* Main Apply Button */}
                  <button 
                    type="button" 
                    className={`sjc-btn-apply ${isApplied ? 'is-applied' : ''}`}
                    onClick={() => handleApply(job)}
                    disabled={isApplied}
                  >
                    {isApplied ? (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <span>Apply</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

