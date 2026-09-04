import React, { useState } from 'react';
import { X, Award, Star, CheckCircle2, ShieldCheck, Sparkles, User, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MentorAssessmentModal: React.FC = () => {
  const { 
    isAssessmentModalOpen, 
    setIsAssessmentModalOpen, 
    assessmentDraftSession, 
    completeSession,
    awardBadge 
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [badgeTitle, setBadgeTitle] = useState<string>('Tier-1 UI Architecture & Performance');
  const [feedbackNotes, setFeedbackNotes] = useState<string>(
    'Prakash demonstrated strong technical clarity in Next.js architecture, component lifecycle optimization, and clean state design. Highly recommended for Senior Frontend roles at top product companies.'
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React.js 19',
    'Next.js App Router',
    'Core Web Vitals',
    'Micro-Frontends'
  ]);

  if (!isAssessmentModalOpen || !assessmentDraftSession) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleIssueBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (assessmentDraftSession) {
      completeSession(assessmentDraftSession.id, rating, feedbackNotes, badgeTitle);
      
      const newBadge = {
        id: 'badge-' + Date.now(),
        title: badgeTitle,
        subtitle: `Verified by ${assessmentDraftSession.expert.name} • ${assessmentDraftSession.expert.role} @ ${assessmentDraftSession.expert.company}`,
        verifierName: assessmentDraftSession.expert.name,
        verifierRole: `${assessmentDraftSession.expert.role} @ ${assessmentDraftSession.expert.company}`,
        verifierAvatar: assessmentDraftSession.expert.avatar,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        skills: selectedSkills,
        status: 'verified' as const
      };
      awardBadge(newBadge);
      setIsAssessmentModalOpen(false);
    }
  };

  const availableSkillTags = [
    'React.js 19',
    'Next.js App Router',
    'Core Web Vitals',
    'Micro-Frontends',
    'TypeScript 5.x',
    'State Architecture',
    'Machine Coding Practice',
    'Salary Negotiation Strategy'
  ];

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card assessment-modal-card">
        <button 
          className="modal-close-btn" 
          onClick={() => setIsAssessmentModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="assessment-modal-header">
          <div className="assessment-badge-pill">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Official Shine Mentor Evaluation</span>
          </div>
          <h2 className="assessment-modal-title">Post-Session Candidate Assessment</h2>
          <p className="assessment-modal-subtitle">
            Evaluate <strong>{assessmentDraftSession.candidateName}</strong> and issue their recruiter-facing <strong>Shine Verified Skill Badge</strong>.
          </p>
        </div>

        {/* Candidate Summary Box */}
        <div className="as-candidate-summary-box">
          <div className="as-candidate-avatar-wrap">
            <img 
              src={assessmentDraftSession.candidateAvatar || '/avatars/prakash.jpg'} 
              alt={assessmentDraftSession.candidateName} 
              className="as-candidate-avatar"
            />
          </div>
          <div className="as-candidate-info">
            <h4>{assessmentDraftSession.candidateName}</h4>
            <p>{assessmentDraftSession.candidateRole || 'Senior Frontend Developer'}</p>
            <span className="as-session-time-chip">
              Session: {assessmentDraftSession.date} • {assessmentDraftSession.timeSlot}
            </span>
          </div>
        </div>

        <form onSubmit={handleIssueBadge} className="assessment-form-stack">
          
          {/* Star Rating Selector */}
          <div className="as-field-group">
            <label className="as-field-label">
              <Star size={14} className="text-amber-500" /> 1. Overall Candidate Proficiency Rating
            </label>
            <div className="as-star-rating-row">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  type="button"
                  key={starVal}
                  className={`as-star-btn ${rating >= starVal ? 'active-star' : ''}`}
                  onClick={() => setRating(starVal)}
                >
                  <Star size={20} fill={rating >= starVal ? '#F59E0B' : 'none'} color={rating >= starVal ? '#F59E0B' : '#CBD5E1'} />
                </button>
              ))}
              <span className="as-rating-text">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (Top 5%)' : `${rating} out of 5 Stars`}
              </span>
            </div>
          </div>

          {/* Verified Skills Checklist */}
          <div className="as-field-group">
            <label className="as-field-label">
              <CheckCircle2 size={14} className="text-blue-500" /> 2. Verified Technical Skills (Select all demonstrated)
            </label>
            <div className="as-skills-pill-grid">
              {availableSkillTags.map((skill) => {
                const isChecked = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    className={`as-skill-chip ${isChecked ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {isChecked && <CheckCircle2 size={12} />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge Title Input */}
          <div className="as-field-group">
            <label className="as-field-label">
              <Award size={14} className="text-purple-500" /> 3. Verified Skill Badge Title (Displayed on Candidate's Profile)
            </label>
            <input 
              type="text" 
              value={badgeTitle}
              onChange={(e) => setBadgeTitle(e.target.value)}
              className="as-text-input"
              required
            />
          </div>

          {/* Feedback & Recommendations Notes */}
          <div className="as-field-group">
            <label className="as-field-label">
              <FileText size={14} className="text-emerald-500" /> 4. Mentor Feedback & Recruiter Recommendation Notes
            </label>
            <textarea 
              rows={3}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              className="as-textarea-input"
              placeholder="Write feedback for the candidate..."
              required
            />
          </div>

          {/* Submit CTA */}
          <div className="as-modal-footer">
            <button 
              type="button" 
              className="btn-as-cancel"
              onClick={() => setIsAssessmentModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-as-issue-badge"
            >
              <Award size={16} />
              <span>Issue Shine Verified Skill Badge</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
