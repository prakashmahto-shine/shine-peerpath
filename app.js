const EXPERTS_DB = [
  {
    id: "amit",
    name: "Amit Verma",
    role: "Senior SaaS Sales Manager",
    company: "Salesforce",
    domain: "SaaS Sales",
    experience: "8+ Years Exp.",
    rating: 4.8,
    reviewsCount: 120,
    sessionsCount: 280,
    price: 999,
    location: "Bengaluru, India",
    duration: "01:12",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: How I built my career in SaaS Sales at Salesforce",
    skills: ["SaaS Sales", "Enterprise Sales", "Account Management", "CRM", "MEDDIC"],
    bio: "I help professionals transition into SaaS Sales and grow in their careers. I've worked with global enterprise teams and closed multi-million dollar deals.",
    verifiedEmail: "@salesforce.com"
  },
  {
    id: "neha",
    name: "Neha Gupta",
    role: "SaaS Account Executive",
    company: "Zoho",
    domain: "SaaS Sales",
    experience: "6+ Years Exp.",
    rating: 4.7,
    reviewsCount: 98,
    sessionsCount: 190,
    price: 799,
    location: "Chennai, India",
    duration: "01:08",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: Transitioning from Inside Sales to Mid-Market SaaS Account Exec",
    skills: ["SaaS Sales", "Inside Sales", "Lead Pipeline", "Outbound"],
    bio: "Made the leap from cold calling to closing 6-figure SaaS contracts. I will review your pitch deck and share real closing frameworks.",
    verifiedEmail: "@zoho.com"
  },
  {
    id: "rohan",
    name: "Rohan Mehta",
    role: "Head of Sales",
    company: "Freshworks",
    domain: "SaaS Sales",
    experience: "10+ Years Exp.",
    rating: 4.9,
    reviewsCount: 150,
    sessionsCount: 340,
    price: 1299,
    location: "Bengaluru, India",
    duration: "01:15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: How to Scale from SDR to Sales Director in 5 Years",
    skills: ["SaaS Sales", "Team Management", "Global Enterprise", "Negotiation"],
    bio: "Scaled Freshworks enterprise teams across US and APAC. I conduct mock interviews with executive hiring rubrics.",
    verifiedEmail: "@freshworks.com"
  },
  {
    id: "pooja",
    name: "Pooja Shah",
    role: "Sales Director",
    company: "Microsoft",
    domain: "SaaS Sales",
    experience: "12+ Years Exp.",
    rating: 4.6,
    reviewsCount: 86,
    sessionsCount: 160,
    price: 1499,
    location: "Mumbai, India",
    duration: "01:18",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: Enterprise Cloud & Azure Sales Strategy",
    skills: ["SaaS Sales", "Strategic Learning", "Cloud Architecture", "Partner Sales"],
    bio: "Director at Microsoft Cloud. I provide guidance for enterprise technology positioning and executive communication.",
    verifiedEmail: "@microsoft.com"
  },
  {
    id: "ishita",
    name: "Ishita Sharma",
    role: "Senior Data Scientist",
    company: "Swiggy",
    domain: "AI/ML",
    experience: "7+ Years Exp.",
    rating: 4.8,
    reviewsCount: 96,
    sessionsCount: 210,
    price: 899,
    location: "Bengaluru, India",
    duration: "01:09",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: Transitioning from Data Analyst to Senior ML Engineer",
    skills: ["Data Science", "Machine Learning", "PyTorch", "LLMs", "FastAPI"],
    bio: "Built real-time dispatch and recommendation algorithms at Swiggy. I guide developers making the jump into production GenAI.",
    verifiedEmail: "@swiggy.in"
  },
  {
    id: "arjun",
    name: "Arjun Rao",
    role: "Product Manager",
    company: "Atlassian",
    domain: "Full-Stack",
    experience: "9+ Years Exp.",
    rating: 4.7,
    reviewsCount: 112,
    sessionsCount: 230,
    price: 999,
    location: "Bengaluru, India",
    duration: "01:10",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: From Software Engineer to Tier-1 Product Lead",
    skills: ["Product Mgmt", "Agile", "Strategy", "System Design"],
    bio: "Ex-engineer turned Product Lead at Jira/Atlassian. I help technical folk build strong product discovery and PM interview chops.",
    verifiedEmail: "@atlassian.com"
  },
  {
    id: "vikram",
    name: "Vikram Joshi",
    role: "Engineering Manager",
    company: "Google",
    domain: "Full-Stack",
    experience: "10+ Years Exp.",
    rating: 4.9,
    reviewsCount: 190,
    sessionsCount: 420,
    price: 1499,
    location: "Hyderabad, India",
    duration: "01:13",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: Cracking Staff Engineer & System Design Loops",
    skills: ["Frontend Dev", "React.js", "System Design", "Cloud Infra"],
    bio: "Engineering leader at Google. 1:1 architectural reviews, mock coding & tier-1 system design mentorship.",
    verifiedEmail: "@google.com"
  },
  {
    id: "sneha",
    name: "Sneha Iyer",
    role: "UX Design Lead",
    company: "Adobe",
    domain: "Full-Stack",
    experience: "6+ Years Exp.",
    rating: 4.7,
    reviewsCount: 98,
    sessionsCount: 180,
    price: 799,
    location: "Noida, India",
    duration: "01:11",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    videoPoster: "https://images.unsplash.com/photo-1581291518655-9523c93269e4?w=1000&auto=format&fit=crop&q=80",
    teaserTitle: "Teaser: Portfolio Reviews that Get You Hired at Adobe",
    skills: ["UI/UX Design", "Design Systems", "Figma", "User Research"],
    bio: "Design Lead at Adobe Experience Cloud. Portfolio critique and design sprint coaching.",
    verifiedEmail: "@adobe.com"
  }
];

