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
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Prakash" className="r-avatar" />
              <div>
                <div className="r-name-row">
                  <h3>Prakash Kumar</h3>
                  <span className="r-gold-shield"><ShieldCheck size={14} /> PEER-VERIFIED: TIER-1 READY</span>
                </div>
                <p className="r-title">Senior Frontend Engineer • 4 Yrs Exp • Bengaluru</p>
              </div>
            </div>
            <div className="r-match-score">95% Relevance</div>
          </div>

          <div className="r-verified-box">
            <Award size={22} className="r-v-icon" />
            <div className="r-v-text">
              <strong>Peer Assessment by Amit Verma (Senior Lead @ Salesforce):</strong>
              <p>"Exceptional grasp of scalable system architecture, high-performance UI optimization, and cross-functional leadership."</p>
            </div>
          </div>

          <div className="r-skills-row">
            <span className="r-skill">React.js</span>
            <span className="r-skill">TypeScript</span>
            <span className="r-skill">Next.js Architecture</span>
            <span className="r-skill">MEDDIC / Client Discovery</span>
          </div>

          <div className="r-card-actions">
            <button className="btn-shine-gold-sm" onClick={() => alert('Interview invite sent to Prakash Kumar!')}>
              <Mail size={14} /> Schedule Interview
            </button>
            <button className="btn-outline-dark-sm" onClick={() => onNavigate('profile-view')}>
              <FileText size={14} /> View Full Verified CV
            </button>
          </div>
        </div>

        <div className="recruiter-candidate-card">
          <div className="r-card-header">
            <div className="r-candidate-meta">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Sneha" className="r-avatar" />
              <div>
                <div className="r-name-row">
                  <h3>Sneha Menon</h3>
                  <span className="r-gold-shield"><ShieldCheck size={14} /> PEER-VERIFIED: ML PRODUCTION</span>
                </div>
                <p className="r-title">Machine Learning Engineer • 3.5 Yrs Exp • Hyderabad</p>
              </div>
            </div>
            <div className="r-match-score">91% Relevance</div>
          </div>

          <div className="r-verified-box">
            <Award size={22} className="r-v-icon" />
            <div className="r-v-text">
              <strong>Peer Assessment by Ishita Sharma (Senior Data Scientist @ Swiggy):</strong>
              <p>"Successfully validated LLM quantization and latency benchmarks in production-grade mock environments."</p>
            </div>
          </div>

          <div className="r-skills-row">
            <span className="r-skill">PyTorch</span>
            <span className="r-skill">Transformers</span>
            <span className="r-skill">Vector Embeddings</span>
            <span className="r-skill">FastAPI</span>
          </div>

          <div className="r-card-actions">
            <button className="btn-shine-gold-sm" onClick={() => alert('Interview invite sent to Sneha Menon!')}>
              <Mail size={14} /> Schedule Interview
            </button>
            <button className="btn-outline-dark-sm"><FileText size={14} /> View CV</button>
          </div>
        </div>

      </div>

    </div>
  );
};
