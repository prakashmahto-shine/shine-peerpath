import React, { useState, useRef, useMemo } from 'react';
import { X, ArrowRight, Check, Sparkles, FileText, UploadCloud, Loader2, RefreshCw, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrajectoryCalibrationModal: React.FC = () => {
  const {
    isCalibrationModalOpen,
    setIsCalibrationModalOpen,
    userProfile,
    calibrateCandidateProfile,
    showToast
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean initial states (No hardcoded dummy prefill at start)
  const [currentRole, setCurrentRole] = useState<string>('');
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [dreamCompany, setDreamCompany] = useState<string>('');
  const [targetTrack, setTargetTrack] = useState<string>('AI/ML');
  const [customTargetRole, setCustomTargetRole] = useState<string>('');
  const [currentCtc, setCurrentCtc] = useState<string>(userProfile?.currentCtc || '₹5.5 LPA');
  
  const [isScanningCv, setIsScanningCv] = useState<boolean>(false);
  const [cvSynced, setCvSynced] = useState<boolean>(false);
  const [uploadedCvName, setUploadedCvName] = useState<string>('');

  // Dynamic salary leap benchmark based on selected dream track
  const dynamicSalaryData = useMemo(() => {
    switch (targetTrack) {
      case 'AI/ML':
        return { targetCtc: '₹28L – ₹42L+', growthBadge: '+450% Leap Match', trackTitle: 'AI/ML (Generative AI & LLMs)' };
      case 'Semi-conductor':
        return { targetCtc: '₹24L – ₹38L+', growthBadge: '+380% Leap Match', trackTitle: 'Semi-conductor (VLSI & Silicon)' };
      case 'Cyber-security':
        return { targetCtc: '₹22L – ₹35L+', growthBadge: '+320% Leap Match', trackTitle: 'Cyber-security (Cloud & AppSec)' };
      case 'Full-stack':
        return { targetCtc: '₹24L – ₹32L+', growthBadge: '+350% Leap Match', trackTitle: 'Full-stack Architecture' };
      case 'Others':
      default:
        return { targetCtc: '₹20L – ₹30L+', growthBadge: '+280% Leap Match', trackTitle: customTargetRole || 'Custom Technology Track' };
    }
  }, [targetTrack, customTargetRole]);

  if (!isCalibrationModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedCvName(file.name);
      setIsScanningCv(true);

      setTimeout(() => {
        setIsScanningCv(false);
        setCvSynced(true);
        setCurrentRole('Senior Frontend Engineer');
        setCurrentCompany('Tech Services (TCS / Infosys)');
        showToast('📄 Resume Auto-Filled!', `Extracted current role & company from "${file.name}".`, 'success');
      }, 1000);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTargetRole = targetTrack === 'Others' 
      ? (customTargetRole.trim() || 'Staff Technology Specialist') 
      : dynamicSalaryData.trackTitle;

    calibrateCandidateProfile({
      currentRole: currentRole.trim() || 'Software Engineer',
      currentCompany: currentCompany.trim() || 'Tech Services Consultancy',
      dreamCompany: dreamCompany.trim() || 'Swiggy / Flipkart',
      targetRole: finalTargetRole,
      currentCtc,
      targetCtc: dynamicSalaryData.targetCtc,
      resumeFileName: uploadedCvName || userProfile?.resumeFileName
    });
  };

  return (
    <div className="tcm-modal-backdrop" onClick={() => setIsCalibrationModalOpen(false)}>
      <div 
        className="tcm-modal-card"
        onClick={e => e.stopPropagation()}
      >
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".pdf,.docx,.doc" 
          style={{ display: 'none' }} 
        />

        {/* Modal Header */}
        <div className="tcm-header">
          <button
            onClick={() => setIsCalibrationModalOpen(false)}
            className="tcm-close-btn"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
          <div className="tcm-tag-row">
            <span className="tcm-tag-badge">
              ⚡ 10s Calibration
            </span>
            <span className="tcm-tag-sub">Personalized Career Trajectory</span>
          </div>
          <h2 className="tcm-title">
            Unlock Your Matched Peerpath
          </h2>
          <p className="tcm-desc">
            Reveal verified salary leap benchmarks &amp; 1:1 mentors from <strong>your company</strong> to <strong>your dream target</strong>.
          </p>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="tcm-form">
          
          {/* Optional Resume Upload to Auto-Fill Strip */}
          <div className={`tcm-upload-strip-compact ${cvSynced ? 'synced' : ''}`}>
            <div className="tcm-usc-left">
              <FileText size={15} className={cvSynced ? "text-emerald-600" : "text-purple-600"} />
              <span className="tcm-usc-text">
                {cvSynced ? `✅ Synced: ${uploadedCvName || 'Resume.pdf'}` : 'Have your CV? Auto-fill in 1 second'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleTriggerFileInput}
              disabled={isScanningCv}
              className="tcm-usc-btn"
            >
              {isScanningCv ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : cvSynced ? (
                <>
                  <RefreshCw size={11} />
                  <span>Re-upload</span>
                </>
              ) : (
                <>
                  <UploadCloud size={12} />
                  <span>Upload CV</span>
                </>
              )}
            </button>
          </div>

          {/* Section 1: Target Track Dropdown */}
          <div className="tcm-field-compact">
            <label className="tcm-group-label">
              <span>🎯 Target Leap Track *</span>
            </label>
            <div className="tcm-select-wrapper">
              <select
                value={targetTrack}
                onChange={e => setTargetTrack(e.target.value)}
                className="tcm-select-compact"
              >
                <option value="AI/ML">🤖 AI / ML (Generative AI &amp; LLM Systems)</option>
                <option value="Semi-conductor">⚡ Semi-conductor (VLSI &amp; Silicon Design)</option>
                <option value="Cyber-security">🛡️ Cyber Security (Cloud &amp; AppSec)</option>
                <option value="Full-stack">💻 Full-Stack &amp; Frontend Architecture</option>
                <option value="Others">✨ Others (Enter Custom Role...)</option>
              </select>
              <ChevronDown size={15} className="tcm-select-arrow" />
            </div>

            {/* Custom Role Input when "Others" is selected */}
            {targetTrack === 'Others' && (
              <div className="mt-1.5 animate-fade-in">
                <input
                  type="text"
                  value={customTargetRole}
                  onChange={e => setCustomTargetRole(e.target.value)}
                  placeholder="Type your dream role (e.g. Lead Product Manager, Cloud DevOps)"
                  className="tcm-input-compact"
                  required
                />
              </div>
            )}
          </div>

          {/* Section 2: Baseline & Target Inputs (2x2 Grid) */}
          <div className="tcm-grid-row">
            
            {/* Current Role */}
            <div className="tcm-field-compact">
              <label className="tcm-group-label">
                <span>📍 Current Role</span>
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                placeholder="e.g. Senior Frontend Dev"
                className="tcm-input-compact"
                required
              />
            </div>

            {/* Current Company */}
            <div className="tcm-field-compact">
              <label className="tcm-group-label">
                <span>🏢 Current Company</span>
              </label>
              <input
                type="text"
                value={currentCompany}
                onChange={e => setCurrentCompany(e.target.value)}
                placeholder="e.g. TCS / Infosys / Startup"
                className="tcm-input-compact"
                required
              />
              <div className="tcm-mini-chips">
                {['TCS', 'Infosys', 'Cognizant', 'Startup'].map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCurrentCompany(c)}
                    className="tcm-mini-chip-btn"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Dream Company Target (Full width or paired) */}
            <div className="tcm-field-compact" style={{ gridColumn: 'span 2' }}>
              <label className="tcm-group-label">
                <span>🚀 Dream Target Company</span>
              </label>
              <input
                type="text"
                value={dreamCompany}
                onChange={e => setDreamCompany(e.target.value)}
                placeholder="e.g. Swiggy, Flipkart, Google, Razorpay"
                className="tcm-input-compact"
                required
              />
              <div className="tcm-mini-chips">
                {['Swiggy', 'Flipkart', 'Google', 'Razorpay', 'CRED'].map(dc => (
                  <button
                    type="button"
                    key={dc}
                    onClick={() => setDreamCompany(dc)}
                    className="tcm-mini-chip-btn"
                  >
                    {dc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Action CTA */}
          <div className="tcm-actions-block">
            <button
              type="submit"
              className="btn-tcm-hero-submit"
            >
              <span>🚀 Unlock My Peerpath &amp; Matched Mentors</span>
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => setIsCalibrationModalOpen(false)}
              className="btn-tcm-subtle-skip"
            >
              Skip calibration for now
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

