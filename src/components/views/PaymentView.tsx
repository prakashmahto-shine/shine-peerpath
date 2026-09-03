import React, { useState } from 'react';
import { ArrowLeft, Calendar, ShieldCheck, Check, Building, Wallet, Lock, Loader2, Shield } from 'lucide-react';
import { Expert, ViewType } from '../../types';

interface PaymentViewProps {
  expert: Expert;
  bookingDate: string;
  bookingTime: string;
  onNavigate: (view: ViewType) => void;
  onPaymentSuccess: () => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  expert,
  bookingDate,
  bookingTime,
  onNavigate,
  onPaymentSuccess,
}) => {
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 900);
  };

  return (
    <div className="content-wrapper payment-layout-grid">
      <div className="payment-left-card">
        <button className="btn-back-link" onClick={() => onNavigate('experts-view')}>
          <ArrowLeft size={16} /> Back
        </button>
        
        <h2 className="pay-sec-heading">Session Summary</h2>

        <div className="pay-expert-card">
          <img src={expert.avatar} alt={expert.name} className="pay-avatar" />
          <div>
            <h4>{expert.name}</h4>
            <p>{expert.role} at {expert.company}</p>
            <div className="pay-chip"><Calendar size={13} /> {bookingDate} • {bookingTime}</div>
          </div>
        </div>

        <div className="bill-breakup-card">
          <div className="bill-row">
            <span>Session Fee (60 Mins)</span>
            <span>₹{expert.price}</span>
          </div>
          <div className="bill-row">
            <span>Platform Fee & Trust Insurance</span>
            <span className="text-success"><del>₹199</del> FREE</span>
          </div>
          <div className="bill-row">
            <span>GST (18%)</span>
            <span>Included</span>
          </div>
          <div className="bill-divider"></div>
          <div className="bill-row total-row">
            <strong>Total Amount Payable</strong>
            <strong className="total-amt">₹{expert.price}</strong>
          </div>
        </div>

        <div className="trust-guarantee-box">
          <ShieldCheck size={24} className="t-icon" />
          <p><strong>Shine Trust Guarantee:</strong> Full refund if the expert does not show up or if you are not 100% satisfied with the session quality.</p>
        </div>
      </div>

      <div className="payment-right-card">
        <h2 className="pay-sec-heading">Select Payment Method</h2>

        <div className="payment-methods-stack">
          <label className={`pay-method-row ${payMethod === 'upi' ? 'active' : ''}`} onClick={() => setPayMethod('upi')}>
            <div className="pay-radio-left">
              <input type="radio" name="payMethod" checked={payMethod === 'upi'} onChange={() => setPayMethod('upi')} />
              <div className="method-details">
                <strong>UPI (Instant & Zero Fee)</strong>
                <span>Google Pay, PhonePe, Paytm, BHIM UPI</span>
              </div>
            </div>
            <div className="upi-logos">
              <span className="upi-tag">GPay</span>
              <span className="upi-tag">PhonePe</span>
              <span className="upi-tag">Paytm</span>
            </div>
          </label>

          {payMethod === 'upi' && (
            <div className="upi-input-box">
              <input type="text" defaultValue="prakash.kumar@okaxis" placeholder="Enter UPI ID" />
              <span className="verified-upi-badge"><Check size={12} /> Verified</span>
            </div>
          )}

          <label className={`pay-method-row ${payMethod === 'card' ? 'active' : ''}`} onClick={() => setPayMethod('card')}>
            <div className="pay-radio-left">
              <input type="radio" name="payMethod" checked={payMethod === 'card'} onChange={() => setPayMethod('card')} />
              <div className="method-details">
                <strong>Credit / Debit Card</strong>
                <span>Visa, Mastercard, RuPay, Amex</span>
              </div>
            </div>
            <div className="upi-logos">
              <span className="upi-tag">VISA</span>
              <span className="upi-tag">Mastercard</span>
            </div>
          </label>

          <label className={`pay-method-row ${payMethod === 'netbanking' ? 'active' : ''}`} onClick={() => setPayMethod('netbanking')}>
            <div className="pay-radio-left">
              <input type="radio" name="payMethod" checked={payMethod === 'netbanking'} onChange={() => setPayMethod('netbanking')} />
              <div className="method-details">
                <strong>Net Banking</strong>
                <span>HDFC, ICICI, SBI, Axis & all major banks</span>
              </div>
            </div>
            <Building size={18} />
          </label>

          <label className={`pay-method-row ${payMethod === 'wallet' ? 'active' : ''}`} onClick={() => setPayMethod('wallet')}>
            <div className="pay-radio-left">
              <input type="radio" name="payMethod" checked={payMethod === 'wallet'} onChange={() => setPayMethod('wallet')} />
              <div className="method-details">
                <strong>Wallets</strong>
                <span>Amazon Pay, Mobikwik, Airtel Money</span>
              </div>
            </div>
            <Wallet size={18} />
          </label>

        </div>

        <div className="pay-action-block">
          <button className="btn-shine-gold-lg w-100" onClick={handlePay} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 size={18} className="spin-anim" /> Processing Payment...
              </>
            ) : (
              <>
                <Lock size={16} /> Pay ₹{expert.price} & Confirm Session
              </>
            )}
          </button>
          <p className="pay-footer-note"><Shield size={14} /> 256-Bit SSL Encrypted Payment</p>
        </div>

      </div>
    </div>
  );
};
