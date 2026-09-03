import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Award, Mail, FileText } from 'lucide-react';
import { ViewType } from '../../types';

interface RecruiterViewProps {
  onNavigate: (view: ViewType) => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({ onNavigate }) => {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(true);

  return (
    <div className="content-wrapper recruiter-portal-layout">
      <div className="recruiter-top-banner">
        <div>
          <span className="recruiter-badge-tag"><ShieldAlert size={14} /> SHINE RECRUITER TALENT SEARCH</span>
          <h1 className="recruiter-heading">Candidate Search: Thin-Pool Domains (AI/ML, SaaS, Semiconductor)</h1>
          <p>Filter candidates verified by senior engineering peers to skip generic GenAI resumes.</p>
        </div>
        <div className="recruiter-filter-toggle-box">
          <label className="toggle-peer-verified">
            <input 
              type="checkbox" 
              checked={showVerifiedOnly} 
              onChange={(e) => setShowVerifiedOnly(e.target.checked)} 
            />
            <span className="toggle-slider"></span>
            <strong>Show Peer-Verified Candidates Only</strong>
          </label>
        </div>
      </div>

      <div className="recruiter-results-grid">
        <div className="recruiter-candidate-card verified-highlight">
          <div className="r-card-header">
            <div className="r-candidate-meta">
              <img src="/avatars/prakash.jpg" alt="Prakash Mahto" className="r-avatar" />
              <div>
                <div className="r-name-row">
                  <h3>Prakash Mahto</h3>
                  <span className="r-gold-shield"><ShieldCheck size={14} /> PEER-VERIFIED: TIER-1 READY</span>
                </div>
                <p className="r-title">Senior Frontend Engineer • 4.2 Yrs Exp • Bengaluru</p>
              </div>
            </div>
            <div className="r-match-score">96% Relevance</div>
          </div>

          <div className="r-verified-box">
            <Award size={22} className="r-v-icon" />
            <div className="r-v-text">
              <strong>Peer Assessment by Akash Jain (Lead Product Manager @ Shine):</strong>
              <p>"Demonstrated robust understanding of scalable micro-frontends, high-performance UI optimization, and cross-functional product delivery."</p>
            </div>
          </div>

          <div className="r-skills-row">
            <span className="r-skill">React.js</span>
            <span className="r-skill">TypeScript</span>
            <span className="r-skill">Next.js Architecture</span>
            <span className="r-skill">System Design</span>
          </div>

          <div className="r-card-actions">
            <button className="btn-shine-gold-sm" onClick={() => alert('Interview invite sent to Prakash Mahto!')}>
              <Mail size={14} /> Schedule Interview
            </button>
            <button className="btn-outline-dark-sm" onClick={() => onNavigate('profile-view')}>
              <FileText size={14} /> View Full Verified CV
            </button>
          </div>
        </div>

        <div className="recruiter-candidate-card verified-highlight">
          <div className="r-card-header">
            <div className="r-candidate-meta">
              <img src="/avatars/sunil.jpg" alt="Sunil Kumar" className="r-avatar" />
              <div>
                <div className="r-name-row">
                  <h3>Sunil Kumar</h3>
                  <span className="r-gold-shield"><ShieldCheck size={14} /> PEER-VERIFIED: TEST AUTOMATION</span>
                </div>
                <p className="r-title">Lead QA & Test Automation Architect • 6 Yrs Exp • Noida</p>
              </div>
            </div>
            <div className="r-match-score">94% Relevance</div>
          </div>

          <div className="r-verified-box">
            <Award size={22} className="r-v-icon" />
            <div className="r-v-text">
              <strong>Peer Assessment by Anirudh Sharma (Principal Search Architect @ Shine):</strong>
              <p>"Demonstrated exceptional test automation framework design, load testing on Solr endpoints, and robust CI/CD integration."</p>
            </div>
          </div>

          <div className="r-skills-row">
            <span className="r-skill">Playwright / Selenium</span>
            <span className="r-skill">Postman API Testing</span>
            <span className="r-skill">CI/CD Pipelines</span>
            <span className="r-skill">Performance Testing</span>
          </div>

          <div className="r-card-actions">
            <button className="btn-shine-gold-sm" onClick={() => alert('Interview invite sent to Sunil Kumar!')}>
              <Mail size={14} /> Schedule Interview
            </button>
            <button className="btn-outline-dark-sm"><FileText size={14} /> View Verified Profile</button>
          </div>
        </div>

      </div>

    </div>
  );
};
