import React, { useMemo, useState, useRef } from 'react';
import { 
  X, Video, Clock, ShieldCheck, Info, ArrowRight, Lock, 
  CheckCircle2, Calendar, Star, FileText, UploadCloud, Sparkles, RefreshCw, Trash2 
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
  const { userProfile, updateCandidateResume, removeCandidateResume, bookingDraft, setBookingDraft, selectedExpert } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanningCv, setIsScanningCv] = useState<boolean>(false);
  const [scannedSuccess, setScannedSuccess] = useState<boolean>(false);

  // Dynamically calculate next 15 days starting strictly from Today
  const next15Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 15; i++) {
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

  const isSelectedInList = Boolean(selectedDate && next15Days.some(d => d.fullDateStr === selectedDate));
  const activeDateStr = isSelectedInList 
    ? (selectedDate as string)
    : (next15Days[1]?.fullDateStr || next15Days[0]?.fullDateStr || 'Tomorrow, 5 Sep');

  const isSelectedDayToday = Boolean(next15Days.find(d => d.fullDateStr === activeDateStr)?.isToday);

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

  if (!isOpen) return null;

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
          setBookingDraft({ ...bookingDraft, expert, attachedCvName: file.name });
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
        setBookingDraft({ ...bookingDraft, expert, attachedCvName: demoName });
      }
    }, 1100);
  };

  const handleRemoveResume = () => {
    setScannedSuccess(false);
    if (removeCandidateResume) {
      removeCandidateResume();
    }
    if (setBookingDraft) {
      setBookingDraft({ ...bookingDraft, expert, attachedCvName: '' });
    }
  };

  const handleProceed = () => {
    if (setBookingDraft) {
      setBookingDraft({
        expert,
        date: activeDateStr,
        timeSlot: selectedTime || availableSlots[0]?.time || '10:00 AM - 11:00 AM',
        attachedCvName: currentCvName
      });
    }
    onProceedToPay();
  };

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
              <span className="bk-badge-1on1">1:1 Live Video</span>
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

            <div className="bk-spec-box">
              <div className="bk-spec-item">
                <div className="bk-spec-icon-wrap"><Video size={16} /></div>
                <div className="bk-spec-text">
                  <strong>1:1 Live Strategy & Resume Review</strong>
                  <span>Direct screen-sharing, portfolio walkthrough & profile optimization</span>
                </div>
              </div>
              
              <div className="bk-spec-item">
                <div className="bk-spec-icon-wrap"><Clock size={16} /></div>
                <div className="bk-spec-text">
                  <strong>60 Minutes Dedicated Coaching</strong>
                  <span>Target role interview practice, case rounds & salary negotiation</span>
                </div>
              </div>
              
              <div className="bk-spec-item">
                <div className="bk-spec-icon-wrap"><ShieldCheck size={16} /></div>
                <div className="bk-spec-text">
                  <strong>Guaranteed Career Action Plan</strong>
                  <span>Personalized roadmap notes & Shine Verified Skill Badge for recruiters</span>
                </div>
              </div>
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

            {/* Step 1: 15-Day Date Slider / Grid */}
            <div className="bk-date-selector-wrapper">
              <label className="bk-field-label">
                <Calendar size={14} /> 1. Select Date
              </label>
              
              <div className="bk-dates-scroll-grid">
                {next15Days.map((d) => {
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

            {/* Step 2: Time Slots */}
            <div className="time-slots-container">
              <label className="bk-field-label">
                <Clock size={14} /> 2. Choose Time Slot for <strong>{activeDateStr}</strong>
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

            {/* Step 3: CV Attachment (Clean & Modern SaaS UX) */}
            <div className="bk-cv-attachment-section">
              <div className="bk-cv-sec-header">
                <label className="bk-field-label">
                  <FileText size={14} /> 3. Upload Latest CV
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

            {/* Modal Footer */}
            <div className="booking-modal-footer">
              <div className="footer-price-col">
                <span className="f-p-label">Total Payable Amount</span>
                <div className="f-p-price-row">
                  <span className="f-p-amount">₹{expertPrice}</span>
                  <span className="f-p-tax">Inclusive of all taxes</span>
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
