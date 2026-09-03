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
          <p className="guidance-hero-desc">Powered by Shine Peerpath — connect with verified internal peers across Product, Backend, Search/DB, Marketing & QA.</p>
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
            <div className="illo-stat"><span>Trajectory Match</span><strong>94%</strong></div>
            <div className="illo-bar-wrap"><div className="illo-bar-fill" style={{ width: '94%' }}></div></div>
            <div className="illo-mentor-avatar-row">
              <img src="/avatars/akash.jpg" alt="Akash" />
              <img src="/avatars/nisha.jpg" alt="Nisha" />
              <img src="/avatars/saheli.jpg" alt="Saheli" />
              <span className="more-mentors">+6 Team Peers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="candidate-summary-bar">
        <div className="c-sum-item">
          <span className="c-sum-label"><User size={12} /> Candidate</span>
          <span className="c-sum-val">Prakash Mahto</span>
        </div>
        <div className="c-sum-divider"></div>
        <div className="c-sum-item">
          <span className="c-sum-label"><Clock size={12} /> Current Track</span>
          <span className="c-sum-val">Frontend Developer (4+ Yrs)</span>
        </div>
        <div className="c-sum-divider"></div>
        <div className="c-sum-item">
          <span className="c-sum-label"><MapPin size={12} /> Target Tech</span>
          <span className="c-sum-val">Product Mgmt / Backend AI / Solr Infra</span>
        </div>
        <div className="c-sum-divider"></div>
        <div className="c-sum-item">
          <span className="c-sum-label"><GraduationCap size={12} /> Verified Peers</span>
          <span className="c-sum-val text-brand-gold">6 Verified Shine Mentors</span>
        </div>
        <button className="btn-sm-ghost" onClick={() => onNavigate('profile-view')}>Edit</button>
      </div>

      <div className="section-header-flex" id="opportunitiesSection">
        <div>
          <h2 className="section-main-title">Recommended Career Opportunities</h2>
          <p className="section-subtitle">Real-time trajectories matched to your team peers on Shine Peerpath.</p>
        </div>
        <div className="section-actions">
          <span className="badge-pill-light"><Zap size={14} /> 4 High-Growth Tracks</span>
        </div>
      </div>

      <div className="opportunities-stack">
        
        {/* Track 1: Software Engineer -> Product Manager */}
        <div className="opp-card">
          <div className="opp-card-header">
            <div className="opp-title-wrap">
              <h3 className="opp-title">Frontend / Software Engineer ➔ Lead Product Manager</h3>
              <span className="badge-high-demand">High Demand</span>
              <span className="badge-salary">₹24L - ₹38L CTC</span>
            </div>
            <div className="opp-match-badge match-high">
              <CheckCircle2 size={16} /> 94% Match
            </div>
          </div>

          <div className="opp-body-grid">
            <div className="opp-block">
              <h4 className="opp-block-title"><ThumbsUp size={16} /> Why it's a good fit?</h4>
              <ul className="opp-list">
                <li>Strong understanding of UI/UX and user workflows</li>
                <li>Fast technical scoping and developer collaboration</li>
                <li>High industry demand for Tech-savvy Product Leaders</li>
              </ul>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-success"><Check size={16} /> Skills you have</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-success">UI/UX Architecture</span>
                <span className="skill-chip chip-success">Agile / Sprints</span>
                <span className="skill-chip chip-success">User Experience</span>
                <span className="skill-chip chip-success">Cross-Functional Comm</span>
              </div>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-warning"><AlertTriangle size={16} /> Skills to build</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-warning">PRD & Discovery</span>
                <span className="skill-chip chip-warning">Growth Metrics & Funnels</span>
                <span className="skill-chip chip-warning">GTM Strategy</span>
              </div>
              <div className="gap-meter-line">
                <span>Skill Gap: <strong>Low-Medium</strong></span>
                <div className="gap-meter-bar"><div className="gap-fill" style={{ width: '30%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="opp-footer-bar">
            <div className="matched-experts-preview">
              <div className="avatar-stack">
                <img src="/avatars/akash.jpg" alt="Akash Jain" />
                <img src="/avatars/saheli.jpg" alt="Saheli Kanjilal" />
              </div>
              <span className="matched-text"><strong>Akash Jain & Saheli Kanjilal</strong> lead Product & Growth Marketing @ Shine</span>
            </div>
            <div className="opp-btn-group">
              <button className="btn-secondary-card" onClick={() => onNavigate('experts-view')}><Briefcase size={14} /> View Jobs</button>
              <button className="btn-shine-gold" onClick={() => { onSelectExpert('akash'); onNavigate('expert-profile-view'); }}><UserCheck size={16} /> Explore Experts & Teasers</button>
            </div>
          </div>
        </div>

        {/* Track 2: Frontend -> Full-Stack Python Backend & AI */}
        <div className="opp-card">
          <div className="opp-card-header">
            <div className="opp-title-wrap">
              <h3 className="opp-title">Frontend Engineer ➔ Python Backend & AI Engineer</h3>
              <span className="badge-high-demand" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>HOT DOMAIN (THIN POOL)</span>
              <span className="badge-salary">₹28L - ₹42L CTC</span>
            </div>
            <div className="opp-match-badge match-medium">
              <Sparkles size={16} /> 88% Match
            </div>
          </div>

          <div className="opp-body-grid">
            <div className="opp-block">
              <h4 className="opp-block-title"><ThumbsUp size={16} /> Why it's a good fit?</h4>
              <ul className="opp-list">
                <li>Seamless transition into End-to-End GenAI web applications</li>
                <li>Strong JavaScript/TypeScript and REST API integration mastery</li>
                <li>High recruiter demand in thin Python/FastAPI talent pools</li>
              </ul>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-success"><Check size={16} /> Skills you have</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-success">REST APIs</span>
                <span className="skill-chip chip-success">Data Structures</span>
                <span className="skill-chip chip-success">Async Programming</span>
                <span className="skill-chip chip-success">Frontend Integration</span>
              </div>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-warning"><AlertTriangle size={16} /> Skills to build</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-warning">Python / FastAPI</span>
                <span className="skill-chip chip-warning">PostgreSQL & ORM</span>
                <span className="skill-chip chip-warning">LLM Integration (LangChain)</span>
              </div>
              <div className="gap-meter-line">
                <span>Skill Gap: <strong>Medium</strong></span>
                <div className="gap-meter-bar"><div className="gap-fill" style={{ width: '40%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="opp-footer-bar">
            <div className="matched-experts-preview">
              <div className="avatar-stack">
                <img src="/avatars/nisha.jpg" alt="Nisha Kumari" />
                <img src="/avatars/prakash.jpg" alt="Prakash Mahto" />
              </div>
              <span className="matched-text"><strong>Nisha Kumari</strong> architects Python Microservices & GenAI APIs @ Shine</span>
            </div>    
            <div className="opp-btn-group">
              <button className="btn-secondary-card" onClick={() => onNavigate('experts-view')}><Briefcase size={14} /> View Jobs</button>
              <button className="btn-shine-gold" onClick={() => { onSelectExpert('nisha'); onNavigate('expert-profile-view'); }}><UserCheck size={16} /> Explore Experts & Teasers</button>
            </div>
          </div>
        </div>

        {/* Track 3: Backend / Data -> Principal Search & Solr Database Architect */}
        <div className="opp-card">
          <div className="opp-card-header">
            <div className="opp-title-wrap">
              <h3 className="opp-title">Backend Developer ➔ Principal Search & Database Architect</h3>
              <span className="badge-high-demand" style={{ background: '#EDE9FE', color: '#6B21A8', border: '1px solid #DDD6FE' }}>CORE INFRASTRUCTURE</span>
              <span className="badge-salary">₹32L - ₹48L CTC</span>
            </div>
            <div className="opp-match-badge match-high">
              <CheckCircle2 size={16} /> 85% Match
            </div>
          </div>

          <div className="opp-body-grid">
            <div className="opp-block">
              <h4 className="opp-block-title"><ThumbsUp size={16} /> Why it's a good fit?</h4>
              <ul className="opp-list">
                <li>Handle 50M+ candidate queries with sub-10ms search latency</li>
                <li>Massive salary multiplier for distributed search engineers</li>
                <li>Direct mentorship on cluster sharding and query optimization</li>
              </ul>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-success"><Check size={16} /> Skills you have</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-success">SQL / Databases</span>
                <span className="skill-chip chip-success">Caching (Redis)</span>
                <span className="skill-chip chip-success">Data Modeling</span>
              </div>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-warning"><AlertTriangle size={16} /> Skills to build</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-warning">Apache Solr / Lucene</span>
                <span className="skill-chip chip-warning">Inverted Indexing</span>
                <span className="skill-chip chip-warning">Distributed Sharding</span>
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
                <img src="/avatars/anirudh.jpg" alt="Anirudh Sharma" />
              </div>
              <span className="matched-text"><strong>Anirudh Sharma</strong> leads Apache Solr & Search Data Platform @ Shine</span>
            </div>    
            <div className="opp-btn-group">
              <button className="btn-secondary-card" onClick={() => onNavigate('experts-view')}><Briefcase size={14} /> View Jobs</button>
              <button className="btn-shine-gold" onClick={() => { onSelectExpert('anirudh'); onNavigate('expert-profile-view'); }}><UserCheck size={16} /> Explore Experts & Teasers</button>
            </div>
          </div>
        </div>

        {/* Track 4: Manual Tester -> Lead SDET & QA Automation */}
        <div className="opp-card">
          <div className="opp-card-header">
            <div className="opp-title-wrap">
              <h3 className="opp-title">Manual QA Tester ➔ Lead SDET & Automation Architect</h3>
              <span className="badge-high-demand">High Growth</span>
              <span className="badge-salary">₹16L - ₹28L CTC</span>
            </div>
            <div className="opp-match-badge match-high">
              <CheckCircle2 size={16} /> 96% Match
            </div>
          </div>

          <div className="opp-body-grid">
            <div className="opp-block">
              <h4 className="opp-block-title"><ThumbsUp size={16} /> Why it's a good fit?</h4>
              <ul className="opp-list">
                <li>Deep domain testing knowledge and edge-case discovery</li>
                <li>2x salary growth by switching to Playwright/Selenium automation</li>
                <li>Hands-on CI/CD pipeline integration mentorship</li>
              </ul>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-success"><Check size={16} /> Skills you have</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-success">Manual Test Suites</span>
                <span className="skill-chip chip-success">Bug Triage & Jira</span>
                <span className="skill-chip chip-success">API Testing (Postman)</span>
                <span className="skill-chip chip-success">Regression Testing</span>
              </div>
            </div>

            <div className="opp-block">
              <h4 className="opp-block-title text-warning"><AlertTriangle size={16} /> Skills to build</h4>
              <div className="chips-wrap">
                <span className="skill-chip chip-warning">Playwright / Selenium</span>
                <span className="skill-chip chip-warning">Python / Java Automation</span>
                <span className="skill-chip chip-warning">GitHub Actions CI/CD</span>
              </div>
              <div className="gap-meter-line">
                <span>Skill Gap: <strong>Low</strong></span>
                <div className="gap-meter-bar"><div className="gap-fill" style={{ width: '25%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="opp-footer-bar">
            <div className="matched-experts-preview">
              <div className="avatar-stack">
                <img src="/avatars/sunil.jpg" alt="Sunil Kumar" />
              </div>
              <span className="matched-text"><strong>Sunil Kumar</strong> leads QA Automation & Test Pipelines @ Shine</span>
            </div>    
            <div className="opp-btn-group">
              <button className="btn-secondary-card" onClick={() => onNavigate('experts-view')}><Briefcase size={14} /> View Jobs</button>
              <button className="btn-shine-gold" onClick={() => { onSelectExpert('sunil'); onNavigate('expert-profile-view'); }}><UserCheck size={16} /> Explore Experts & Teasers</button>
            </div>
          </div>
        </div>

      </div>

      <div className="guidance-bottom-cta-box">
        <div className="b-cta-left">
          <div className="b-cta-icon"><Star size={22} /></div>
          <div>
            <h3>Want to accelerate your trajectory with our team?</h3>
            <p>Connect with our verified Shine team leads for 1:1 guidance, mock interviews, and trajectory coaching.</p>
          </div>
        </div>
        <button className="btn-shine-gold-lg" onClick={() => onNavigate('experts-view')}>
          Explore All 6 Team Mentors <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
