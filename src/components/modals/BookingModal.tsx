import React, { useMemo, useState, useEffect } from 'react';
import { 
  X, Video, Clock, ArrowRight, Lock, 
  CheckCircle2, Calendar, RefreshCw, 
  TrendingUp, FileText, Sparkles, Compass
} from 'lucide-react';
import { Expert } from '../../types';
import { useApp } from '../../context/AppContext';

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
    { time: '09:00 PM - 10:00 PM', label: '09:00 PM', period: 'Late Eve' }
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

  const expert: Expert = propExpert || bookingDraft?.expert || selectedExpert || {
    id: 'naveen-ai',
    name: 'Naveen Chandran',
    role: 'Staff GenAI & UI Platform Architect',
    company: 'Google',
    domain: 'Generative AI',
    experience: '8+ Yrs',
    rating: 4.96,
    reviewsCount: 162,
    sessionsCount: 340,
    price: 1399,
    location: 'Bengaluru, India',
    duration: '01:15',
    avatar: '/avatars/akash.jpg',
    videoPoster: '/avatars/akash.jpg',
    teaserTitle: 'Transitioning into High-Impact Tech',
    skills: ['Generative AI', 'LLMs', 'LangChain', 'React.js'],
    bio: 'Staff GenAI & UI Platform Architect at Google.',
    verifiedEmail: 'naveen.ai@google.com',
    isVerifiedEmployer: true
  };

  const expertName = expert?.name || 'Mentor';
  const expertAvatar = expert?.avatar || '/avatars/akash.jpg';
  const expertRole = expert?.role || 'Tech Leader';
  const expertCompany = expert?.company || 'Top Tech Firm';
  const expertPrice = expert?.price || 1399;

  // 4 Harmonized 1:1 Services
  const sessionOfferings = useMemo(() => {
    const base = expertPrice || 1399;
    return [
      {
        id: 'career-guidance',
        title: 'Career Guidance & Strategy',
        icon: Compass,
        duration: '30 Mins',
        price: base,
      },
      {
        id: 'interview-prep',
        title: '1:1 Mock Interview & Scorecard',
        icon: Video,
        duration: '30 Mins',
        price: base,
      },
      {
        id: 'resume-review',
        title: 'CV Audit & ATS Teardown',
        icon: FileText,
        duration: '30 Mins',
        price: Math.max(499, Math.round((base * 0.7) / 50) * 50 - 1),
      },
      {
        id: 'salary-negotiation',
        title: 'Salary & Offer Negotiation',
        icon: TrendingUp,
        duration: '30 Mins',
        price: Math.max(699, Math.round((base * 0.85) / 50) * 50 - 1),
      }
    ];
  }, [expertPrice]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('career-guidance');

  // Keep selected session in sync with booking draft when opened with pre-selected service
  useEffect(() => {
    if (bookingDraft?.sessionType) {
      const draftTitle = bookingDraft.sessionType.toLowerCase();
      const matched = sessionOfferings.find(s => 
        s.title.toLowerCase() === draftTitle || 
        s.id === bookingDraft.sessionType ||
        (draftTitle.includes('career') && s.id === 'career-guidance') ||
        (draftTitle.includes('mock') || draftTitle.includes('interview')) && s.id === 'interview-prep' ||
        (draftTitle.includes('cv') || draftTitle.includes('resume')) && s.id === 'resume-review' ||
        (draftTitle.includes('salary') || draftTitle.includes('negotiation')) && s.id === 'salary-negotiation'
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
    // Launch candidate acquisition / profile update popup directly
    setPendingBookingCheckout(true);
    setIsBookingModalOpen(false);
    setIsUpdateProfileModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="app-modal-backdrop open" onClick={onClose}>
      <div className="app-modal-card bfm-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Header */}
        <div className="bfm-header">
          <div className="bfm-mentor-identity">
            <div className="bfm-avatar-wrap">
              <img src={expertAvatar} alt={expertName} className="bfm-avatar" />
              <span className="bfm-online-dot"></span>
            </div>
            <div className="bfm-mentor-meta">
              <div className="bfm-name-row">
                <span className="bfm-sub-label">Booking 1:1 Session with</span>
                <div className="bfm-name-flex">
                  <h3 className="bfm-mentor-name">{expertName}</h3>
                  <span className="bfm-verified-pill" title="Verified Practitioner">
                    <CheckCircle2 size={13} />
                  </span>
                </div>
              </div>
              <p className="bfm-role-text">{expertRole} • {expertCompany}</p>
            </div>
          </div>

          <button className="bfm-close-btn" onClick={onClose} aria-label="Close booking modal">
            <X size={18} />
          </button>
        </div>

        {/* Service Segmented Switcher (Compact Goal Selector) */}
        <div className="bfm-services-selector">
          <span className="bfm-services-label">
            <Sparkles size={12} className="text-amber-500" />
            <span>Session Goal:</span>
          </span>
          <div className="bfm-services-chips">
            {sessionOfferings.map((session) => {
              const isSelected = selectedSessionId === session.id;
              const IconComp = session.icon;
              return (
                <button
                  type="button"
                  key={session.id}
                  className={`bfm-service-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedSessionId(session.id)}
                >
                  <IconComp size={12} />
                  <span className="bfm-sc-name">{session.title}</span>
                  <span className="bfm-sc-price">₹{session.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body: 2 Clean Frictionless Steps */}
        <div className="bfm-body">
          
          {/* Step 1: Select Date */}
          <div className="bfm-section">
            <div className="bfm-section-header">
              <div className="bfm-sec-title">
                <Calendar size={13} className="text-blue-600" />
                <span>1. Select Date</span>
              </div>
              <span className="bfm-active-date-badge">{activeDateStr}</span>
            </div>

            <div className="bfm-dates-strip">
              {next7Days.map((d) => {
                const isSelected = activeDateStr === d.fullDateStr;
                return (
                  <button
                    type="button"
                    key={d.fullDateStr}
                    className={`bfm-date-card ${isSelected ? 'active' : ''} ${d.isToday ? 'today' : ''}`}
                    onClick={() => onSelectDate(d.fullDateStr)}
                  >
                    <span className="bfm-d-tag">{d.tag}</span>
                    <strong className="bfm-d-num">{d.dayNum}</strong>
                    <span className="bfm-d-month">{d.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Time Slot */}
          <div className="bfm-section">
            <div className="bfm-section-header">
              <div className="bfm-sec-title">
                <Clock size={13} className="text-indigo-600" />
                <span>2. Choose Time Slot</span>
              </div>
              <span className="bfm-duration-pill">30 Mins Live Video</span>
            </div>

            {availableSlots.length > 0 ? (
              <div className="bfm-slots-grid">
                {availableSlots.map((slot) => {
                  const isSelected = (selectedTime || availableSlots[0]?.time) === slot.time;
                  return (
                    <button
                      type="button"
                      key={slot.time}
                      className={`bfm-slot-card ${isSelected ? 'active' : ''}`}
                      onClick={() => onSelectTime(slot.time)}
                    >
                      <span className="bfm-slot-time">{slot.label}</span>
                      <span className="bfm-slot-period">{slot.period}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bk-no-slots-box">
                <Clock size={16} className="text-amber-600 flex-shrink-0" />
                <div>
                  <strong>All slots for today have completed.</strong>
                  <p>Please select <strong>Tomorrow</strong> or another date from the calendar.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer: Summary & Checkout CTA */}
        <div className="bfm-footer">
          <div className="bfm-footer-price-block">
            <div className="bfm-price-line">
              <span className="bfm-p-curr">₹</span>
              <span className="bfm-p-amount">{payableAmount}</span>
              <span className="bfm-p-session">/ session</span>
            </div>
            <div className="bfm-trust-line">
              <span className="bfm-trust-item">
                <RefreshCw size={11} className="text-emerald-600" /> Free Reschedule Anytime
              </span>
            </div>
          </div>

          <button 
            type="button" 
            className="btn-shine-gold-lg bfm-pay-btn" 
            onClick={handleProceed}
          >
            <span>Continue to Pay</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="bfm-secure-bar">
          <Lock size={11} className="text-emerald-600" />
          <span>100% Safe & Encrypted Payments via <strong>Shine Razorpay Gateway</strong></span>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;
