import React, { useMemo } from 'react';
import { X, Video, Clock, ShieldCheck, Info, ArrowRight, Lock, CheckCircle2, Calendar, Star } from 'lucide-react';
import { Expert } from '../../types';

interface BookingModalProps {
  expert: Expert;
  isOpen: boolean;
  selectedDate: string;
  selectedTime: string;
  onClose: () => void;
  onSelectDate: (dateStr: string) => void;
  onSelectTime: (timeStr: string) => void;
  onProceedToPay: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  expert,
  isOpen,
  selectedDate,
  selectedTime,
  onClose,
  onSelectDate,
  onSelectTime,
  onProceedToPay,
}) => {
  if (!isOpen) return null;

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

  // Helper to parse slot start time into 24-hour decimal format
  const parseSlotStartHour = (slotTimeStr: string): number => {
    try {
      const startPart = slotTimeStr.split(' - ')[0].trim();
      const [time, meridian] = startPart.split(' ');
      const [hourStr, minStr] = time.split(':');
      let hour = parseInt(hourStr, 10);
      const min = parseInt(minStr || '0', 10);
      if (meridian === 'PM' && hour !== 12) hour += 12;
      if (meridian === 'AM' && hour === 12) hour = 0;
      return hour + min / 60;
    } catch {
      return 0;
    }
  };

  const allSlots = [
    { time: '10:00 AM - 11:00 AM', label: '10:00 AM', period: 'Morning' },
    { time: '11:30 AM - 12:30 PM', label: '11:30 AM', period: 'Morning' },
    { time: '02:00 PM - 03:00 PM', label: '02:00 PM', period: 'Afternoon' },
    { time: '04:30 PM - 05:30 PM', label: '04:30 PM', period: 'Afternoon' },
    { time: '06:30 PM - 07:30 PM', label: '06:30 PM', period: 'Evening' },
    { time: '08:00 PM - 09:00 PM', label: '08:00 PM', period: 'Evening' },
    { time: '09:00 PM - 10:00 PM', label: '09:00 PM', period: 'Late Evening' }
  ];

  // Resolve active date string: if selectedDate is empty or expired, pick tomorrow or today
  const isSelectedInList = next15Days.some(d => d.fullDateStr === selectedDate);
  const activeDateStr = isSelectedInList 
    ? selectedDate 
    : (next15Days[1]?.fullDateStr || next15Days[0]?.fullDateStr);

  const isSelectedDayToday = next15Days.find(d => d.fullDateStr === activeDateStr)?.isToday || false;

  // Real-time slot filtering: if Today is selected, only show future slots
  const availableSlots = useMemo(() => {
    if (!isSelectedDayToday) {
      return allSlots;
    }
    const now = new Date();
    const currentDecimalHour = now.getHours() + now.getMinutes() / 60;
    return allSlots.filter(s => parseSlotStartHour(s.time) > currentDecimalHour + 0.25);
  }, [isSelectedDayToday]);

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
                <img src={expert.avatar} alt={expert.name} className="bk-avatar" />
                <span className="bk-avatar-check"><CheckCircle2 size={12} /></span>
              </div>
              <div className="bk-expert-info">
                <h4>{expert.name}</h4>
                <p>{expert.role}</p>
                <span className="bk-company-tag">{expert.company}</span>
                <div className="bk-rating-row">
                  <Star size={12} className="star-gold" />
                  <strong>{expert.rating}</strong>
                  <span>({expert.reviewsCount} reviews)</span>
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
              <h3 className="modal-sec-title">Select Date & Time</h3>
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
                    const isSelected = selectedTime === slot.time;
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

            {/* Modal Footer */}
            <div className="booking-modal-footer">
              <div className="footer-price-col">
                <span className="f-p-label">Total Payable Amount</span>
                <div className="f-p-price-row">
                  <span className="f-p-amount">₹{expert.price}</span>
                  <span className="f-p-tax">Inclusive of all taxes</span>
                </div>
              </div>
              
              <button 
                type="button"
                className="btn-shine-gold-lg bk-pay-btn" 
                onClick={onProceedToPay}
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
