import React from 'react';
import { X, Video, Clock, ShieldCheck, Info, ChevronLeft, ChevronRight, ArrowRight, Lock } from 'lucide-react';
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

  return (
    <div className="app-modal-backdrop open">
      <div className="app-modal-card booking-modal-size">
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        
        <div className="booking-modal-grid">
          
          <div className="booking-left-summary">
            <h3 className="modal-sec-title">Session Details</h3>
            
            <div className="bk-expert-summary-box">
              <img src={expert.avatar} alt={expert.name} className="bk-avatar" />
              <div>
                <h4>{expert.name}</h4>
                <p>{expert.role} at {expert.company}</p>
              </div>
            </div>

            <div className="bk-spec-box">
              <div className="bk-spec-item">
                <Video size={18} />
                <div>
                  <strong>1:1 Mentorship Session</strong>
                  <span>Live 1:1 Video call with CV Gap Analysis</span>
                </div>
              </div>
              <div className="bk-spec-item">
                <Clock size={18} />
                <div>
                  <strong>Duration</strong>
                  <span>60 Minutes</span>
                </div>
              </div>
              <div className="bk-spec-item">
                <ShieldCheck size={18} />
                <div>
                  <strong>Outcome Guarantee</strong>
                  <span>Post-session summary & Shine verified badge</span>
                </div>
              </div>
            </div>

            <div className="cancellation-policy-note">
              <Info size={16} />
              <span>Free reschedule up to 6 hours before session time. 100% money back guarantee.</span>
            </div>
          </div>

          <div className="booking-right-picker">
            <h3 className="modal-sec-title">Select Date & Time</h3>

            <div className="calendar-widget-box">
              <div className="cal-month-header">
                <button className="cal-nav-btn"><ChevronLeft size={16} /></button>
                <span className="cal-month-name">September 2026</span>
                <button className="cal-nav-btn"><ChevronRight size={16} /></button>
              </div>

              <div className="cal-days-row">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>

              <div className="cal-dates-grid">
                <span className="cal-date muted">28</span>
                <span className="cal-date muted">29</span>
                <span className="cal-date muted">30</span>
                <span className="cal-date muted">31</span>
                <span className="cal-date">1</span>
                {['Fri, 2 Sep', 'Sat, 3 Sep', 'Sun, 4 Sep', 'Mon, 5 Sep', 'Tue, 6 Sep', 'Wed, 7 Sep', 'Thu, 8 Sep', 'Fri, 9 Sep', 'Sat, 10 Sep'].map((dStr, idx) => (
                  <span
                    key={dStr}
                    className={`cal-date ${selectedDate === dStr ? 'active-date' : 'available-date'}`}
                    onClick={() => onSelectDate(dStr)}
                  >
                    {idx + 2}
                  </span>
                ))}
              </div>
            </div>

            <div className="time-slots-container">
              <label className="time-slot-label">Available Slots for <strong>{selectedDate}</strong></label>
              <div className="slots-pill-grid">
                {['10:00 AM - 11:00 AM', '12:00 PM - 01:00 PM', '02:00 PM - 03:00 PM', '04:30 PM - 05:30 PM', '07:00 PM - 08:00 PM'].map((slot) => (
                  <button
                    key={slot}
                    className={`slot-pill ${selectedTime === slot ? 'active-slot' : ''}`}
                    onClick={() => onSelectTime(slot)}
                  >
                    {slot.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-modal-footer">
              <div className="footer-price-col">
                <span className="f-p-label">Total Payable</span>
                <span className="f-p-amount">₹{expert.price}</span>
              </div>
              <button className="btn-shine-gold-lg" onClick={onProceedToPay}>
                Continue to Pay <ArrowRight size={16} />
              </button>
            </div>
            <div className="secure-badge-note"><Lock size={12} /> 100% Secure Payments via Shine Razorpay Gateway</div>

          </div>

        </div>
      </div>
    </div>
  );
};
