import React, { useState } from 'react';
import { 
  X, Briefcase, MapPin, Building2, Clock, CheckCircle2, 
  Zap, Sparkles, UserCheck, ArrowRight, TrendingUp, Filter, Check, ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';

export type PathwayTrackKey = 'arch' | 'pm' | 'search' | 'ai';

interface MatchingJobItem {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyBgColor: string;
  exp: string;
  loc: string;
  salary: string;
  posted: string;
  matchRate: number;
  matchedSkills: string[];
  boosterSkills: string[];
  badgeText?: string;
  openingsCountText?: string;
}

interface PathwayTrackData {
  key: PathwayTrackKey;
  trackName: string;
  targetRole: string;
  targetSalary: string;
  openingsBadge: string;
  mentorId: string;
  mentorName: string;
  mentorCompany: string;
  mentorAvatar: string;
  jobs: MatchingJobItem[];
}

const TRACKS_JOBS_DB: Record<PathwayTrackKey, PathwayTrackData> = {
  arch: {
    key: 'arch',
    trackName: 'Architecture Track',
    targetRole: 'Lead UI & Micro-Frontend Architect',
    targetSalary: '₹22 - 36 LPA',
    openingsBadge: '520+ Active Openings',
    mentorId: 'saheli',
    mentorName: 'Saheli Kanjilal',
    mentorCompany: 'Staff Architect @ Razorpay',
    mentorAvatar: '/avatars/saheli.jpg',
    jobs: [
      {
        id: 'job-arch-1',
        title: 'Lead UI Platform Architect',
        company: 'Swiggy Tech',
        companyInitials: 'SW',
        companyBgColor: '#FC8019',
        exp: '4 to 8 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹26 - 35 LPA',
        posted: '1d ago',
        matchRate: 94,
        matchedSkills: ['React.js', 'Component Architecture', 'JS ES6+'],
        boosterSkills: ['Micro-Frontends', 'Module Federation'],
        badgeText: '🔥 High Priority Hiring',
        openingsCountText: '3 Open Positions'
      },
      {
        id: 'job-arch-2',
        title: 'Staff Frontend Architect',
        company: 'Razorpay Fintech',
        companyInitials: 'RZ',
        companyBgColor: '#0C2340',
        exp: '5 to 9 Yrs',
        loc: 'Remote / Bengaluru',
        salary: '₹28 - 38 LPA',
        posted: '18h ago',
        matchRate: 91,
        matchedSkills: ['React.js', 'HTML5/CSS3', 'REST APIs'],
        boosterSkills: ['Micro-Frontends', 'Core Web Vitals'],
        badgeText: '⭐ Verified Recruiter Inbound',
        openingsCountText: 'Direct Hiring Team'
      },
      {
        id: 'job-arch-3',
        title: 'Principal Frontend Engineer (Core Platform)',
        company: 'PhonePe',
        companyInitials: 'PP',
        companyBgColor: '#6739B7',
        exp: '6 to 10 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹30 - 40 LPA',
        posted: '2d ago',
        matchRate: 89,
        matchedSkills: ['React.js', 'TypeScript', 'State Management'],
        boosterSkills: ['Module Federation', 'System Design'],
        badgeText: '⚡ Fast-Track 3-Day Process',
        openingsCountText: '2 Open Positions'
      },
      {
        id: 'job-arch-4',
        title: 'Lead UI Engineer - Design Systems & Web Scale',
        company: 'MakeMyTrip',
        companyInitials: 'MMT',
        companyBgColor: '#E53935',
        exp: '4 to 8 Yrs',
        loc: 'Gurugram / Hybrid',
        salary: '₹22 - 32 LPA',
        posted: '3d ago',
        matchRate: 93,
        matchedSkills: ['React.js', 'CSS Architecture', 'UI/UX'],
        boosterSkills: ['Web Vitals & Performance', 'Micro-Frontends'],
        badgeText: '🚀 Instant Shortlist with ATS Match',
        openingsCountText: 'Actively Interviewing'
      }
    ]
  },
  pm: {
    key: 'pm',
    trackName: 'Product Track',
    targetRole: 'Lead Technical Product Manager',
    targetSalary: '₹24 - 38 LPA',
    openingsBadge: '430+ Active Openings',
    mentorId: 'akash',
    mentorName: 'Akash Jain',
    mentorCompany: 'Lead PM @ Shine',
    mentorAvatar: '/avatars/akash.jpg',
    jobs: [
      {
        id: 'job-pm-1',
        title: 'Lead Product Manager - Trajectory & Search AI',
        company: 'Shine (HT Media)',
        companyInitials: 'SH',
        companyBgColor: '#1E3A8A',
        exp: '5 to 9 Yrs',
        loc: 'Gurugram / Hybrid',
        salary: '₹28 - 38 LPA',
        posted: '2d ago',
        matchRate: 95,
        matchedSkills: ['Tech Scoping', 'Agile/Sprints', 'UI/UX Empathy'],
        boosterSkills: ['PRD Discovery', 'Product Metrics'],
        badgeText: '🔥 Direct Shine Inbound',
        openingsCountText: 'Executive Fast Track'
      },
      {
        id: 'job-pm-2',
        title: 'Senior Technical Product Manager',
        company: 'Zepto Quick Commerce',
        companyInitials: 'ZP',
        companyBgColor: '#800080',
        exp: '4 to 8 Yrs',
        loc: 'Bengaluru / On-Site',
        salary: '₹26 - 36 LPA',
        posted: '1d ago',
        matchRate: 90,
        matchedSkills: ['Agile/Sprints', 'Tech Scoping'],
        boosterSkills: ['Growth Funnels', 'GTM Strategy'],
        badgeText: '⭐ Unicorn Growth Team',
        openingsCountText: '4 Open Positions'
      },
      {
        id: 'job-pm-3',
        title: 'Principal Product Manager - Checkout & Payments',
        company: 'Flipkart',
        companyInitials: 'FK',
        companyBgColor: '#2874F0',
        exp: '6 to 10 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹32 - 42 LPA',
        posted: '3h ago',
        matchRate: 88,
        matchedSkills: ['Tech Scoping', 'UI/UX Empathy'],
        boosterSkills: ['PRD Discovery', 'GTM Strategy'],
        badgeText: '⚡ Top Tier Package',
        openingsCountText: 'Direct Hiring'
      },
      {
        id: 'job-pm-4',
        title: 'Lead Growth Product Manager',
        company: 'CRED',
        companyInitials: 'CR',
        companyBgColor: '#0F172A',
        exp: '5 to 9 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹30 - 40 LPA',
        posted: '4d ago',
        matchRate: 92,
        matchedSkills: ['Analytics', 'Product Thinking'],
        boosterSkills: ['Product Metrics & Funnels'],
        badgeText: '🚀 High-Impact Role',
        openingsCountText: '2 Positions Open'
      }
    ]
  },
  search: {
    key: 'search',
    trackName: 'Core Infrastructure Track',
    targetRole: 'Principal Search & Solr Architect',
    targetSalary: '₹32 - 48 LPA',
    openingsBadge: '290+ High-Paying Openings',
    mentorId: 'anirudh',
    mentorName: 'Anirudh Sharma',
    mentorCompany: 'Principal Search Architect @ Shine',
    mentorAvatar: '/avatars/anirudh.jpg',
    jobs: [
      {
        id: 'job-search-1',
        title: 'Principal Search & Solr Cloud Architect',
        company: 'Shine (HT Digital)',
        companyInitials: 'SH',
        companyBgColor: '#1E3A8A',
        exp: '6 to 11 Yrs',
        loc: 'Gurugram / Remote',
        salary: '₹35 - 48 LPA',
        posted: '1d ago',
        matchRate: 94,
        matchedSkills: ['Node/Python', 'REST APIs', 'SQL Schema'],
        boosterSkills: ['Apache Solr', 'Inverted Index Sharding'],
        badgeText: '🔥 Core Infra Team',
        openingsCountText: 'Direct Search Pod'
      },
      {
        id: 'job-search-2',
        title: 'Senior Staff Database & Search Engineer',
        company: 'Adobe Systems',
        companyInitials: 'AD',
        companyBgColor: '#FF0000',
        exp: '7 to 12 Yrs',
        loc: 'Noida / Remote',
        salary: '₹38 - 50 LPA',
        posted: '2d ago',
        matchRate: 89,
        matchedSkills: ['REST APIs', 'SQL Schema'],
        boosterSkills: ['Sub-10ms Latency Tuning', 'Lucene Engine'],
        badgeText: '⭐ Tier-1 Global Brand',
        openingsCountText: 'Multiple Openings'
      },
      {
        id: 'job-search-3',
        title: 'Principal Lucene & Solr Cloud Architect',
        company: 'Walmart Global Tech',
        companyInitials: 'WM',
        companyBgColor: '#0071DC',
        exp: '6 to 10 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹36 - 48 LPA',
        posted: '3d ago',
        matchRate: 91,
        matchedSkills: ['Distributed Systems', 'Python/Java'],
        boosterSkills: ['Apache Solr', 'Latency Tuning'],
        badgeText: '⚡ High Concurrency Scaling',
        openingsCountText: '3 Open Positions'
      },
      {
        id: 'job-search-4',
        title: 'Distributed Search Infrastructure Lead',
        company: 'Uber Tech',
        companyInitials: 'UB',
        companyBgColor: '#000000',
        exp: '8 to 12 Yrs',
        loc: 'Bengaluru / Remote',
        salary: '₹40 - 55 LPA',
        posted: '5d ago',
        matchRate: 87,
        matchedSkills: ['Database Modeling', 'REST APIs'],
        boosterSkills: ['Index Sharding & Routing'],
        badgeText: '🚀 Global Platform Team',
        openingsCountText: 'Direct Recruiter Inbound'
      }
    ]
  },
  ai: {
    key: 'ai',
    trackName: 'Generative AI Track',
    targetRole: 'Production GenAI & LLM Engineer',
    targetSalary: '₹28 - 45 LPA',
    openingsBadge: '610+ Active Openings',
    mentorId: 'ishita',
    mentorName: 'Ishita Sharma',
    mentorCompany: 'GenAI Lead @ Swiggy',
    mentorAvatar: '/avatars/ishita.jpg',
    jobs: [
      {
        id: 'job-ai-1',
        title: 'Lead GenAI Engineer - LLM & Agent Workflows',
        company: 'Swiggy AI Labs',
        companyInitials: 'SW',
        companyBgColor: '#FC8019',
        exp: '4 to 8 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹32 - 45 LPA',
        posted: '1d ago',
        matchRate: 96,
        matchedSkills: ['Fullstack App', 'WebSockets/APIs', 'DB Modeling'],
        boosterSkills: ['LangChain / LLM Orchestration', 'RAG Evaluation'],
        badgeText: '🔥 AI Lab Priority Hiring',
        openingsCountText: '4 Open Positions'
      },
      {
        id: 'job-ai-2',
        title: 'Senior Staff AI Platform & Vector Pipeline Engineer',
        company: 'BrowserStack',
        companyInitials: 'BS',
        companyBgColor: '#00A87E',
        exp: '5 to 9 Yrs',
        loc: 'Mumbai / Remote',
        salary: '₹30 - 42 LPA',
        posted: '18h ago',
        matchRate: 91,
        matchedSkills: ['WebSockets/APIs', 'DB Modeling'],
        boosterSkills: ['Vector Embeddings (Pinecone)', 'RAG Pipelines'],
        badgeText: '⭐ Fast-Growing Unicorn',
        openingsCountText: 'Direct Hiring Team'
      },
      {
        id: 'job-ai-3',
        title: 'Production LLM Architect - Enterprise Agents',
        company: 'Postman Tech',
        companyInitials: 'PM',
        companyBgColor: '#FF6C37',
        exp: '5 to 10 Yrs',
        loc: 'Bengaluru / Hybrid',
        salary: '₹35 - 48 LPA',
        posted: '2d ago',
        matchRate: 93,
        matchedSkills: ['Fullstack App', 'REST APIs'],
        boosterSkills: ['LangChain Orchestration', 'Vector Embeddings'],
        badgeText: '⚡ API & Agent Infrastructure',
        openingsCountText: '2 Positions Open'
      },
      {
        id: 'job-ai-4',
        title: 'Lead RAG & Prompt Evaluation Engineer',
        company: 'OpenAI Partner Co',
        companyInitials: 'AI',
        companyBgColor: '#10A37F',
        exp: '4 to 8 Yrs',
        loc: 'Remote',
        salary: '₹38 - 52 LPA',
        posted: '4d ago',
        matchRate: 90,
        matchedSkills: ['Python/Fullstack', 'APIs'],
        boosterSkills: ['RAG Pipeline Evaluation', 'Fine-Tuning'],
        badgeText: '🚀 Global Remote Role',
        openingsCountText: 'Actively Interviewing'
      }
    ]
  }
};

interface MatchingJobsModalProps {
  isOpen: boolean;
  initialTrack?: PathwayTrackKey;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
  onSelectExpert: (expertId: string) => void;
}

export const MatchingJobsModal: React.FC<MatchingJobsModalProps> = ({
  isOpen,
  initialTrack = 'arch',
  onClose,
  onNavigate,
  onSelectExpert
}) => {
  const { userProfile, showToast, setSelectedJobCategory } = useApp();
  const [selectedTrack, setSelectedTrack] = useState<PathwayTrackKey>(initialTrack);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  // Synchronize when initialTrack prop changes
  React.useEffect(() => {
    if (initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack]);

  if (!isOpen) return null;

  const currentTrackData = TRACKS_JOBS_DB[selectedTrack] || TRACKS_JOBS_DB.arch;

  const handle1ClickApply = (job: MatchingJobItem) => {
    setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
    showToast(
      `Application Submitted to ${job.company}!`,
      `Your verified Shine profile & ATS score were sent directly to the hiring recruiter.`,
      'success'
    );
  };

  const handleBookMentorReferral = (mentorId: string) => {
    onClose();
    onSelectExpert(mentorId);
    onNavigate('expert-profile-view');
  };

  const handleAddSkillsAndBoost = () => {
    onClose();
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

  const handleGoToDashboardJobs = () => {
    onClose();
    setSelectedJobCategory(selectedTrack);
    onNavigate('jobs-view');
  };

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card matching-jobs-modal-card">
        
        {/* Header */}
        <div className="mjm-header">
          <div className="mjm-header-left">
            <div className="mjm-header-tag">
              <Sparkles size={13} className="text-amber-500" />
              <span>SHINE PEERPATH • LIVE MATCHING OPPORTUNITIES</span>
            </div>
            <h2 className="mjm-title">
              {currentTrackData.targetRole}
            </h2>
            <div className="mjm-meta-row">
              <span className="mjm-salary-pill">Target CTC: <strong>{currentTrackData.targetSalary}</strong></span>
              <span className="mjm-openings-tag">🔥 {currentTrackData.openingsBadge}</span>
              <span className="mjm-candidate-context">Tailored for <strong>{userProfile.name}</strong></span>
            </div>
          </div>

          <button className="modal-close-btn mjm-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Track Filter Pills Bar */}
        <div className="mjm-tabs-bar">
          <button 
            type="button" 
            className={`mjm-tab-btn ${selectedTrack === 'arch' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('arch')}
          >
            Lead UI Architect <span className="mjm-tab-count">₹22–36L</span>
          </button>
          <button 
            type="button" 
            className={`mjm-tab-btn ${selectedTrack === 'pm' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('pm')}
          >
            Product Management <span className="mjm-tab-count">₹24–38L</span>
          </button>
          <button 
            type="button" 
            className={`mjm-tab-btn ${selectedTrack === 'search' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('search')}
          >
            Search & Solr Infra <span className="mjm-tab-count">₹32–48L</span>
          </button>
          <button 
            type="button" 
            className={`mjm-tab-btn ${selectedTrack === 'ai' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('ai')}
          >
            GenAI & LLM <span className="mjm-tab-count">₹28–45L</span>
          </button>
        </div>

        {/* Shortlisting Accelerator Strip */}
        <div className="mjm-accelerator-strip">
          <div className="mjm-acc-left">
            <div className="mjm-acc-icon">
              <Zap size={16} />
            </div>
            <div className="mjm-acc-text">
              <strong>Boost Shortlisting Chance to 96% (Top 5% Candidates)</strong>
              <span>Add recommended booster skills or prep 1:1 with verified track mentors before interviews.</span>
            </div>
          </div>
          <div className="mjm-acc-actions">
            <button 
              type="button" 
              className="btn-mjm-add-skills"
              onClick={handleAddSkillsAndBoost}
            >
              + Add Skills in Profile
            </button>
            <button 
              type="button" 
              className="btn-mjm-book-mentor"
              onClick={() => handleBookMentorReferral(currentTrackData.mentorId)}
            >
              <UserCheck size={13} /> Prep with {currentTrackData.mentorName.split(' ')[0]} ➔
            </button>
          </div>
        </div>

        {/* Jobs List Body */}
        <div className="mjm-jobs-list-scroll">
          {currentTrackData.jobs.map((job) => {
            const isApplied = Boolean(appliedJobs[job.id]);

            return (
              <div key={job.id} className="mjm-job-card">
                
                {/* Top Row: Title, Company, Match %, Badge */}
                <div className="mjm-jc-top">
                  <div className="mjm-jc-company-row">
                    <div 
                      className="mjm-jc-logo" 
                      style={{ backgroundColor: job.companyBgColor }}
                    >
                      {job.companyInitials}
                    </div>
                    <div>
                      <h3 className="mjm-jc-role-title">{job.title}</h3>
                      <div className="mjm-jc-company-sub">
                        <strong className="mjm-jc-company-name">{job.company}</strong>
                        {job.openingsCountText && (
                          <span className="mjm-jc-openings-count">• {job.openingsCountText}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mjm-jc-match-badge-wrap">
                    <div className="mjm-jc-match-pill">
                      <span className="mjm-match-score">🎯 {job.matchRate}%</span>
                      <span className="mjm-match-label">Match</span>
                    </div>
                    {job.badgeText && (
                      <span className="mjm-jc-priority-tag">{job.badgeText}</span>
                    )}
                  </div>
                </div>

                {/* Metadata Row: Exp, Loc, Salary, Time */}
                <div className="mjm-jc-meta-row">
                  <span className="mjm-jc-meta-item"><Briefcase size={13} /> {job.exp}</span>
                  <span className="mjm-jc-meta-item"><MapPin size={13} /> {job.loc}</span>
                  <span className="mjm-jc-meta-item mjm-salary-highlight"><TrendingUp size={13} /> {job.salary}</span>
                  <span className="mjm-jc-meta-item text-slate-500"><Clock size={13} /> {job.posted}</span>
                </div>

                {/* Skills Match Breakdown */}
                <div className="mjm-jc-skills-breakdown">
                  <div className="mjm-skills-subgroup">
                    <span className="mjm-skills-sublabel">Your Matched Base:</span>
                    <div className="mjm-chips-wrap">
                      {job.matchedSkills.map((s, idx) => (
                        <span key={idx} className="mjm-chip chip-matched">✓ {s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mjm-skills-subgroup">
                    <span className="mjm-skills-sublabel text-amber-700">Required Booster Skills:</span>
                    <div className="mjm-chips-wrap">
                      {job.boosterSkills.map((s, idx) => (
                        <span key={idx} className="mjm-chip chip-booster">⚡ {s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="mjm-jc-bottom-actions">
                  <div className="mjm-jc-mentor-hint">
                    <img 
                      src={currentTrackData.mentorAvatar} 
                      alt={currentTrackData.mentorName} 
                      className="mjm-mini-avatar"
                    />
                    <span>
                      <strong>{currentTrackData.mentorName}</strong> provides 1:1 interview prep & internal referral assistance.
                    </span>
                  </div>

                  <div className="mjm-jc-btns-group">
                    <button
                      type="button"
                      className="btn-mjm-referral-cta"
                      onClick={() => handleBookMentorReferral(currentTrackData.mentorId)}
                      title={`Book 1:1 Prep & Referral Session with ${currentTrackData.mentorName}`}
                    >
                      <UserCheck size={13} />
                      <span>Get Mentor Referral</span>
                    </button>

                    <button
                      type="button"
                      className={`btn-mjm-apply-cta ${isApplied ? 'is-applied' : ''}`}
                      onClick={() => handle1ClickApply(job)}
                      disabled={isApplied}
                    >
                      {isApplied ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Zap size={13} />
                          <span>1-Click Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mjm-modal-footer">
          <div className="mjm-footer-left">
            <Building2 size={15} className="text-slate-500" />
            <span>Over <strong>2,850+ verified opportunities</strong> live across India on Shine.</span>
          </div>

          <button 
            type="button" 
            className="btn-mjm-all-dashboard"
            onClick={handleGoToDashboardJobs}
          >
            Explore All Shine Jobs on Dashboard <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
