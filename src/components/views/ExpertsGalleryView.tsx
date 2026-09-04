import React, { useState } from 'react';
import { Search, Play, ShieldCheck, Star, ChevronLeft, ChevronRight, SearchX, Compass, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Expert, ViewType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExpertsGalleryViewProps {
  experts: Expert[];
  onSelectExpert: (expertId: string) => void;
  onOpenBooking: (expertId: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const ExpertsGalleryView: React.FC<ExpertsGalleryViewProps> = ({
  experts,
  onSelectExpert,
  onOpenBooking,
  onNavigate,
}) => {
  const { setIsCreatorWizardOpen, currentUser } = useApp();
  const isMentor = currentUser?.role === 'mentor';
  const [activeDomain, setActiveDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expFilter, setExpFilter] = useState<string>('all');
  const [priceLimit, setPriceLimit] = useState<number>(2500);
  const [sortOrder, setSortOrder] = useState<string>('trajectory');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredExperts = experts.filter((exp) => {
    if (activeDomain !== 'all' && exp.domain !== activeDomain) return false;
    if (exp.price > priceLimit) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = exp.name.toLowerCase().includes(q);
      const matchRole = exp.role.toLowerCase().includes(q);
      const matchComp = exp.company.toLowerCase().includes(q);
      const matchSkills = exp.skills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchComp && !matchSkills) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'rating') return b.rating - a.rating;
    if (sortOrder === 'sessions') return b.sessionsCount - a.sessionsCount;
    return 0;
  });

  const handleCardClick = (id: string) => {
    onSelectExpert(id);
    onNavigate('expert-profile-view');
  };

  const handleClearFilters = () => {
    setActiveDomain('all');
    setSearchTerm('');
    setExpFilter('all');
    setPriceLimit(2500);
    setSortOrder('trajectory');
  };

  return (
    <div className="content-wrapper">
      {/* Peerpath Top Sub-Nav View Switcher + Become Mentor CTA */}
      <div className="peerpath-top-nav-switcher">
        <div className="ptn-left-group">
          <button 
            type="button"
            className="ptn-tab-btn"
            onClick={() => onNavigate('guidance-view')}
          >
            <TrendingUp size={15} className="ptn-icon" />
            <span>Recommended Pathways</span>
            <span className="ptn-badge-pill">Best Fit</span>
          </button>
          
          <button 
            type="button"
            className="ptn-tab-btn active ptn-mentors-highlight"
            onClick={() => {}}
          >
            <div className="ptn-avatars-stack">
              <img src="/avatars/saheli.jpg" alt="Mentor" className="ptn-av" />
              <img src="/avatars/akash.jpg" alt="Mentor" className="ptn-av" />
              <img src="/avatars/ishita.jpg" alt="Mentor" className="ptn-av" />
              <span className="ptn-live-dot"></span>
            </div>
            <span className="ptn-label-main">Explore 500+ Mentors</span>
            <span className="ptn-count-pill">Live 1:1 Prep</span>
          </button>
        </div>

        {!isMentor && (currentUser?.isMentorEligible ?? false) && (
          <button 
            type="button"
            className="ptn-become-mentor-btn"
            onClick={() => setIsCreatorWizardOpen(true)}
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Become a Mentor</span>
            <span className="ptn-zero-fee-tag">0% Fee</span>
          </button>
        )}
      </div>

      {/* Mentor Acquisition Banner for Candidates in Gallery (Nisha only) */}
      {!isMentor && (currentUser?.isMentorEligible ?? false) && (
        <div className="peerpath-mentor-recruitment-strip" onClick={() => setIsCreatorWizardOpen(true)}>
          <div className="pmrs-left">
            <span className="pmrs-badge">⭐ FOUNDING MENTOR CIRCLE</span>
            <span className="pmrs-text">
              Monetize your expertise & mentor candidates with <strong>0% platform fee</strong>. Join 500+ Top Mentors from Swiggy, Google & Razorpay.
            </span>
          </div>
          <button type="button" className="pmrs-cta-btn">
            Join as Mentor (0% Fee) <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation Bar */}
      <div className="view-breadcrumb-bar">
        <button 
          type="button"
          className="btn-back-breadcrumb" 
          onClick={() => onNavigate('guidance-view')}
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard-view')}>Home</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('guidance-view')}>Peerpath Guidance</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Verified Mentors</span>
      </div>

      <div className="gallery-header-block">
        <div className="g-header-text">
          <h1 className="gallery-main-title">Learn from experts</h1>
          <p className="gallery-subtitle">Watch teaser videos and connect with verified professionals who've already made the career switch you're planning.</p>
        </div>
        <div className="g-search-filter-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by skill, role or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="quick-filter-bar">
        <div className="filter-pill-group">
          {['all', 'Product Management', 'Search & Data Infra', 'SaaS Sales', 'AI/ML', 'Full-Stack'].map((dom) => (
            <button
              key={dom}
              className={`f-pill ${activeDomain === dom ? 'active' : ''}`}
              onClick={() => setActiveDomain(dom)}
            >
              {dom === 'all' ? 'All Domains' : dom}
            </button>
          ))}
        </div>
        <div className="filter-dropdowns">
          <select className="select-pill" value={expFilter} onChange={(e) => setExpFilter(e.target.value)}>
            <option value="all">Experience: All</option>
            <option value="3-5">3 - 5 Years</option>
            <option value="6-8">6 - 8 Years</option>
            <option value="9+">9+ Years</option>
          </select>
          <select className="select-pill" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="trajectory">Sort: Trajectory Fit</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="sessions">Sort: Most Sessions</option>
          </select>
        </div>
      </div>

      <div className="gallery-layout-grid">
        <aside className="gallery-sidebar">
          <div className="sidebar-header">
            <h3>Filters</h3>
            <span className="clear-filters-link" onClick={handleClearFilters} style={{ cursor: 'pointer' }}>Clear All</span>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Career / Domain</label>
            <div className="checkbox-list">
              {['Product Management', 'Search & Data Infra', 'SaaS Sales', 'AI/ML', 'Full-Stack'].map((dom) => (
                <label key={dom} className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={activeDomain === 'all' || activeDomain === dom} 
                    onChange={() => setActiveDomain(activeDomain === dom ? 'all' : dom)}
                  />
                  <span>{dom}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Trust & Verification</label>
            <div className="checkbox-list">
              <label className="custom-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Work Email Verified 🛡️</span>
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Provides Internal Referrals</span>
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Issues Recruiter Badges</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-title-flex">
              <label className="filter-section-title">Price Limit</label>
              <span className="price-val-display">₹{priceLimit}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="2500" 
              step="100" 
              value={priceLimit}
              className="price-slider"
              onChange={(e) => setPriceLimit(Number(e.target.value))}
            />
          </div>
        </aside>

        <div className="expert-cards-container">
          {filteredExperts.length === 0 ? (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px' }}>
              <SearchX size={48} style={{ color: '#94a3b8', margin: '0 auto 10px' }} />
              <h3>No experts found</h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Try resetting filters or adjusting search terms.</p>
            </div>
          ) : (
            filteredExperts.map((exp) => (
              <div key={exp.id} className="expert-teaser-card" id={`card-${exp.id}`}>
                <div className="card-video-thumb-wrap" onClick={() => handleCardClick(exp.id)}>
                  <img src={exp.videoPoster} alt={exp.name} className="card-video-thumb-img" />
                  <div className="video-thumb-play-overlay">
                    <div className="thumb-play-btn"><Play size={20} fill="#0f172a" /></div>
                  </div>
                  <span className="thumb-duration-badge">{exp.duration}</span>
                </div>

                <div className="card-content-body">
                  <div className="card-expert-info">
                    <img src={exp.avatar} alt={exp.name} className="card-avatar-img" />
                    <div className="card-meta-text">
                      <div className="card-name-row">
                        <h3 className="card-expert-name">
                          {exp.name} <ShieldCheck size={15} className="verified-badge-shield" />
                        </h3>
                      </div>
                      <p className="card-expert-role">{exp.role} at <strong>{exp.company}</strong></p>
                    </div>
                  </div>

                  <div className="card-stats-row">
                    <span className="card-exp">{exp.experience}</span>
                    <span className="card-rating"><Star size={13} className="star-gold" /> {exp.rating} ({exp.reviewsCount})</span>
                  </div>

                  <div className="card-skills-row">
                    {exp.skills.slice(0, 2).map((s) => (
                      <span key={s} className="card-skill-tag">{s}</span>
                    ))}
                  </div>

                  <div className="card-footer-pricing-row">
                    <div>
                      <span className="card-price-text">₹{exp.price}</span>
                      <span className="card-price-unit"> / 60 min</span>
                    </div>
                    <div className="card-btn-group">
                      <button className="btn-card-action-sm btn-teaser-play" onClick={() => handleCardClick(exp.id)}>Watch Teaser</button>
                      <button className="btn-card-action-sm btn-book-sm" onClick={() => onOpenBooking(exp.id)}>Book Session</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Centered Modern Shine Pagination */}
      <div className="gallery-pagination">
        <button 
          type="button" 
          className="pg-btn" 
          disabled={currentPage === 1}
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }
          }}
        >
          <ChevronLeft size={16} />
        </button>
        
        <button 
          type="button" 
          className={`pg-btn ${currentPage === 1 ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage(1);
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
        >
          1
        </button>
        
        <button 
          type="button" 
          className={`pg-btn ${currentPage === 2 ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage(2);
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
        >
          2
        </button>
        
        <button 
          type="button" 
          className={`pg-btn ${currentPage === 3 ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage(3);
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
        >
          3
        </button>
        
        <span className="pg-dots">...</span>
        
        <button 
          type="button" 
          className={`pg-btn ${currentPage === 8 ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage(8);
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
        >
          8
        </button>
        
        <button 
          type="button" 
          className="pg-btn"
          disabled={currentPage === 8}
          onClick={() => {
            if (currentPage < 8) {
              setCurrentPage(currentPage + 1);
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
};
