import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  X, Video, Clock, ShieldCheck, Info, ArrowRight, ArrowLeft, Lock, 
  CheckCircle2, Calendar, Star, FileText, UploadCloud, Sparkles, RefreshCw, Trash2,
  TrendingUp, Award, Target, Check, Compass
} from 'lucide-react';
import { Expert } from '../../types';
import { useApp } from '../../context/AppContext';
import { peerpathApi } from '../../services/api';

interface BookingModalProps {
  expert?: Expert;
  isOpen: boolean;
  selectedDate?: string;
  selectedTime?: string;
  onClose: () => void;
  onSelectDate: (dateStr: string) => void;
  onSelectTime: (timeStr: string) => void;
  onProceedToPay: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  expert: propExpert,
  isOpen,
  selectedDate,
  selectedTime,
  onClose,
  onSelectDate,
  onSelectTime,
  onProceedToPay,
}) => {
  const { 
    userProfile, 
    bookingDraft, 
    setBookingDraft, 
    selectedExpert,
    setIsBookingModalOpen,
    setIsUpdateProfileModalOpen,
    setPendingBookingCheckout,
    showToast
  } = useApp();

  // Dynamically calculate next 7 days starting strictly from Today
  const next7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      const fullDateStr = `${dayOfWeek}, ${dayNum} ${month} ${d.getFullYear()}`;
      days.push({
        dateObj: d,
        fullDateStr,
        dayOfWeek,
        month,
        dayNum,
        isToday: i === 0,
        isTomorrow: i === 1,
        tag: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayOfWeek
      });
    }
    return days;
  }, []);

  const allSlots = useMemo(() => [
    { time: '10:00 AM - 11:00 AM', label: '10:00 AM', period: 'Morning' },
    { time: '11:30 AM - 12:30 PM', label: '11:30 AM', period: 'Morning' },
    { time: '02:00 PM - 03:00 PM', label: '02:00 PM', period: 'Afternoon' },
    { time: '04:30 PM - 05:30 PM', label: '04:30 PM', period: 'Afternoon' },
    { time: '06:30 PM - 07:30 PM', label: '06:30 PM', period: 'Evening' },
    { time: '08:00 PM - 09:00 PM', label: '08:00 PM', period: 'Evening' },
    { time: '09:00 PM - 10:00 PM', label: '09:00 PM', period: 'Late Evening' }
  ], []);

  // Helper to parse slot start time safely
  const parseSlotStartHour = (slotTimeStr: string): number => {
    try {
      if (!slotTimeStr || typeof slotTimeStr !== 'string') return 0;
      const parts = slotTimeStr.split(' - ');
      if (!parts[0]) return 0;
      const timeAndMeridian = parts[0].trim().split(' ');
      if (timeAndMeridian.length < 2) return 0;
      const time = timeAndMeridian[0];
      const meridian = timeAndMeridian[1];
      const timeParts = time.split(':');
      let hour = parseInt(timeParts[0] || '0', 10);
      const min = parseInt(timeParts[1] || '0', 10);
      if (isNaN(hour)) return 0;
      if (meridian === 'PM' && hour !== 12) hour += 12;
      if (meridian === 'AM' && hour === 12) hour = 0;
      return hour + (isNaN(min) ? 0 : min) / 60;
    } catch {
      return 0;
    }
  };

  const isSelectedInList = Boolean(selectedDate && next7Days.some(d => d.fullDateStr === selectedDate));
  const activeDateStr = isSelectedInList 
    ? (selectedDate as string)
    : (next7Days[1]?.fullDateStr || next7Days[0]?.fullDateStr || 'Tomorrow, 5 Sep');

  const isSelectedDayToday = Boolean(next7Days.find(d => d.fullDateStr === activeDateStr)?.isToday);

  // Real-time slot filtering
  const availableSlots = useMemo(() => {
    if (!isSelectedDayToday) {
      return allSlots;
    }
    const now = new Date();
    const currentDecimalHour = now.getHours() + now.getMinutes() / 60;
    const filtered = allSlots.filter(s => parseSlotStartHour(s.time) > currentDecimalHour + 0.25);
    return filtered.length > 0 ? filtered : allSlots;
  }, [isSelectedDayToday, allSlots]);

  const expert = propExpert || bookingDraft?.expert || selectedExpert || {
    id: 'akash',
    name: 'Akash Jain',
    role: 'Lead Product Manager',
    company: 'Shine (HT Media)',
    domain: 'Product Management',
    experience: '7+ Years Exp.',
    rating: 4.95,
    reviewsCount: 142,
    sessionsCount: 280,
    price: 999,
    location: 'Bengaluru / Hybrid',
    duration: '01:00',
    avatar: '/avatars/akash.jpg',
    videoPoster: '/avatars/akash.jpg',
    teaserTitle: 'Teaser: Transitioning from SDE-2 to High-Impact Product Management',
    skills: ['PRD Writing', 'Product Discovery', 'Growth Metrics', 'A/B Testing'],
    bio: 'Lead PM at Shine managing Career Multiplier & Peerpath.',
    verifiedEmail: 'akash.jain@shine.com',
    isVerifiedEmployer: true
  };

  const expertName = expert?.name || 'Mentor';
  const expertAvatar = expert?.avatar || '/avatars/akash.jpg';
  const expertRole = expert?.role || 'Tech Leader';
  const expertCompany = expert?.company || 'Top Tech Product Firm';
  const expertPrice = expert?.price || 999;
  const expertRating = expert?.rating || 4.9;
  const expertReviewsCount = expert?.reviewsCount || 100;

  // Customizable session offerings per expert
  const sessionOfferings = useMemo(() => {
    const base = expertPrice || 999;
    return [
      {
        id: 'career-guidance',
        title: 'Career guidance',
        duration: '30 Mins',
        price: base,
        desc: 'Personalized career roadmap, transition guidance & target company strategy',
        deliverables: [
          { icon: Compass, title: '1:1 Career Roadmap Strategy', desc: 'Target company skill gap audit & transition planning' },
          { icon: Clock, title: '30 Minutes Dedicated Guidance', desc: 'Direct actionable feedback on your career trajectory' },
          { icon: ShieldCheck, title: 'Verified Transition Playbook', desc: 'Practical step-by-step roadmap to achieve your target role' }
        ]
      },
      {
        id: 'interview-prep',
        title: 'Interview prep',
        duration: '30 Mins',
        price: base,
        desc: 'Target company technical / case interview simulation & instant rubric feedback',
        deliverables: [
          { icon: Video, title: '1:1 Live Mock Interview', desc: 'Target company coding, system design or PRD questions' },
          { icon: Clock, title: '30 Minutes Focused Simulation', desc: 'Immediate feedback on problem-solving, depth & communication' },
          { icon: ShieldCheck, title: 'Official Shine Scorecard', desc: 'Personalized rubric assessment & verified feedback' }
        ]
      },
      {
        id: 'resume-review',
        title: 'Portfolio / resume review',
        duration: '30 Mins',
        price: Math.max(499, Math.round((base * 0.7) / 50) * 50 - 1),
        desc: 'Line-by-line ATS resume review, project showcase tuning & keyword boost',
        deliverables: [
          { icon: FileText, title: 'Line-by-Line CV Teardown', desc: 'ATS formatting audit, high-impact bullet points & metrics phrasing' },
          { icon: Clock, title: '30 Minutes Focused Review', desc: 'GitHub, portfolio & live project showcase optimization' },
          { icon: Sparkles, title: 'Recruiter Visibility Boost', desc: 'Maximize recruiter shortlists on Shine candidate search' }
        ]
      },
      {
        id: 'salary-negotiation',
        title: 'Salary negotiation guidance',
        duration: '30 Mins',
        price: Math.max(699, Math.round((base * 0.85) / 50) * 50 - 1),
        desc: 'Offer letter benchmarking, counter-offer strategy & compensation optimization',
        deliverables: [
          { icon: TrendingUp, title: 'Compensation Benchmarking', desc: 'Market standard salary bands for your role, tier & experience' },
          { icon: Clock, title: '30 Minutes Strategy Session', desc: 'Offer evaluation, counter-offer scripting & negotiation tactics' },
          { icon: ShieldCheck, title: 'Insider Industry Bands', desc: 'Fixed CTC, variable bonus & ESOP equity breakdowns' }
        ]
      }
    ];
  }, [expertPrice]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('career-guidance');

  // Keep selected session in sync with booking draft when opened with pre-selected service
  useEffect(() => {
    if (bookingDraft?.sessionType) {
      const matched = sessionOfferings.find(s => 
        s.title.toLowerCase() === bookingDraft.sessionType?.toLowerCase() || 
        s.id === bookingDraft.sessionType
      );
      if (matched) {
        setSelectedSessionId(matched.id);
      }
    }
  }, [bookingDraft?.sessionType, sessionOfferings]);
  const activeSession = sessionOfferings.find(s => s.id === selectedSessionId) || sessionOfferings[0];
  const payableAmount = activeSession.price;

  const handleProceed = () => {
    const slotTime = selectedTime || availableSlots[0]?.time || '10:00 AM - 11:00 AM';
    if (setBookingDraft) {
      setBookingDraft({
        expert,
        date: activeDateStr,
        timeSlot: slotTime,
        attachedCvName: userProfile?.resumeFileName || '',
        sessionType: activeSession.title,
        amount: payableAmount,
        duration: activeSession.duration
      });
    }
    // Launch candidate acquisition / profile update popup directly (same popup as profile page)
    setPendingBookingCheckout(true);
    setIsBookingModalOpen(false);
    setIsUpdateProfileModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card booking-modal-size">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>
        
        <div className="booking-modal-grid">
          
          {/* Left Summary Box: Full-Height Mentor Profile Spotlight */}
          <div className="booking-left-summary">
            <div className="bk-sec-header">
              <h3 className="modal-sec-title">Mentor Profile</h3>
              <span className="bk-badge-1on1">{activeSession.duration} • 1:1 Live</span>
            </div>
            
            <div className="bk-expert-full-profile-card">
              <div className="bk-fp-avatar-wrap">
                <img src={expertAvatar} alt={expertName} className="bk-fp-avatar" />
                <span className="bk-fp-online-badge" title="Active on PeerPath"></span>
              </div>

              <div className="bk-fp-name-block">
                <div className="bk-fp-name-row">
                  <h4>{expertName}</h4>
                  <span className="bk-fp-verified-tag">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </div>
                <p className="bk-fp-role">{expertRole}</p>
                <span className="bk-fp-company-tag">@{expertCompany}</span>
              </div>

              <div className="bk-fp-stats-strip">
                <div className="bk-fp-stat-item">
                  <div className="bk-fp-stat-val">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <strong>{expertRating}</strong>
                  </div>
                  <span>{expertReviewsCount} reviews</span>
                </div>
                <div className="bk-fp-stat-divider"></div>
                <div className="bk-fp-stat-item">
                  <div className="bk-fp-stat-val">
                    <Video size={12} className="text-purple-600" />
                    <strong>{expert.sessionsCount || 140}+</strong>
                  </div>
                  <span>1:1 Calls</span>
                </div>
                <div className="bk-fp-stat-divider"></div>
                <div className="bk-fp-stat-item">
                  <div className="bk-fp-stat-val">
                    <Award size={12} className="text-emerald-600" />
                    <strong>{expert.experience || '7+ Yrs'}</strong>
                  </div>
                  <span>Experience</span>
                </div>
              </div>

              {/* Focus Skills */}
              {expert.skills && expert.skills.length > 0 && (
                <div className="bk-fp-skills-wrap">
                  <span className="bk-fp-skills-label">Focus Areas</span>
                  <div className="bk-fp-skills-chips">
                    {expert.skills.slice(0, 4).map((s: string) => (
                      <span key={s} className="bk-fp-skill-chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bk-fp-trust-footer">
                <Lock size={11} className="text-emerald-600" />
                <span>100% Confidential • Instant Calendar Invite</span>
              </div>
            </div>
          </div>

          {/* Right Date & Slot Picker */}
          <div className="booking-right-picker">
            <div className="bk-step-header">
              <h3 className="modal-sec-title">Schedule Mentorship Session</h3>
            </div>

            {/* Scrollable Middle Container */}
            <div className="bk-right-scroll-content">

              {/* Step 1: Session Format / Goal Selection */}
              <div className="bk-session-type-section">
                <label className="bk-field-label">
                  <Sparkles size={14} className="text-amber-500" /> 1. Choose Session Goal / Service
                </label>
                
                <div className="bk-session-types-grid">
                  {sessionOfferings.map((session) => {
                    const isSelected = selectedSessionId === session.id;
                    return (
                      <button
                        type="button"
                        key={session.id}
                        className={`bk-session-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <div className="bk-sc-radio-row">
                          <span className={`bk-sc-radio ${isSelected ? 'selected' : ''}`}>
                            {isSelected && <span className="bk-sc-radio-dot" />}
                          </span>
                          <span className="bk-sc-title">{session.title}</span>
                        </div>

                        <div className="bk-sc-bottom-meta">
                          <span className="bk-sc-dur">{session.duration}</span>
                          <span className="bk-sc-price">₹{session.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: 7-Day Date Grid */}
              <div className="bk-date-selector-wrapper">
                <label className="bk-field-label">
                  <Calendar size={13} /> 2. Select Date
                </label>
                
                <div className="bk-dates-horizontal-strip">
                  {next7Days.map((d) => {
                    const isSelected = activeDateStr === d.fullDateStr;
                    return (
                      <button
                        type="button"
                        key={d.fullDateStr}
                        className={`bk-date-card ${isSelected ? 'active' : ''} ${d.isToday ? 'today-card' : ''}`}
                        onClick={() => onSelectDate(d.fullDateStr)}
                      >
                        <span className="bk-date-tag">{d.tag}</span>
                        <strong className="bk-date-number">{d.dayNum}</strong>
                        <span className="bk-date-month">{d.month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Available Time Slots */}
              <div className="time-slots-container">
                <label className="bk-field-label">
                  <Clock size={14} /> 3. Choose Time Slot for <strong>{activeDateStr}</strong>
                </label>

                {availableSlots.length > 0 ? (
                  <div className="slots-pill-grid">
                    {availableSlots.map((slot) => {
                      const isSelected = (selectedTime || availableSlots[0]?.time) === slot.time;
                      return (
                        <button
                          type="button"
                          key={slot.time}
                          className={`slot-pill ${isSelected ? 'active-slot' : ''}`}
                          onClick={() => onSelectTime(slot.time)}
                        >
                          <span className="slot-pill-time">{slot.label}</span>
                          <span className="slot-pill-period">{slot.period}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bk-no-slots-box">
                    <Clock size={18} className="text-amber-600 flex-shrink-0" />
                    <div>
                      <strong>All slots for today have completed.</strong>
                      <p>Please select <strong>Tomorrow</strong> or another date from the calendar.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="booking-modal-footer">
              <div className="footer-price-col">
                <span className="f-p-label">Total Payable Amount</span>
                <div className="f-p-price-row">
                  <span className="f-p-amount">₹{payableAmount}</span>
                  <span className="f-p-tax">({activeSession.title})</span>
                </div>
              </div>
              
              <button 
                type="button" 
                className="btn-shine-gold-lg bk-pay-btn" 
                onClick={handleProceed}
              >
                <span>Continue to Pay</span>
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="secure-badge-note">
              <Lock size={13} className="text-emerald-600" />
              <span>100% Safe & Encrypted Payments via <strong>Shine Razorpay Gateway</strong></span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
