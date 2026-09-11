import React, { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PostSessionView: React.FC = () => {
  const { activeSession, selectedExpert, navigate, completeSession, showToast } = useApp();
  const expert = activeSession?.expert || selectedExpert;

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>(
    `${expert.name} completely transformed my approach to career transitions. The framework shared for handling interview objections and system design was invaluable!`
  );

  const handleSubmit = () => {
    if (activeSession) {
      completeSession(activeSession.id, rating, reviewText, `${expert.domain} Production Ready`);
    }
    showToast('Review Submitted', 'Thank you for your feedback! Your review has been saved.', 'success');
    navigate('profile-view');
  };

  return (
    <div className="content-wrapper post-session-layout post-session-single-card">
      <div className="feedback-form-card">
        <div className="feedback-header">
          <h2 className="f-title">How was your session with {expert.name}?</h2>
          <p className="f-subtitle">Your rating helps maintain community trust and high mentorship quality on Shine.</p>
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
          <label>Write a review for {expert.name}</label>
          <textarea
            rows={5}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your key learnings..."
            className="custom-textarea"
          />
        </div>

        <button className="btn-shine-gold-lg w-100" onClick={handleSubmit}>
          <CheckCircle2 size={18} /> Submit Review & Save to Profile
        </button>
      </div>
    </div>
  );
};
