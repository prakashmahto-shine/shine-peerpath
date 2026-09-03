import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('skills');
  const [isExploreOpen, setIsExploreOpen] = useState<boolean>(true);
  const [isBlogsOpen, setIsBlogsOpen] = useState<boolean>(false);
  const [isJobsOpen, setIsJobsOpen] = useState<boolean>(false);

  const jobsBySkills = [
    ['Accounting Jobs', 'Data Analysis Jobs', 'Digital Marketing Jobs', 'React Native Jobs'],
    ['Banking Jobs', 'Typing Jobs', 'Java Jobs', 'Enterprise Sales Jobs'],
    ['Civil Engineering Jobs', 'Data Analytics Jobs', 'Data Science Jobs', '.NET Jobs'],
    ['C++ Jobs', 'Content Marketing Jobs', 'Python Jobs', 'View All']
  ];

  return (
    <footer className="shine-official-footer-wrapper">
      <div className="footer-explore-section">
        <div className="content-wrapper" style={{ paddingBottom: '24px' }}>
          
          <div className="explore-header" onClick={() => setIsExploreOpen(!isExploreOpen)}>
            <h3>Explore Jobs by Skills, Location, Companies & More</h3>
            <button className="btn-collapse-toggle">
              {isExploreOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {isExploreOpen && (
            <div className="explore-content">
              <div className="explore-pills-row">
                <button 
                  className={`exp-pill ${activeTab === 'skills' ? 'active' : ''}`}
                  onClick={() => setActiveTab('skills')}
                >
                  Jobs by Skills
                </button>
                <button 
                  className={`exp-pill ${activeTab === 'designation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('designation')}
                >
                  Jobs by Designation
                </button>
                <button 
                  className={`exp-pill ${activeTab === 'city' ? 'active' : ''}`}
                  onClick={() => setActiveTab('city')}
                >
                  Jobs by City
                </button>
                <button 
                  className={`exp-pill ${activeTab === 'company' ? 'active' : ''}`}
                  onClick={() => setActiveTab('company')}
                >
                  Jobs By Company
                </button>
                <button 
                  className={`exp-pill ${activeTab === 'industry' ? 'active' : ''}`}
                  onClick={() => setActiveTab('industry')}
                >
                  Jobs by Industry
                </button>
                <button 
                  className={`exp-pill ${activeTab === 'popular' ? 'active' : ''}`}
                  onClick={() => setActiveTab('popular')}
                >
                  Popular Jobs
                </button>
              </div>

              <div className="explore-links-grid">
                {jobsBySkills.map((col, cIdx) => (
                  <ul key={cIdx} className="explore-col-list">
                    {col.map((item, rIdx) => (
                      <li key={rIdx}>
                        <a href="#!">{item}</a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="footer-main-navy-section">
        <div className="content-wrapper" style={{ paddingTop: '36px', paddingBottom: '30px' }}>
          
          <div className="footer-columns-row">
            
            <div className="footer-nav-col">
              <div className="footer-accordion-item">
                <div className="accordion-title-flex" onClick={() => setIsBlogsOpen(!isBlogsOpen)}>
                  <h4>Trending Blogs</h4>
                  {isBlogsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {isBlogsOpen && (
                  <ul className="footer-sub-links">
                    <li><a href="#!">Top Tech Salaries 2026</a></li>
                    <li><a href="#!">AI Resume Writing Guide</a></li>
                    <li><a href="#!">Notice Period Rules in India</a></li>
                  </ul>
                )}
              </div>

              <div className="footer-accordion-item" style={{ marginTop: '18px' }}>
                <div className="accordion-title-flex" onClick={() => setIsJobsOpen(!isJobsOpen)}>
                  <h4>Trending Jobs</h4>
                  {isJobsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {isJobsOpen && (
                  <ul className="footer-sub-links">
                    <li><a href="#!">Remote Frontend Roles</a></li>
                    <li><a href="#!">Data Scientist Jobs in Bangalore</a></li>
                    <li><a href="#!">Semiconductor VLSI Openings</a></li>
                  </ul>
                )}
              </div>
            </div>

            <div className="footer-nav-col">
              <h4>Important Links</h4>
              <ul className="footer-links-list">
                <li><a href="#!">Employer Home</a></li>
                <li><a href="#!">About Us</a></li>
                <li><a href="#!">Contact Us</a></li>
                <li><a href="#!">Fraud Alert</a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Job Seekers</h4>
              <ul className="footer-links-list">
                <li><a href="#!">Register/Login</a></li>
                <li><a href="#!">Job Search</a></li>
                <li><a href="#!">Create Free Job Alert</a></li>
                <li><a href="#!">Job Assistance Services</a></li>
                <li><a href="#!">Courses</a></li>
                <li><a href="/guidance" style={{ color: '#FFD200', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Peerpath <span className="footer-new-tag">NEW</span></a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Resources</h4>
              <ul className="footer-links-list">
                <li><a href="#!">Business News</a></li>
                <li><a href="#!">English News</a></li>
                <li><a href="#!">Disclaimer</a></li>
                <li><a href="#!">FAQ's</a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Employers</h4>
              <ul className="footer-links-list">
                <li><a href="#!">Register/Log-In</a></li>
                <li><a href="#!">Recruiter India</a></li>
                <li><a href="#!">Post a Job</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-promo-strip">
            
            <div className="download-app-banner">
              <div className="download-app-text">
                <h3>Download Shine App</h3>
                <p>Get the latest job updates instantly on the Shine App</p>
              </div>
              <button className="btn-footer-get-app">
                Get App <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="partner-sites-wrap">
              <div className="partner-title-divider">
                <span className="partner-line"></span>
                <span className="partner-title">Our Partner Sites</span>
                <span className="partner-line"></span>
              </div>
              <div className="partner-marquee-container">
                <div className="partner-marquee-track">
                  {[
                    { name: 'Live Hindustan', src: 'https://www.shine.com/nova/assets/partner-sites/live-hindustan.svg' },
                    { name: 'Fab Play', src: 'https://www.shine.com/nova/assets/partner-sites/fab-play.svg' },
                    { name: 'OTT Play', src: 'https://www.shine.com/nova/assets/partner-sites/ott-play.svg' },
                    { name: 'Live Mint', src: 'https://www.shine.com/nova/assets/partner-sites/live-mint.svg' },
                    { name: 'Hindustan Times', src: 'https://www.shine.com/nova/assets/partner-sites/hindustan-times.svg' },
                    // Repeated sets for seamless infinite loop
                    { name: 'Live Hindustan 2', src: 'https://www.shine.com/nova/assets/partner-sites/live-hindustan.svg' },
                    { name: 'Fab Play 2', src: 'https://www.shine.com/nova/assets/partner-sites/fab-play.svg' },
                    { name: 'OTT Play 2', src: 'https://www.shine.com/nova/assets/partner-sites/ott-play.svg' },
                    { name: 'Live Mint 2', src: 'https://www.shine.com/nova/assets/partner-sites/live-mint.svg' },
                    { name: 'Hindustan Times 2', src: 'https://www.shine.com/nova/assets/partner-sites/hindustan-times.svg' },
                    { name: 'Live Hindustan 3', src: 'https://www.shine.com/nova/assets/partner-sites/live-hindustan.svg' },
                    { name: 'Fab Play 3', src: 'https://www.shine.com/nova/assets/partner-sites/fab-play.svg' },
                    { name: 'OTT Play 3', src: 'https://www.shine.com/nova/assets/partner-sites/ott-play.svg' },
                    { name: 'Live Mint 3', src: 'https://www.shine.com/nova/assets/partner-sites/live-mint.svg' },
                    { name: 'Hindustan Times 3', src: 'https://www.shine.com/nova/assets/partner-sites/hindustan-times.svg' },
                  ].map((partner, idx) => (
                    <div key={idx} className="partner-logo-box">
                      <img src={partner.src} alt={partner.name} className="partner-brand-svg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="footer-bottommost-bar">
        <div className="content-wrapper footer-bottom-flex">
          
          <div className="fb-left">
            <img 
              src="https://staticcand.shine.com/c/s1/images/candidate/nova/home/shine-logo.svg" 
              alt="Shine Logo" 
              className="fb-logo"
            />
            <span>@ 2026 Shine.com | All Right Reserved</span>
          </div>

          <div className="fb-center-links">
            <a href="#!">T&C</a>
            <span>|</span>
            <a href="#!">Privacy Policy</a>
            <span>|</span>
            <a href="#!">Cookie Policy</a>
            <span>|</span>
            <a href="#!">Report Job Posting</a>
          </div>

          <div className="fb-right-social">
            <span className="social-label">CONNECT WITH US:</span>
            <div className="social-icon-links">
              <a href="#!" className="s-icon" title="Facebook">f</a>
              <a href="#!" className="s-icon" title="Instagram">📷</a>
              <a href="#!" className="s-icon" title="LinkedIn">in</a>
              <a href="#!" className="s-icon" title="X">𝕏</a>
              <a href="#!" className="s-icon" title="YouTube">▶</a>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};
