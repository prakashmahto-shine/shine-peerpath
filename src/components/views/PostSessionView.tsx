import React, { useState } from 'react';
import { Star, CheckCircle2, ShieldCheck, UserCheck, Eye, Compass, ChevronRight } from 'lucide-react';
import { Expert, ViewType } from '../../types';

interface PostSessionViewProps {
  expert: Expert;
  onNavigate: (view: ViewType) => void;
}

export const PostSessionView: React.FC<PostSessionViewProps> = ({
  expert,
  onNavigate,
}) => {
  const [rating, setRating] = useState<number>(5);

  const handleSubmit = () => {
    alert('Thank you! Your review has been submitted and your Shine Peer-Verified Badge is now active on your profile.');
    onNavigate('profile-view');
  };

  return (
    <div className="content-wrapper post-session-layout">
      <div className="post-session-grid">
        <div className="feedback-form-card">
          <div className="feedback-header">
            <h2 className="f-title">How was your session with {expert.name}?</h2>
            <p className="f-subtitle">Your rating helps maintain community trust and high mentorship quality.</p>
          </div>

          <div className="star-rating-selector">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={32}
                className={`star-item ${num <= rating ? 'active' : ''}`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>

          <div className="review-input-group">
            <label>Write a review (optional)</label>
            <textarea
              rows={4}
              defaultValue={`${expert.name} completely transformed my approach to career transitions. The framework shared for handling interview objections was invaluable!`}
              placeholder="Share your key learnings..."
            />
          </div>

          <button className="btn-shine-gold-lg w-100" onClick={handleSubmit}>
            <CheckCircle2 size={18} /> Submit Review
          </button>
        </div>

        <div className="post-outcome-card">
          
          <div className="badge-unlocked-banner">
            <div className="badge-shield-anim">
              <ShieldCheck size={28} />
            </div>
            <div className="badge-text-col">
              <span className="badge-supertitle">RECRUITER VISIBILITY BOOST</span>
              <h3>"{expert.domain} Production Ready" Badge Earned!</h3>
              <p>Verified by <strong>{expert.name} ({expert.company})</strong> based on your live session evaluation rubric.</p>
            </div>
          </div>

          <h3 className="whats-next-title">What's Next?</h3>

          <div className="next-action-cards-stack">
            
            <div className="na-card" onClick={() => onNavigate('profile-view')}>
              <div className="na-icon"><UserCheck size={18} /></div>
              <div>
                <strong>Apply learnings to your Shine profile</strong>
                <span>Auto-sync new keywords and verified badge to your CV</span>
              </div>
              <ChevronRight size={16} className="na-arrow" />
            </div>

            <div className="na-card" onClick={() => onNavigate('recruiter-view')}>
              <div className="na-icon text-brand-gold"><Eye size={18} /></div>
              <div>
                <strong>See how recruiters now view your profile</strong>
                <span>Preview your badge in Shine Recruiter search portal</span>
              </div>
              <ChevronRight size={16} className="na-arrow" />
            </div>

            <div className="na-card" onClick={() => onNavigate('experts-view')}>
              <div className="na-icon"><Compass size={18} /></div>
              <div>
                <strong>Explore more experts & mock interviews</strong>
                <span>Connect with senior engineering & tech leads</span>
              </div>
              <ChevronRight size={16} className="na-arrow" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
