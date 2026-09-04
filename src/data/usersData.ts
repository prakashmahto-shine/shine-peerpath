import { UserAccount, UserProfileData } from '../types';

export interface FullUserEntry {
  password: string;
  account: UserAccount;
  profile: UserProfileData;
}

export const USERS_DB: Record<string, FullUserEntry> = {
  prakash: {
    password: 'shine@123',
    account: {
      id: 'prakash',
      username: 'prakash',
      name: 'Prakash Mahto',
      role: 'candidate',
      avatar: '/avatars/prakash.jpg',
      email: 'prakash.mahto@gmail.com',
      headline: 'Senior Frontend Engineer | React.js, TypeScript, Next.js UI Architect',
      company: 'Current: Tech Services',
      experienceYears: '3 yrs 6 Months',
      location: 'Bengaluru, India',
      hasExpertBadge: false,
      isMentorEligible: false
    },
    profile: {
      name: 'Prakash Mahto',
      headline: 'Senior Frontend Engineer | React.js, TypeScript, Next.js UI Architect',
      experienceYears: '3 yrs 6 Months',
      location: 'Bengaluru, India',
      hasExpertBadge: false,
      isMentorEligible: false,
      isMentor: false,
      profileScore: 70,
      jobSearchStatus: 'Actively Looking For Jobs',
      currentCtc: '5.5 LPA',
      targetCtc: '₹18L – ₹24L',
      resumeFileName: 'Prakash-Mahto1.pdf',
      summary: 'Senior Frontend Developer with 4+ years of hands-on experience building high-traffic, resilient web applications at scale. Proficient in React.js, TypeScript, Next.js, and modern CSS architecture. Passionate about UI performance optimization, micro-frontends, and collaborating closely with product managers and backend search teams.',
      skills: ['React.js', 'TypeScript', 'Next.js', 'JavaScript (ES6+)', 'Redux Toolkit', 'Tailwind CSS / Vanilla CSS', 'REST APIs', 'Webpack / Vite', 'Jest & React Testing Library', 'Git & CI/CD'],
      educationDegree: 'B.Tech / B.E - Computer Science & Engineering',
      educationCollege: 'Jaipur Engineering College And Research Centre (RTU)',
      pastCompany: 'Tech Services Pvt Ltd',
      pastCompanyRole: 'Frontend Developer',
      badges: [
        {
          id: 'badge-pm-1',
          title: 'Tier-1 Frontend & UI Architecture',
          subtitle: 'Verified by Akash Jain • Lead Product Manager @ Shine',
          verifierName: 'Akash Jain',
          verifierRole: 'Lead Product Manager @ Shine',
          verifierAvatar: '/avatars/akash.jpg',
          date: 'Aug 24, 2026',
          skills: ['React.js 19', 'TypeScript Micro-Frontends', 'UI Performance', 'Design Systems'],
          status: 'verified'
        },
        {
          id: 'badge-solr-1',
          title: 'Distributed Search & Lucene Indexing',
          subtitle: 'Verified by Anirudh Sharma • Principal Search Architect @ Shine',
          verifierName: 'Anirudh Sharma',
          verifierRole: 'Principal Search Architect @ Shine',
          verifierAvatar: '/avatars/anirudh.jpg',
          date: 'Aug 12, 2026',
          skills: ['Solr Query Syntax', 'Inverted Indexing', 'Distributed Sharding', 'FastAPI'],
          status: 'verified'
        }
      ],
      email: 'prakashkr806@gmail.com',
      phone: '+91 7042653680'
    }
  },
  akash: {
    password: 'shine@123',
    account: {
      id: 'akash',
      username: 'akash',
      name: 'Akash Jain',
      role: 'mentor',
      avatar: '/avatars/akash.jpg',
      email: 'akash.jain@shine.com',
      headline: 'Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart',
      company: 'Shine (HT Media)',
      experienceYears: '8 yrs 2 Months',
      location: 'Gurugram / Remote',
      earnings: 47952,
      rating: 4.9,
      reviewsCount: 142,
      completedSessionsCount: 48,
      hasExpertBadge: true,
      isMentorEligible: true
    },
    profile: {
      name: 'Akash Jain',
      headline: 'Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart',
      experienceYears: '8 yrs 2 Months',
      location: 'Gurugram / Bengaluru, India',
      hasExpertBadge: true,
      isMentorEligible: true,
      profileScore: 95,
      jobSearchStatus: 'Casually Exploring Leadership Roles (Director/VP Product)',
      currentCtc: '38.0 LPA',
      targetCtc: '₹50L – ₹65L',
      resumeFileName: 'Akash_Jain_Lead_PM_Resume.pdf',
      educationDegree: 'B.Tech - Computer Science & Engineering + Executive MBA',
      educationCollege: 'Indian Institute of Technology (IIT) Delhi',
      pastCompany: 'Paytm / Flipkart',
      pastCompanyRole: 'Senior Product Manager',
      isMentor: true,
      mentorRating: 4.9,
      mentorReviewsCount: 142,
      mentorEarnings: 47952,
      mentorSessionsCount: 48,
      mentorRate: 999,
      mentorDuration: 45,
      mentorAvailability: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        timeSlots: [
          '10:00 AM - 11:00 AM',
          '02:00 PM - 03:00 PM',
          '06:30 PM - 07:30 PM',
          '08:00 PM - 09:00 PM'
        ]
      },
      mentorTeaserVideo: {
        url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
        title: 'How I Help Candidates Transition to PM & Tech Leadership (₹30L+ Target)',
        duration: '0:58 min',
        thumbnail: '/avatars/akash.jpg',
        uploadedAt: 'Uploaded 2 days ago'
      },
      summary: 'Lead Product Manager at Shine (HT Media) with 8+ years scaling high-concurrency B2C job matching algorithms, candidate trajectories, and search monetization platforms. Ex-Paytm and Ex-Flipkart. Passionate about product leadership, growth engineering, and mentoring future product and engineering leaders.',
      skills: [
        'Product Strategy & Vision',
        'Growth Product Management',
        'Search & Matching Algorithms',
        'A/B Testing & Data Analytics',
        'Monetization & Retention',
        'GTM & Product Execution',
        'System Design & Architecture',
        'Mentorship & Leadership'
      ],
      badges: [
        {
          id: 'badge-akash-1',
          title: 'Master Trajectory Mentor & Product Leader',
          subtitle: 'Verified by Shine Career Board & VP of Product',
          verifierName: 'Shine Career Advisory',
          verifierRole: 'Executive Leadership Panel',
          verifierAvatar: '/avatars/akash.jpg',
          date: 'Jul 15, 2026',
          skills: ['1:1 Mentorship', 'Executive Resume Review', 'Interview Prep', 'Product Leadership'],
          status: 'verified'
        }
      ],
      email: 'akash.jain@shine.com',
      phone: '+91 99112 34567'
    }
  },
  nisha: {
    password: 'shine@123',
    account: {
      id: 'nisha',
      username: 'nisha',
      name: 'Nisha Kumari',
      role: 'candidate',
      avatar: '/avatars/nisha.jpg',
      email: 'nisha.kumari@flipkart.com',
      headline: 'Staff Frontend Architect & UI Lead @ Flipkart • Ex-Swiggy',
      company: 'Flipkart',
      experienceYears: '6 yrs 8 Months',
      location: 'Bengaluru, India',
      hasExpertBadge: true,
      isMentorEligible: true
    },
    profile: {
      name: 'Nisha Kumari',
      headline: 'Staff Frontend Architect & UI Lead @ Flipkart • Ex-Swiggy',
      experienceYears: '6 yrs 8 Months',
      location: 'Bengaluru, India',
      hasExpertBadge: true,
      isMentorEligible: true,
      profileScore: 88,
      jobSearchStatus: 'Casually Exploring Leadership Roles',
      currentCtc: '32.0 LPA',
      targetCtc: '₹45L – ₹55L',
      resumeFileName: 'Nisha_Kumari_Staff_Frontend_Lead.pdf',
      summary: 'Staff Frontend Architect with 6.8+ years of experience leading core UI infrastructure, design systems, and micro-frontends at Flipkart and Swiggy. Passionate about web performance, React 19 architecture, mentoring senior engineers, and building resilient distributed web apps.',
      skills: [
        'React.js',
        'TypeScript',
        'Micro-Frontends',
        'System Design',
        'Next.js',
        'UI Performance & Web Vitals',
        'Design Systems',
        'State Management (Zustand/Redux)',
        'Engineering Leadership'
      ],
      educationDegree: 'B.Tech - Computer Science & Engineering',
      educationCollege: 'National Institute of Technology (NIT) Trichy',
      pastCompany: 'Swiggy',
      pastCompanyRole: 'Lead Frontend Engineer',
      isMentor: false, // Target of the mentor acquisition campaign!
      badges: [
        {
          id: 'badge-nisha-1',
          title: 'High-Scale Frontend & Micro-UI Architecture',
          subtitle: 'Verified by Shine Senior Board • Level 3 Staff Architect',
          verifierName: 'Shine Tech Assessment',
          verifierRole: 'Staff Evaluator',
          verifierAvatar: '/avatars/nisha.jpg',
          date: 'Jul 28, 2026',
          skills: ['Micro-Frontends', 'React 19', 'Performance', 'Design Systems'],
          status: 'verified'
        }
      ],
      email: 'nisha.kumari@flipkart.com',
      phone: '+91 98877 66554'
    }
  }
};

