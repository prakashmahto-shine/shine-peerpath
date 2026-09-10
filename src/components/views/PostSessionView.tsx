import React, { useState } from 'react';
import { 
  Star, CheckCircle2, ShieldCheck, UserCheck, Eye, Compass, 
  ChevronRight, Award, Share2, Download, Copy, ExternalLink, QrCode, Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PostSessionView: React.FC = () => {
  const { activeSession, selectedExpert, navigate, completeSession, userProfile, showToast } = useApp();
  const expert = activeSession?.expert || selectedExpert;

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>(
    `${expert.name} completely transformed my approach to career transitions. The framework shared for handling interview objections and system design was invaluable!`
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const badgeTitle = `${expert.domain} Production Ready`;
  const credentialId = `SH-PP-84920-ARCH`;
  const verificationUrl = `https://shine.com/verify/${credentialId}`;

  const handleSubmit = () => {
    if (activeSession) {
      completeSession(activeSession.id, rating, reviewText, badgeTitle);
    }
    navigate('profile-view');
  };

  const handleAddToLinkedIn = () => {
    const today = new Date();
    const issueYear = today.getFullYear();
    const issueMonth = today.getMonth() + 1;
    const certName = encodeURIComponent(`Shine Peer-Verified: ${badgeTitle}`);
    const orgName = encodeURIComponent('Shine.com');
    const certUrl = encodeURIComponent(verificationUrl);
    const certId = encodeURIComponent(credentialId);

    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}&certId=${certId}`;

    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    showToast('🚀 Opening LinkedIn Certification...', 'Credential details pre-filled. Click Save on LinkedIn to showcase to recruiters!', 'success');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(verificationUrl);
    setCopiedLink(true);
    showToast('📋 Credential Link Copied!', 'Attach this link to your Resume, CV, or LinkedIn for instant recruiter verification.', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadPdf = () => {
    showToast('📄 Downloading Certificate...', 'Your official Shine Peer-Verified Certificate PDF is downloading.', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="content-wrapper post-session-layout">
      <div className="post-session-grid">
        
        {/* Left Column: Feedback & Review */}
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
              rows={4}
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

        {/* Right Column: Official Digital Certificate Card */}
        <div className="post-outcome-card">
          
          {/* Verifiable Certificate Showcase Box */}
          <div className="official-cert-card">
            <div className="cert-top-banner">
              <div className="cert-brand-row">
                <div className="cert-shine-badge">
                  <Sparkles size={14} /> SHINE PEERPATH OFFICIAL CREDENTIAL
                </div>
                <span className="cert-status-badge"><CheckCircle2 size={12} /> Live Verified</span>
              </div>
            </div>

            <div className="cert-card-body">
              <div className="cert-gold-seal">
                <Award size={36} />
              </div>

              <span className="cert-pretitle">This is to certify that</span>
              <h2 className="cert-candidate-name">{userProfile?.name || 'Prakash Mahto'}</h2>
              <p className="cert-achievement-text">
                has successfully demonstrated production-grade competency in
              </p>
              <h3 className="cert-badge-name">"{badgeTitle}"</h3>

              <div className="cert-verifier-meta-box">
                <img 
                  src={expert.avatar || '/avatars/akash.jpg'} 
                  alt={expert.name} 
                  className="cert-verifier-avatar" 
                />
                <div className="cert-verifier-text">
                  <div className="cert-verifier-name-row">
                    <strong>{expert.name}</strong>
                    <span className="cert-v-tag">Verified Evaluator</span>
                  </div>
                  <span>{expert.role} • {expert.company}</span>
                </div>
              </div>

              <div className="cert-footer-grid">
                <div className="cert-id-col">
                  <span className="cert-lbl">CREDENTIAL ID</span>
                  <strong className="cert-id-code">{credentialId}</strong>
                  <span className="cert-verify-link">{verificationUrl}</span>
                </div>

                <div className="cert-qr-box">
                  <div className="cert-qr-graphic">
                    <QrCode size={44} />
                  </div>
                  <span className="cert-qr-label">Scan to Verify</span>
                </div>
              </div>
            </div>

            {/* Certificate Action Bar */}
            <div className="cert-action-bar">
              <button 
                type="button" 
                className="btn-cert-linkedin" 
                onClick={handleAddToLinkedIn}
                title="Add directly to your LinkedIn licenses & certifications"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.37 9.74v-8.37H5.09v8.37z"/>
                </svg>
                <span>Add to LinkedIn</span>
              </button>

              <button 
                type="button" 
                className="btn-cert-copy-link" 
                onClick={handleCopyLink}
                title="Copy verifiable credential link for your Resume or CV"
              >
                {copiedLink ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link for Resume / CV'}</span>
              </button>

              <button 
                type="button" 
                className="btn-cert-download" 
                onClick={handleDownloadPdf}
                title="Download Certificate PDF"
              >
                <Download size={14} />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <h3 className="whats-next-title">What's Next?</h3>

          <div className="next-action-cards-stack">
            
            <div className="na-card" onClick={() => navigate('profile-view')}>
              <div className="na-icon"><UserCheck size={18} /></div>
              <div>
                <strong>View on your Shine Profile</strong>
                <span>Auto-sync new keywords and verified badge to your CV</span>
              </div>
              <ChevronRight size={16} className="na-arrow" />
            </div>

            <div className="na-card" onClick={() => navigate('recruiter-view')}>
              <div className="na-icon text-brand-gold"><Eye size={18} /></div>
              <div>
                <strong>See how recruiters now view your profile</strong>
                <span>Preview your badge in Shine Recruiter search portal</span>
              </div>
              <ChevronRight size={16} className="na-arrow" />
            </div>

            <div className="na-card" onClick={() => navigate('experts-view')}>
              <div className="na-icon"><Compass size={18} /></div>
              <div>
                <strong>Explore more experts & mock interviews</strong>
                <span>Connect with senior engineering & tech leads</span>
              </div>
              <ChevronRight size={16} className="na-arrow" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

