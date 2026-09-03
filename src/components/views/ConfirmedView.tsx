import React, { useEffect } from 'react';
import { Check, Calendar, Sparkles, CalendarPlus, Video, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const ConfirmedView: React.FC = () => {
  const { bookingDraft, navigate, userProfile } = useApp();
  const { expert, date, timeSlot } = bookingDraft;

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  return (
    <div className="content-wrapper confirmation-card-wrapper">
      <div className="conf-card">
        
        <div className="conf-success-icon">
          <Check size={36} />
        </div>

        <h1 className="conf-title">Session Booked Successfully!</h1>
        <p className="conf-subtitle">We've sent a calendar invite and video room link to <strong>{userProfile.email}</strong>.</p>

        <div className="conf-session-info-card">
          <img src={expert.avatar} alt={expert.name} className="conf-avatar" />
          <div className="conf-meta">
            <h3>{expert.name}</h3>
            <p>{expert.role} at {expert.company}</p>
            <div className="conf-timing-badge">
              <Calendar size={13} /> {date} • {timeSlot}
            </div>
          </div>
          <div className="conf-price-badge">₹{expert.price} Paid</div>
        </div>

        <div className="conf-checklist-box">
          <h4><Sparkles size={16} /> What happens next?</h4>
          <ol>
            <li>Your Shine CV and Trajectory Gap Report have been automatically pre-loaded for {expert.name}.</li>
            <li>You will receive a WhatsApp reminder 15 minutes before the call starts.</li>
            <li>Post-session, your mentor will review and approve your <strong>Shine Verified Peer Badge</strong>.</li>
          </ol>
        </div>

        <div className="conf-actions-row">
          <button className="btn-outline-dark" onClick={() => alert('Calendar (.ics) invite downloaded!')}>
            <CalendarPlus size={16} /> Add to Calendar
          </button>
          <button className="btn-shine-gold" onClick={() => navigate('sessions-view')}>
            <Video size={16} /> Go to My Sessions <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
