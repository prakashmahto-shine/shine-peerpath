import React, { useState } from 'react';
import { Star, CheckCircle2, Download, Video, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PostSessionView: React.FC = () => {
  const { activeSession, selectedExpert, navigate, completeSession, showToast } = useApp();
  const expert = activeSession?.expert || selectedExpert;

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>(
    `${expert.name} completely transformed my approach to career transitions. The framework shared for handling interview loops and system design was invaluable!`
  );

  const sessionId = activeSession?.id || `sess-${expert.id}-live`;
  const recordingDownloadUrl = activeSession?.recordingUrl || `/api/sessions/${sessionId.replace(/^sess-/, '')}/recording`;

  const handleSubmit = () => {
    if (activeSession) {
      completeSession(activeSession.id, rating, reviewText, `${expert.domain} Production Ready`);
    }
    showToast('Review Submitted', 'Thank you for your feedback! Your review and recording have been saved.', 'success');
    navigate('sessions-view');
  };

  return (
    <div className="content-wrapper post-session-layout post-session-single-card">
      <div className="feedback-form-card">
        {/* Top Success Banner */}
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Video size={18} />
            </div>
            <div>
              <strong style={{ color: '#065F46', fontSize: '13.5px', display: 'block' }}>1:1 Video Session Completed &amp; Recorded</strong>
              <span style={{ color: '#047857', fontSize: '11.5px' }}>HD session recording has been synced to your Shine Peerpath profile.</span>
            </div>
          </div>
          <a
            href={recordingDownloadUrl}
            download={`shine-peerpath-session-${sessionId}.webm`}
            className="btn-ghost-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#FFFFFF', border: '1px solid #6EE7B7', color: '#065F46', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, textDecoration: 'none' }}
          >
            <Download size={13} /> Download Recording
          </a>
        </div>

        <div className="feedback-header">
          <h2 className="f-title">How was your mentorship with {expert.name}?</h2>
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
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your key learnings..."
            className="custom-textarea"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button type="button" className="btn-shine-gold-lg w-100" onClick={handleSubmit}>
            <CheckCircle2 size={18} /> Submit Review &amp; Go to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};
