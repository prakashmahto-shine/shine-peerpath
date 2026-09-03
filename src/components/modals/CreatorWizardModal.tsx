import React, { useState } from 'react';
import { X, Play, Banknote, CheckCircle2, ArrowRight, Video, Upload, CheckCircle, PlayCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatorWizardModal: React.FC = () => {
  const { isCreatorWizardOpen, setIsCreatorWizardOpen, addExpert, navigate, userProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>(userProfile.name || 'Prakash Mahto');
  const [headline, setHeadline] = useState<string>('Senior Frontend & UI/UX Architect');
  const [company, setCompany] = useState<string>('Shine (HT Media)');
  const [domain, setDomain] = useState<string>('Frontend & Web UI');
  const [price, setPrice] = useState<number>(899);
  const [bio, setBio] = useState<string>('Senior Frontend Engineer with 4+ years of hands-on experience building high-scale, responsive web architectures. I help candidates crack senior frontend interviews, master modern React/Next.js and optimize UI performance.');
  const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(true);

  if (!isCreatorWizardOpen) return null;

  const handlePublish = () => {
    addExpert({
      name: fullName,
      role: headline,
      company,
      domain,
      experience: '5+ Years Exp.',
      rating: 5.0,
      reviewsCount: 1,
      sessionsCount: 0,
      price,
      location: 'Bengaluru, India',
      duration: '01:15',
      avatar: '/avatars/prakash.jpg',
      videoPoster: '/avatars/prakash.jpg',
      teaserTitle: 'Teaser: Mastering React 19, Micro-Frontends & System Design',
      skills: ['React.js', 'TypeScript', 'Next.js', 'System Design', 'Performance'],
      bio,
      verifiedEmail: '@shine.com'
    });
    setIsCreatorWizardOpen(false);
    navigate('experts-view');
  };

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card creator-wizard-card">
        <button className="modal-close-btn" onClick={() => setIsCreatorWizardOpen(false)}><X size={18} /></button>

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
                  <img src="/avatars/prakash.jpg" alt="Creator" className="creator-art-img" />
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
                  <label>Domain Track *</label>
                  <select className="form-select" value={domain} onChange={(e) => setDomain(e.target.value)}>
                    <option value="Frontend & Web UI">Frontend & Web UI</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Search & Data Infra">Search & Data Infra</option>
                    <option value="SaaS Sales">SaaS Sales</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Current Company *</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="form-input" />
                </div>
                <div className="form-group full-width">
                  <label>Short Bio *</label>
                  <textarea rows={3} className="form-textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
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
                  <img src="/avatars/prakash.jpg" alt={fullName} className="prev-avatar" />
                  <div>
                    <h3>{fullName} 🛡️</h3>
                    <p>{headline} at {company}</p>
                    <div className="prev-chips">
                      <span>Frontend Development</span><span>React.js</span><span>System Design</span>
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
                <button className="btn-shine-gold-lg" onClick={handlePublish}>
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