let currentSelectedExpert = EXPERTS_DB[0];
let activeDomainFilter = "all";
let selectedBookingDate = "Fri, 2 Sep";
let selectedBookingTime = "10:00 AM - 11:00 AM";
let liveCallInterval = null;
let liveCallSeconds = 28 * 60 + 15; 
let isMuted = false;
let isVideoOff = false;
let isVideoPlaying = false;
let videoPlayInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  renderExpertsGallery(EXPERTS_DB);

  switchView('profile-view');
});

function switchView(viewId) {

  const screens = document.querySelectorAll(".view-screen");
  screens.forEach(s => s.classList.remove("active"));

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateDemoBarPills(viewId);

  const navGuidanceBtn = document.getElementById("navGuidanceBtn");
  if (viewId === "guidance-view" || viewId === "experts-view") {
    navGuidanceBtn.classList.add("active-cta");
  } else {
    navGuidanceBtn.classList.remove("active-cta");
  }

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
  }, 50);
}

function updateDemoBarPills(viewId) {
  const pills = document.querySelectorAll(".demo-pill");
  pills.forEach(p => p.classList.remove("active"));

  if (viewId === "profile-view") pills[0]?.classList.add("active");
  else if (viewId === "guidance-view") pills[1]?.classList.add("active");
  else if (viewId === "experts-view") pills[2]?.classList.add("active");
  else if (viewId === "expert-profile-view") pills[3]?.classList.add("active");
  else if (viewId === "payment-view") pills[5]?.classList.add("active");
  else if (viewId === "sessions-view") pills[6]?.classList.add("active");
  else if (viewId === "live-call-view") pills[7]?.classList.add("active");
  else if (viewId === "post-session-view") pills[8]?.classList.add("active");
  else if (viewId === "recruiter-view") pills[10]?.classList.add("active");
}

