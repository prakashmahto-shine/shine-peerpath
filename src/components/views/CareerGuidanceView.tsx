import React from 'react';
import { Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, Zap, CheckCircle2, ThumbsUp, Check, AlertTriangle, UserCheck, Briefcase, Star, ArrowRight } from 'lucide-react';
import { ViewType, Expert } from '../../types';

interface CareerGuidanceViewProps {
  onNavigate: (view: ViewType) => void;
  onSelectExpert: (expertId: string) => void;
  experts: Expert[];
}

export const CareerGuidanceView: React.FC<CareerGuidanceViewProps> = ({
  onNavigate,
  onSelectExpert,
}) => {
  const scrollToOpportunities = () => {
    const el = document.getElementById('opportunitiesSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="content-wrapper">
      <div className="guidance-hero-banner">
        <div className="hero-banner-content">
          <span className="trajectory-tag"><Compass size={14} /> TRAJECTORY MATCHING ENGINE</span>
          <h1 className="guidance-hero-title">Discover your next career opportunity</h1>
          <p className="guidance-hero-desc">Based on your current skills, experience and real-time market hiring trends.</p>
          <div className="hero-actions">
            <button className="btn-shine-gold-lg" onClick={scrollToOpportunities}>
              <Sparkles size={18} /> Explore My Career Paths
            </button>
            <button className="btn-white-outline-lg" onClick={() => onNavigate('experts-view')}>
              <Video size={18} /> Watch Expert Teasers
            </button>
          </div>
        </div>
        <div className="hero-banner-illustration">
          <div className="guidance-illo-card">
            <div className="illo-pulse-dot"></div>
            <div className="illo-stat"><span>Match Score</span><strong>92%</strong></div>
            <div className="illo-bar-wrap"><div className="illo-bar-fill" style={{ width: '92%' }}></div></div>
            <div className="illo-mentor-avatar-row">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&auto=format&fit=crop&q=80" alt="Mentor" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80" alt="Mentor" />
              <span className="more-mentors">+12 Peers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="candidate-summary-bar">
        <div className="c-sum-item">
          <span className="c-sum-label"><User size={12} /> Current Role</span>
          <span className="c-sum-val">Frontend Developer / Sales Exec</span>
        </div>
        <div className="c-sum-divider"></div>
        <div className="c-sum-item">
          <span className="c-sum-label"><Clock size={12} /> Experience</span>
          <span className="c-sum-val">3–5 Years</span>
        </div>
        <div className="c-sum-divider"></div>
        <div className="c-sum-item">
          <span className="c-sum-label"><MapPin size={12} /> Location</span>
          <span className="c-sum-val">Bengaluru, India</span>
        </div>
        <div className="c-sum-divider"></div>
        <div className="c-sum-item">
          <span className="c-sum-label"><GraduationCap size={12} /> Target Transition</span>
          <span className="c-sum-val text-brand-gold">SaaS Sales / Full-Stack AI</span>
        </div>
        <button className="btn-sm-ghost" onClick={() => onNavigate('profile-view')}>Edit</button>
      </div>

      <div className="section-header-flex" id="opportunitiesSection">
        <div>
          <h2 className="section-main-title">Recommended Career Opportunities</h2>
          <p className="section-subtitle">These roles are a great match for your trajectory and can fast-track your compensation.</p>
        </div>
        <div className="section-actions">
          <span className="badge-pill-light"><Zap size={14} /> 4 High-Growth Verticals</span>
        </div>
      </div>

      <div className="opportunities-stack">
        <div className="opp-card">
          <div className="opp-card-header">
            <div className="opp-title-wrap">
              <h3 className="opp-title">SaaS Sales Manager</h3>
              <span className="badge-high-demand">High Demand</span>
              <span className="badge-salary">₹18L - ₹32L CTC</span>
            </div>
            <div className="opp-match-badge match-high">
              <CheckCircle2 size={16} /> 92% Match
            </div>
          </div>

          <div className="opp-body-grid">
            <div className="opp-block">
              <h4 className="opp-block-title"><ThumbsUp size={16} /> Why it's a good fit?</h4>
              <ul className="opp-list">
                <li>Your 3 yrs in sales is highly relevant</li>
                <li>Strong customer discovery experience</li>
                <li>Great career growth & earning potential</li>
              </ul>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-success"><Check size={16} /> Skills you have</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-success">Sales & Negotiation</span>
                <span className="skill-chip chip-success">Client Relationship</span>
                <span className="skill-chip chip-success">Communication</span>
                <span className="skill-chip chip-success">Lead Prospecting</span>
              </div>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-warning"><AlertTriangle size={16} /> Skills to build</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-warning">SaaS Metrics & ARR</span>
                <span className="skill-chip chip-warning">Enterprise Demo Pitch</span>
                <span className="skill-chip chip-warning">MEDDIC Framework</span>
              </div>
              <div className="gap-meter-line">
                <span>Skill Gap: <strong>Low-Medium</strong></span>
                <div className="gap-meter-bar"><div className="gap-fill" style={{ width: '35%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="opp-footer-bar">
            <div className="matched-experts-preview">
              <div className="avatar-stack">
                <img src="/avatars/amit.jpg" alt="Amit" />
                <img src="/avatars/neha.jpg" alt="Neha" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" alt="Rohan" />
              </div>
              <span className="matched-text"><strong>3 Peers</strong> transitioned from your exact role to Salesforce, Zoho & Freshworks</span>
            </div>
            <div className="opp-btn-group">
              <button className="btn-secondary-card" onClick={() => onNavigate('experts-view')}><Briefcase size={14} /> View Jobs</button>
              <button className="btn-shine-gold" onClick={() => { onSelectExpert('amit'); onNavigate('expert-profile-view'); }}><UserCheck size={16} /> Explore Experts & Teasers</button>
            </div>
          </div>
        </div>

      </div>

      <div className="opportunities-grid-2col" style={{ marginTop: '24px' }}>
        <div className="opportunity-wide-card">
          <div className="opp-main-body">
            <div className="opp-role-head">
              <div>
                <span className="opp-badge-popular">HOT DOMAIN (THIN POOL)</span>
                <h3 className="opp-title">Full-Stack Engineer ➔ Production AI/ML Engineer</h3>
                <p className="opp-comp-range">Target Salary: <strong>₹28 - ₹42 LPA</strong> • 1,200+ Active Openings on Shine</p>
              </div>
              <span className="opp-match-pill match-green"><Sparkles size={14} /> 85% Trajectory Match</span>
            </div>

            <div className="opp-skills-gap-box">
              <div className="gap-skill-item">
                <span className="gap-label">Skills You Have:</span>
                <div className="gap-chips">
                  <span className="chip-have">Python</span>
                  <span className="chip-have">REST APIs</span>
                  <span className="chip-have">Data Structures</span>
                </div>
              </div>

              <div className="gap-skill-item">
                <span className="gap-label">Critical Gap to Close:</span>
                <div className="gap-chips">
                  <span className="chip-need">LLM Orchestration (LangChain)</span>
                  <span className="chip-need">Vector DBs (Pinecone/Milvus)</span>
                  <span className="chip-need">Distributed PyTorch</span>
                </div>
              </div>

              <div className="gap-meter-line">
                <span>Skill Gap: <strong>Medium</strong></span>
                <div className="gap-meter-bar"><div className="gap-fill" style={{ width: '45%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="opp-footer-bar">
            <div className="matched-experts-preview">
              <div className="avatar-stack">
                <img src="/avatars/ishita.jpg" alt="Ishita" />
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80" alt="Vikram" />
              </div>
              <span className="matched-text"><strong>Ishita & Vikram</strong> transitioned from Full-Stack to AI Lead @ Swiggy & Google</span>
            </div>    
            <div className="opp-btn-group">
              <button className="btn-secondary-card" onClick={() => onNavigate('experts-view')}><Briefcase size={14} /> View Jobs</button>
              <button className="btn-shine-gold" onClick={() => { onSelectExpert('ishita'); onNavigate('expert-profile-view'); }}><UserCheck size={16} /> Explore Experts</button>
            </div>
          </div>
        </div>

      </div>

      <div className="guidance-bottom-cta-box">
        <div className="b-cta-left">
          <div className="b-cta-icon"><Star size={22} /></div>
          <div>
            <h3>Want to understand these careers better?</h3>
            <p>Connect with experts who made this exact jump and hold the role you want.</p>
          </div>
        </div>
        <button className="btn-shine-gold-lg" onClick={() => onNavigate('experts-view')}>
          Explore All 500+ Experts <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
