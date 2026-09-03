import React, { useState } from 'react';
import { X, Play, Banknote, CheckCircle2, ArrowRight, Video, Upload, CheckCircle, PlayCircle, Sparkles } from 'lucide-react';

interface CreatorWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: () => void;
}

export const CreatorWizardModal: React.FC<CreatorWizardModalProps> = ({
  isOpen,
  onClose,
  onPublishSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('Prakash Kumar');
  const [headline, setHeadline] = useState<string>('Senior Frontend & React Architect');
  const [company, setCompany] = useState<string>('Google');
  const [price, setPrice] = useState<number>(1499);
  const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card creator-wizard-card">
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>

        <div className="wizard-stepper-header">
          {[
            { num: 1, name: 'Intro' },
            { num: 2, name: 'Expert Profile' },
            { num: 3, name: 'Teaser Video' },
            { num: 4, name: 'Sessions & Pricing' },
            { num: 5, name: 'Review & Publish' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={`step-node ${step >= s.num ? 'active' : ''}`}>
                <span className="step-num">{s.num}</span>
                <span className="step-name">{s.name}</span>
              </div>
              {idx < 4 && <div className="step-line"></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="wizard-body-viewport">
          {step === 1 && (
            <div className="wizard-step-pane active">
              <div className="intro-hero-layout">
                <div className="creator-illo-art">
                  <span className="floating-play-pill"><Play size={12} fill="#fff" /> Teaser</span>
                  <span className="floating-cash-pill"><Banknote size={12} /> ₹20k+/mo</span>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="Creator" className="creator-art-img" />
                </div>

                <div className="intro-text-col">
                  <span className="badge-gold-pill">SHINE CREATOR MODE</span>
                  <h1 className="intro-title">Turn your experience into impact and income</h1>
                  <p className="intro-desc">Join Shine as an Expert and help professionals grow in their careers. Share your knowledge through trajectory sessions and earn with zero cold-start friction.</p>

                  <div className="intro-checklist">
                    <div className="ic-item"><CheckCircle2 size={16} /> Create your expert profile with pre-filled Shine CV</div>
                    <div className="ic-item"><CheckCircle2 size={16} /> Upload a short 60s teaser video</div>
                    <div className="ic-item"><CheckCircle2 size={16} /> Set your sessions & custom pricing</div>
                    <div className="ic-item"><CheckCircle2 size={16} /> Demand routed by trajectory match — no self-marketing needed</div>
                  </div>

                  <button className="btn-shine-gold-lg mt-4" onClick={() => setStep(2)}>
                    Get Started <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step-pane active">
              <div className="wz-pane-header">
                <h2>Let's build your expert profile</h2>
                <p>Tell us about your background so candidates know you better. Pre-populated from your Shine profile.</p>
              </div>

              <div className="wz-form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Headline / What do you do? *</label>
                  <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Total Experience *</label>
                  <select className="form-select" defaultValue="8+ Years">
                    <option>8+ Years</option>
                    <option>5-7 Years</option>
                    <option>3-5 Years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Current Company *</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="form-input" />
                </div>
                <div className="form-group full-width">
                  <label>Expertise / Topics</label>
                  <div className="tag-selector-box">
                    <span className="tag-chip active">Frontend Development ✕</span>
                    <span className="tag-chip active">React.js ✕</span>
                    <span className="tag-chip active">JavaScript ✕</span>
                    <span className="tag-chip active">System Design ✕</span>
                    <span className="tag-chip active">Web Performance ✕</span>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Short Bio</label>
                  <textarea rows={3} className="form-textarea" defaultValue="I have 8+ years of experience in building scalable web applications using modern frontend technologies. I love mentoring and helping engineers make the jump to Tier-1 tech firms." />
                </div>
              </div>

              <div className="wz-footer-actions">
                <button className="btn-outline-dark" onClick={() => setStep(1)}>Back</button>
                <button className="btn-shine-gold" onClick={() => setStep(3)}>Save & Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step-pane active">
              <div className="wz-pane-header">
                <h2>Upload your teaser video</h2>
                <p>Introduce yourself, your career path, and the topics you can help candidates with (30 sec – 2 min).</p>
              </div>

              <div className="video-upload-dropzone">
                <Video size={40} className="dz-icon" />
                <h3>Drag & drop your video here or</h3>
                <button className="btn-outline-amber" onClick={() => alert('Video selected: prakash_career_teaser.mp4')}>
                  <Upload size={14} /> Choose File
                </button>
                <p className="dz-hint">Max file size: 100MB | Duration: 30 sec – 2 min | Supported: MP4, MOV</p>
                
                {isVideoUploaded && (
                  <div className="uploaded-video-preview">
                    <CheckCircle size={16} className="text-success" />
                    <span><strong>prakash_career_teaser.mp4</strong> (01:15 mins - Transcoded & Ready)</span>
                  </div>
                )}
              </div>

              <div className="wz-footer-actions">
                <button className="btn-outline-dark" onClick={() => setStep(2)}>Back</button>
                <button className="btn-shine-gold" onClick={() => setStep(4)}>Save & Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="wizard-step-pane active">
              <div className="wz-pane-header">
                <h2>Create your sessions & set pricing</h2>
                <p>Add the details of the 1:1 guidance sessions you want to offer.</p>
              </div>

              <div className="wz-form-grid">
                <div className="form-group full-width">
                  <label>Session Title *</label>
                  <input type="text" defaultValue="Mastering Frontend Architecture & Cracking Tier-1 Tech" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Session Type</label>
                  <select className="form-select" defaultValue="1:1 Mentorship & CV Review">
                    <option>1:1 Mentorship & CV Review</option>
                    <option>Mock Interview</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Session Fee (₹) *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="form-input" />
                </div>
                <div className="form-group full-width">
                  <label>Weekly Availability Days</label>
                  <div className="day-picker-row">
                    <span className="day-pill">Mon</span>
                    <span className="day-pill">Tue</span>
                    <span className="day-pill active">Wed</span>
                    <span className="day-pill">Thu</span>
                    <span className="day-pill active">Fri</span>
                    <span className="day-pill active">Sat</span>
                    <span className="day-pill active">Sun</span>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Time Slots</label>
                  <div className="time-chips-row">
                    <span className="time-slot-chip">10:00 AM - 01:00 PM ✕</span>
                    <span className="time-slot-chip">06:00 PM - 09:00 PM ✕</span>
                    <button className="btn-add-slot">+ Add Time Slot</button>
                  </div>
                </div>
              </div>

              <div className="wz-footer-actions">
                <button className="btn-outline-dark" onClick={() => setStep(3)}>Back</button>
                <button className="btn-shine-gold" onClick={() => setStep(5)}>Save & Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="wizard-step-pane active">
              <div className="wz-pane-header">
                <h2>Review your profile</h2>
                <p>Looks good! Review and publish your expert profile to start receiving trajectory matched mentees.</p>
              </div>

              <div className="wizard-preview-card">
                <div className="preview-top">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Prakash" className="prev-avatar" />
                  <div>
                    <h3>{fullName} 🛡️</h3>
                    <p>{headline} at {company}</p>
                    <div className="prev-chips">
                      <span>Frontend Development</span><span>React.js</span><span>Web Performance</span>
                    </div>
                  </div>
                  <div className="prev-pricing">
                    <strong>₹{price}</strong>
                    <span>/ 60 Min</span>
                  </div>
                </div>

                <div className="preview-video-box">
                  <div className="prev-video-thumb">
                    <PlayCircle size={28} />
                    <span>Teaser Video: 01:15 mins</span>
                  </div>
                </div>
              </div>

              <div className="wz-footer-actions">
                <button className="btn-outline-dark" onClick={() => setStep(4)}>Back</button>
                <button className="btn-shine-gold-lg" onClick={onPublishSuccess}>
                  <Sparkles size={18} /> Publish Profile & Go Live!
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