function scrollToOpportunities() {
  const section = document.getElementById("opportunitiesSection");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function renderExpertsGallery(experts) {
  const grid = document.getElementById("expertCardsGrid");
  if (!grid) return;

  if (experts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: span 3; text-align: center; padding: 40px; background: #fff; border-radius: 12px;">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: #94a3b8; margin-bottom: 10px;"></i>
        <h3>No experts found</h3>
        <p style="color: #64748b; font-size: 13px;">Try adjusting your search terms or filters.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = experts.map(exp => `
    <div class="expert-teaser-card" id="card-${exp.id}">
      <div class="card-video-thumb-wrap" onclick="openExpertProfile('${exp.id}')">
        <img src="${exp.videoPoster}" alt="${exp.name}" class="card-video-thumb-img">
        <div class="video-thumb-play-overlay">
          <div class="thumb-play-btn"><i data-lucide="play"></i></div>
        </div>
        <span class="thumb-duration-badge">${exp.duration}</span>
      </div>

      <div class="card-content-body">
        <div class="card-expert-info">
          <img src="${exp.avatar}" alt="${exp.name}" class="card-avatar-img">
          <div class="card-meta-text">
            <div class="card-name-row">
              <h3 class="card-expert-name">${exp.name} <i data-lucide="shield-check" class="verified-badge-shield" title="Verified Work Email"></i></h3>
            </div>
            <p class="card-expert-role">${exp.role} at <strong>${exp.company}</strong></p>
          </div>
        </div>

        <div class="card-stats-row">
          <span class="card-exp">${exp.experience}</span>
          <span class="card-rating"><i data-lucide="star" class="star-gold"></i> ${exp.rating} (${exp.reviewsCount})</span>
        </div>

        <div class="card-skills-row">
          ${exp.skills.slice(0, 2).map(s => `<span class="card-skill-tag">${s}</span>`).join('')}
        </div>

        <div class="card-footer-pricing-row">
          <div>
            <span class="card-price-text">₹${exp.price}</span>
            <span class="card-price-unit">/ 60 min</span>
          </div>
          <div class="card-btn-group">
            <button class="btn-card-action-sm btn-teaser-play" onclick="openExpertProfile('${exp.id}')">Watch Teaser</button>
            <button class="btn-card-action-sm btn-book-sm" onclick="openBookingModal('${exp.id}')">Book Session</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function filterExperts() {
  const searchVal = (document.getElementById("expertSearchInput")?.value || "").toLowerCase();
  const expVal = document.getElementById("expFilter")?.value || "all";
  const priceVal = document.getElementById("priceFilter")?.value || "all";
  const sortVal = document.getElementById("sortFilter")?.value || "trajectory";

  let filtered = EXPERTS_DB.filter(exp => {

    if (activeDomainFilter !== "all" && exp.domain !== activeDomainFilter) {
      return false;
    }

    if (searchVal) {
      const matchName = exp.name.toLowerCase().includes(searchVal);
      const matchRole = exp.role.toLowerCase().includes(searchVal);
      const matchComp = exp.company.toLowerCase().includes(searchVal);
      const matchSkill = exp.skills.some(s => s.toLowerCase().includes(searchVal));
      if (!matchName && !matchRole && !matchComp && !matchSkill) return false;
    }

    if (priceVal === "under1000" && exp.price > 1000) return false;
    if (priceVal === "under1500" && exp.price > 1500) return false;

    return true;
  });

  if (sortVal === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortVal === "sessions") {
    filtered.sort((a, b) => b.sessionsCount - a.sessionsCount);
  }

  renderExpertsGallery(filtered);
}

function setDomainFilter(domain, btn) {
  activeDomainFilter = domain;
  document.querySelectorAll(".filter-pill-group .f-pill").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  filterExperts();
}

function handlePriceSlider(val) {
  const display = document.getElementById("priceDisplay");
  if (display) display.innerText = `₹0 - ₹${val}`;
  const filtered = EXPERTS_DB.filter(e => e.price <= parseInt(val));
  renderExpertsGallery(filtered);
}

function resetFilters() {
  activeDomainFilter = "all";
  document.querySelectorAll(".filter-pill-group .f-pill").forEach((p, idx) => {
    p.classList.toggle("active", idx === 0);
  });
  if (document.getElementById("expertSearchInput")) document.getElementById("expertSearchInput").value = "";
  if (document.getElementById("expFilter")) document.getElementById("expFilter").value = "all";
  if (document.getElementById("priceFilter")) document.getElementById("priceFilter").value = "all";
  if (document.getElementById("priceRangeSlider")) document.getElementById("priceRangeSlider").value = 2500;
  if (document.getElementById("priceDisplay")) document.getElementById("priceDisplay").innerText = "₹0 - ₹2,500";
  renderExpertsGallery(EXPERTS_DB);
}

function handleGlobalSearch(e) {
  const query = e.target.value;
  if (e.key === "Enter" || query.length > 2) {
    switchView("experts-view");
    const input = document.getElementById("expertSearchInput");
    if (input) {
      input.value = query;
      filterExperts();
    }
  }
}

function openExpertProfile(expertId) {
  const expert = EXPERTS_DB.find(e => e.id === expertId) || EXPERTS_DB[0];
  currentSelectedExpert = expert;

  document.getElementById("epAvatar").src = expert.avatar;
  document.getElementById("epName").innerText = expert.name;
  document.getElementById("epHeadline").innerText = `${expert.role} at ${expert.company}`;
  document.getElementById("epLocation").innerText = expert.location;
  document.getElementById("epRating").innerText = expert.rating;
  document.getElementById("epReviewsCount").innerText = expert.reviewsCount;
  document.getElementById("epTabReviewCount").innerText = expert.reviewsCount;
  document.getElementById("epExp").innerText = expert.experience;
  document.getElementById("epSessionsCount").innerText = `${expert.sessionsCount}+`;
  document.getElementById("epPrice").innerText = `₹${expert.price}`;
  document.getElementById("epBioText").innerText = expert.bio;
  document.getElementById("epVideoPoster").src = expert.videoPoster;
  document.getElementById("epVideoDuration").innerText = expert.duration;
  document.getElementById("epTeaserTitle").innerText = expert.teaserTitle;

  const chipsWrap = document.getElementById("epSkillsChips");
  chipsWrap.innerHTML = expert.skills.map(s => `<span class="card-skill-tag">${s}</span>`).join('');

  switchView('expert-profile-view');
}

function openExpertProfileCurrent() {
  if (currentSelectedExpert) openExpertProfile(currentSelectedExpert.id);
}

function switchEpTab(tabName, btn) {
  document.querySelectorAll(".ep-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".ep-tab-pane").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  const target = document.getElementById(`epTab-${tabName}`);
  if (target) target.classList.add("active");
  if (window.lucide) window.lucide.createIcons();
}

function toggleTeaserPlay() {
  const progressBar = document.getElementById("videoProgressBar");
  const playIcon = document.getElementById("playIcon");
  const playPulse = document.getElementById("playBtnPulse");

  if (isVideoPlaying) {
    clearInterval(videoPlayInterval);
    isVideoPlaying = false;
    playIcon.setAttribute("data-lucide", "play");
    playPulse.style.opacity = "1";
  } else {
    isVideoPlaying = true;
    playIcon.setAttribute("data-lucide", "pause");
    playPulse.style.opacity = "0.3";
    let progress = 35;
    videoPlayInterval = setInterval(() => {
      progress += 2;
      if (progress > 100) progress = 0;
      if (progressBar) progressBar.style.width = progress + "%";
    }, 400);
  }
  if (window.lucide) window.lucide.createIcons();
}

function openTeaserModalCurrent() {
  toggleTeaserPlay();
}

function openBookingModal(expertId) {
  const expert = EXPERTS_DB.find(e => e.id === expertId) || currentSelectedExpert;
  currentSelectedExpert = expert;

  document.getElementById("bkModalAvatar").src = expert.avatar;
  document.getElementById("bkModalName").innerText = expert.name;
  document.getElementById("bkModalHeadline").innerText = `${expert.role} at ${expert.company}`;
  document.getElementById("bkModalPriceDisplay").innerText = `₹${expert.price}`;

  const modal = document.getElementById("bookingModal");
  modal.classList.add("open");
  if (window.lucide) window.lucide.createIcons();
}

function openBookingModalCurrent() {
  openBookingModal(currentSelectedExpert.id);
}

function closeBookingModal() {
  document.getElementById("bookingModal").classList.remove("open");
}

function selectCalDate(element, dateStr) {
  document.querySelectorAll(".cal-date").forEach(d => d.classList.remove("active-date"));
  element.classList.add("active-date");
  selectedBookingDate = dateStr;
  const label = document.getElementById("selectedDateLabel");
  if (label) label.innerText = dateStr;
}

function selectTimeSlot(element, slotStr) {
  document.querySelectorAll(".slot-pill").forEach(s => s.classList.remove("active-slot"));
  element.classList.add("active-slot");
  selectedBookingTime = slotStr;
}

function proceedToPaymentFromModal() {
  closeBookingModal();
  openPaymentView();
}

function openPaymentView() {
  const expert = currentSelectedExpert || EXPERTS_DB[0];

  document.getElementById("payAvatar").src = expert.avatar;
  document.getElementById("payName").innerText = expert.name;
  document.getElementById("payHeadline").innerText = `${expert.role} at ${expert.company}`;
  document.getElementById("payDateTime").innerText = `${selectedBookingDate} • ${selectedBookingTime}`;
  document.getElementById("billBasePrice").innerText = `₹${expert.price}`;
  document.getElementById("billTotalAmount").innerText = `₹${expert.price}`;
  document.getElementById("payBtnAmount").innerText = `₹${expert.price}`;

  switchView('payment-view');
}

function selectPayMethod(method, element) {
  document.querySelectorAll(".pay-method-row").forEach(r => r.classList.remove("active"));
  element.classList.add("active");
  const upiBox = document.getElementById("upiInputBox");
  if (upiBox) {
    upiBox.style.display = method === "upi" ? "flex" : "none";
  }
}

function simulateSuccessfulPayment() {
  const btn = document.getElementById("btnPayNow");
  btn.innerHTML = `<i data-lucide="loader-2" class="spin-anim"></i> Processing 100% Secure Payment...`;
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    btn.innerHTML = `<i data-lucide="check"></i> Payment Confirmed!`;
    const expert = currentSelectedExpert;
    document.getElementById("confAvatar").src = expert.avatar;
    document.getElementById("confName").innerText = expert.name;
    document.getElementById("confHeadline").innerText = `${expert.role} at ${expert.company}`;
    document.getElementById("confDateTime").innerText = `${selectedBookingDate} • ${selectedBookingTime}`;
    document.getElementById("confPrice").innerText = `₹${expert.price} Paid`;

    switchView('confirmed-view');
  }, 900);
}

function downloadCalInvite() {
  alert("Calendar invite (.ics) downloaded and added to your Google Calendar!");
}

function switchSessionTab(tabName, btn) {
  document.querySelectorAll(".s-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".session-tab-pane").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  const target = document.getElementById(`sessionTab-${tabName}`);
  if (target) target.classList.add("active");
}

function openLiveCall() {
  switchView('live-call-view');

  clearInterval(liveCallInterval);
  liveCallInterval = setInterval(() => {
    liveCallSeconds++;
    const mins = Math.floor(liveCallSeconds / 60);
    const secs = liveCallSeconds % 60;
    const formatted = `00:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    const timerElem = document.getElementById("callLiveTimer");
    if (timerElem) timerElem.innerText = formatted;
  }, 1000);
}

function toggleMute() {
  isMuted = !isMuted;
  const btn = document.getElementById("btnMute");
  const icon = document.getElementById("micIcon");
  if (isMuted) {
    btn.classList.add("muted");
    icon.setAttribute("data-lucide", "mic-off");
  } else {
    btn.classList.remove("muted");
    icon.setAttribute("data-lucide", "mic");
  }
  if (window.lucide) window.lucide.createIcons();
}

function toggleVideoFeed() {
  isVideoOff = !isVideoOff;
  const btn = document.getElementById("btnVideo");
  const icon = document.getElementById("videoIcon");
  if (isVideoOff) {
    btn.classList.add("muted");
    icon.setAttribute("data-lucide", "video-off");
  } else {
    btn.classList.remove("muted");
    icon.setAttribute("data-lucide", "video");
  }
  if (window.lucide) window.lucide.createIcons();
}

function toggleGapDrawer() {
  const drawer = document.getElementById("cvGapDrawer");
  if (drawer) drawer.classList.toggle("open");
}

function endLiveCall() {
  clearInterval(liveCallInterval);
  switchView('post-session-view');
}

function setStarRating(num) {
  const stars = document.querySelectorAll("#starRatingBox .star-item");
  stars.forEach((s, idx) => {
    if (idx < num) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
}

function submitSessionReview() {
  alert("Thank you! Your review has been published and your Shine Peer-Verified Badge is now ACTIVE on your profile.");
  switchView('profile-view');
}

function openPostSessionView() {
  switchView('post-session-view');
}

function openCreatorWizard() {
  const modal = document.getElementById("creatorWizardModal");
  modal.classList.add("open");
  goToWizardStep(1);
}

function closeCreatorWizard() {
  document.getElementById("creatorWizardModal").classList.remove("open");
}

function goToWizardStep(stepNum) {

  document.querySelectorAll(".wizard-step-pane").forEach(p => p.classList.remove("active"));

  const target = document.getElementById(`wzStep-${stepNum}`);
  if (target) target.classList.add("active");

  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`stNode-${i}`);
    if (i <= stepNum) {
      node.classList.add("active");
    } else {
      node.classList.remove("active");
    }
  }

  if (stepNum === 5) {
    const name = document.getElementById("wzFullName")?.value || "Prakash Kumar";
    const headline = document.getElementById("wzHeadline")?.value || "Senior Frontend Architect";
    const company = document.getElementById("wzCompany")?.value || "Google";
    const price = document.getElementById("wzPriceInput")?.value || "1499";

    document.getElementById("prevName").innerHTML = `${name} <span class="verified-icon">🛡️</span>`;
    document.getElementById("prevHeadline").innerText = `${headline} at ${company}`;
    document.querySelector(".prev-pricing strong").innerText = `₹${price}`;
  }

  if (window.lucide) window.lucide.createIcons();
}

function mockVideoUpload() {
  const badge = document.getElementById("uploadedVideoBadge");
  if (badge) {
    badge.innerHTML = `<i data-lucide="loader-2" class="spin-anim"></i> Uploading & Transcoding video (01:15 mins)...`;
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      badge.innerHTML = `<i data-lucide="check-circle" class="text-success"></i> <span><strong>prakash_career_teaser.mp4</strong> (01:15 mins - Ready)</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 600);
  }
}

function publishCreatorProfile() {
  closeCreatorWizard();
  alert("🎉 Congratulations Prakash! Your Creator Profile is now LIVE on Shine Peerpath. Trajectory matched mentees will be routed to your calendar!");
  switchView('profile-view');
}

function toggleRecruiterPeerFilter() {
  const isChecked = document.getElementById("togglePeerFilter").checked;
  const cards = document.querySelectorAll(".recruiter-candidate-card");
  cards.forEach(c => {
    if (!isChecked) {
      c.style.display = "block";
    } else {
      c.style.display = c.classList.contains("verified-highlight") ? "block" : "block";
    }
  });
}
