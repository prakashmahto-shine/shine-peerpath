import React, { useMemo, useState, useRef } from 'react';
import { 
  X, Video, Clock, ShieldCheck, Info, ArrowRight, Lock, 
  CheckCircle2, Calendar, Star, FileText, UploadCloud, Sparkles, RefreshCw, Trash2,
  TrendingUp, Award, Target, Check
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
    updateCandidateResume, 
    removeCandidateResume, 
    bookingDraft, 
    setBookingDraft, 
    selectedExpert,
    bookSession,
    showToast
  } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanningCv, setIsScanningCv] = useState<boolean>(false);
  const [scannedSuccess, setScannedSuccess] = useState<boolean>(false);

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
        id: 'mock-interview',
        title: '1:1 Mock Interview & Case Prep',
        duration: '60 Mins',
        price: base,
        desc: 'Real technical / case interview simulation with instant feedback & recruiter rating',
        deliverables: [
          { icon: Video, title: '1:1 Live Interview Simulation', desc: 'Target company coding, architecture or PRD case questions' },
          { icon: Clock, title: '60 Minutes Deep Evaluation', desc: 'Immediate feedback on problem-solving, depth & communication' },
          { icon: ShieldCheck, title: 'Official Shine Scorecard', desc: 'Personalized rubric assessment & verified skill badge for recruiters' }
        ]
      },
      {
        id: 'resume-audit',
        title: 'Resume & Portfolio Deep-Dive',
        duration: '30 Mins',
        price: Math.max(499, Math.round((base * 0.65) / 50) * 50 - 1),
        badge: '⚡ Quick Audit',
        desc: 'Line-by-line ATS resume audit, project showcase tuning & keyword boost',
        deliverables: [
          { icon: FileText, title: 'Line-by-Line CV Teardown', desc: 'ATS formatting audit, high-impact bullet points & metrics phrasing' },
          { icon: Clock, title: '30 Minutes Focused Review', desc: 'GitHub, portfolio & live project showcase optimization' },
          { icon: Sparkles, title: 'Recruiter Spotlight Boost', desc: '+22% profile visibility score on Shine recruiter search' }
        ]
      },
      {
        id: 'career-strategy',
        title: '1:1 Career Jump & CTC Strategy',
        duration: '45 Mins',
        price: Math.max(699, Math.round((base * 0.85) / 50) * 50 - 1),
        badge: '🚀 High ROI',
        desc: 'Step-by-step roadmap to switch domains & negotiate higher CTC offers',
        deliverables: [
          { icon: TrendingUp, title: 'Domain Transition Roadmap', desc: 'Personalized 30-60-90 day skill bridge & interview readiness plan' },
          { icon: Clock, title: '45 Minutes Strategy Session', desc: 'Offer evaluation, compensation benchmarking & counter-offer tactics' },
          { icon: ShieldCheck, title: 'Company Insider Insights', desc: 'Culture, team expectations & real compensation bands' }
        ]
      },
      {
        id: 'referral-prep',
        title: 'Target Referral & Fast-Track',
        duration: '45 Mins',
        price: Math.max(899, Math.round((base * 1.15) / 50) * 50 - 1),
        badge: '⭐ Direct Intro',
        desc: 'Internal referral prep, hiring round secrets & direct profile endorsement',
        deliverables: [
          { icon: ShieldCheck, title: 'Internal Referral Evaluation', desc: 'Review fitment for active openings at top product firms' },
          { icon: Clock, title: '45 Minutes Hiring Deep-Dive', desc: 'Hiring manager expectation breakdown & interview loop secrets' },
          { icon: Sparkles, title: 'Fast-Track Recommendation', desc: 'Direct mentor endorsement & recruiter introduction guidance' }
        ]
      }
    ];
  }, [expertPrice]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('mock-interview');
  const activeSession = sessionOfferings.find(s => s.id === selectedSessionId) || sessionOfferings[0];
  const payableAmount = activeSession.price;

  const isCvExplicitlyRemoved = bookingDraft?.attachedCvName === '';
  const currentCvName = isCvExplicitlyRemoved 
    ? '' 
    : (bookingDraft?.attachedCvName || userProfile?.resumeFileName || 'Prakash_Mahto_Frontend_Resume.pdf');
  
  const isCvRecentlyUpdated = !isCvExplicitlyRemoved && Boolean(
    (userProfile?.resumeLastUpdated && (userProfile.resumeLastUpdated.includes('Just now') || userProfile.resumeLastUpdated.includes('Synced'))) ||
    scannedSuccess
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsScanningCv(true);
      setTimeout(() => {
        setIsScanningCv(false);
        setScannedSuccess(true);
        if (updateCandidateResume) {
          updateCandidateResume(file.name, ['Next.js 15', 'React 19', 'Micro-Frontends', 'UI Architecture'], '₹24L - ₹30 LPA');
        }
        if (setBookingDraft) {
          setBookingDraft({ 
            ...bookingDraft, 
            expert, 
            attachedCvName: file.name,
            sessionType: activeSession.title,
            amount: payableAmount,
            duration: activeSession.duration
          });
        }
      }, 1200);
    }
  };

  const handleQuickDemoUpload = () => {
    setIsScanningCv(true);
    setTimeout(() => {
      setIsScanningCv(false);
      setScannedSuccess(true);
      const demoName = 'Prakash_Mahto_LeadFrontend_Updated.pdf';
      if (updateCandidateResume) {
        updateCandidateResume(demoName, ['Next.js 15', 'React 19', 'Micro-Frontends', 'UI Architecture'], '₹24L - ₹30 LPA');
      }
      if (setBookingDraft) {
        setBookingDraft({ 
          ...bookingDraft, 
          expert, 
          attachedCvName: demoName,
          sessionType: activeSession.title,
          amount: payableAmount,
          duration: activeSession.duration
        });
      }
    }, 1100);
  };

  const handleRemoveResume = () => {
    setScannedSuccess(false);
    if (removeCandidateResume) {
      removeCandidateResume();
    }
    if (setBookingDraft) {
      setBookingDraft({ 
        ...bookingDraft, 
        expert, 
        attachedCvName: '',
        sessionType: activeSession.title,
        amount: payableAmount,
        duration: activeSession.duration
      });
    }
  };

  const handleProceed = () => {
    const slotTime = selectedTime || availableSlots[0]?.time || '10:00 AM - 11:00 AM';
    if (setBookingDraft) {
      setBookingDraft({
        expert,
        date: activeDateStr,
        timeSlot: slotTime,
        attachedCvName: currentCvName,
        sessionType: activeSession.title,
        amount: payableAmount,
        duration: activeSession.duration
      });
    }
    onProceedToPay();
  };

  if (!isOpen) return null;

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card booking-modal-size">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>
        
        <div className="booking-modal-grid">
          
          {/* Left Summary Box */}
          <div className="booking-left-summary">
            <div className="bk-sec-header">
              <h3 className="modal-sec-title">Session Details</h3>
              <span className="bk-badge-1on1">{activeSession.duration} • 1:1 Live</span>
            </div>
            
            <div className="bk-expert-summary-box">
              <div className="bk-avatar-wrap">
                <img src={expertAvatar} alt={expertName} className="bk-avatar" />
                <span className="bk-avatar-check"><CheckCircle2 size={12} /></span>
              </div>
              <div className="bk-expert-info">
                <h4>{expertName}</h4>
                <p>{expertRole}</p>
                <span className="bk-company-tag">{expertCompany}</span>
                <div className="bk-rating-row">
                  <Star size={12} className="star-gold" />
                  <strong>{expertRating}</strong>
                  <span>({expertReviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Dynamic deliverables for selected session */}
            <div className="bk-spec-box">
              {activeSession.deliverables.map((deliv, idx) => {
                const IconComponent = deliv.icon;
                return (
                  <div key={idx} className="bk-spec-item">
                    <div className="bk-spec-icon-wrap"><IconComponent size={16} /></div>
                    <div className="bk-spec-text">
                      <strong>{deliv.title}</strong>
                      <span>{deliv.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cancellation-policy-note">
              <Info size={16} className="text-blue-600 flex-shrink-0" />
              <span><strong>Free Reschedule:</strong> Up to 6 hours before slot. 100% money back guarantee if session missed.</span>
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
                        <div className="bk-sc-top">
                          <div className="bk-sc-radio-row">
                            <span className={`bk-sc-radio ${isSelected ? 'selected' : ''}`}>
                              {isSelected && <span className="bk-sc-radio-dot" />}
                            </span>
                            <strong className="bk-sc-title">{session.title}</strong>
                          </div>
                          <div className="bk-sc-price-col">
                            <span className="bk-sc-dur">{session.duration}</span>
                            <strong className="bk-sc-price">₹{session.price}</strong>
                          </div>
                        </div>
                        <p className="bk-sc-desc">{session.desc}</p>
                        {session.badge && (
                          <span className={`bk-sc-badge ${session.id === 'mock-interview' ? 'badge-hot' : ''}`}>{session.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: 7-Day Date Grid (No Scroll Needed) */}
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

              {/* Step 3: Time Slots */}
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

              {/* Step 4: CV Attachment */}
              <div className="bk-cv-attachment-section">
                <div className="bk-cv-sec-header">
                  <label className="bk-field-label">
                    <FileText size={14} /> 4. Upload Latest CV
                  </label>
                  <span className="bk-cv-impact-tag">⚡ Latest CV = 2x Better Guidance</span>
                </div>

                {/* Clean Single Card */}
                <div className={`bk-clean-cv-card ${isCvRecentlyUpdated ? 'cv-card-synced' : currentCvName ? 'cv-card-notice' : 'cv-card-empty'}`}>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  {/* Left File Info / Status */}
                  <div className="bk-clean-cv-left">
                    <div className="bk-clean-file-header">
                      <div className="bk-clean-file-icon">
                        {isScanningCv ? (
                          <RefreshCw size={18} className="text-purple-600 animate-spin" />
                        ) : isCvRecentlyUpdated ? (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : currentCvName ? (
                          <FileText size={18} className="text-rose-500" />
                        ) : (
                          <UploadCloud size={18} className="text-slate-400" />
                        )}
                      </div>
                      
                      {currentCvName ? (
                        <div className="bk-clean-file-meta">
                          <strong className="bk-clean-filename">{currentCvName}</strong>
                          <button 
                            type="button" 
                            className="btn-clean-remove-cv"
                            onClick={handleRemoveResume}
                            disabled={isScanningCv}
                            title="Remove attached file"
                            aria-label="Remove attached file"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className="bk-clean-nofile-lbl">No Resume Attached</span>
                      )}
                    </div>

                    {/* Single Line Clean Context / Reason */}
                    <p className="bk-clean-cv-hint">
                      {isScanningCv ? (
                        <span className="text-purple-600 font-medium">⚡ AI scanning skills & creating dossier for {expertName}...</span>
                      ) : isCvRecentlyUpdated ? (
                        <span className="text-emerald-600 font-medium">✅ Synced! {expertName} will review your latest skills & projects before the call.</span>
                      ) : currentCvName ? (
                        <span className="text-amber-800">⚠️ Needs update: Mentors give <strong>2x better mock & salary advice</strong> with your latest CV.</span>
                      ) : (
                        <span className="text-slate-500">Attach your latest CV so {expertName} can prepare tailored guidance for your call.</span>
                      )}
                    </p>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="bk-clean-cv-right">
                    <button 
                      type="button" 
                      className="btn-clean-upload"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isScanningCv}
                    >
                      <UploadCloud size={13} />
                      <span>{currentCvName ? 'Replace' : 'Upload CV'}</span>
                    </button>

                    {!isCvRecentlyUpdated && (
                      <button 
                        type="button" 
                        className="btn-clean-fast-demo"
                        onClick={handleQuickDemoUpload}
                        title="1-Click AI Demo Resume Upload"
                      >
                        <Sparkles size={11} /> Fast Demo
                      </button>
                    )}
                  </div>
                </div>

                <div className="bk-cv-reassurance-row">
                  <Clock size={12} className="text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Don't have your updated CV right now?</strong> No worries — you can book now and upload anytime before the call via your dashboard or WhatsApp reminder.
                  </span>
                </div>
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
