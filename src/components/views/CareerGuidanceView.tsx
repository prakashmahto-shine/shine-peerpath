import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, ChevronDown, Award, Plus, LockOpen, Users,
  ShieldCheck, Loader2, BarChart2, Target, Lightbulb, IndianRupee, Wifi, Filter, Info, Cpu, Code, BookOpen,
  Calendar, RefreshCw, Layers, ExternalLink, UserPlus
} from 'lucide-react';
import { ViewType, Expert } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateSalaryBenchmark } from '../../utils/salaryBenchmark';
import { peerpathApi } from '../../services/api';

export type MentorCategoryTab = 'top' | 'ai' | 'semi' | 'cyber' | 'fullstack' | 'others';

interface TransitionMentor {
  id: string;
  name: string;
  role: string;
  company: string;
  domain: string;
  category: MentorCategoryTab;
  experience: string;
  rating: number;
  reviewsCount: number;
  followersCount: string;
  sessionsCount: number;
  price: number;
  avatar: string;
  isVerifiedEmployer: boolean;
  baselineCompany: string;
  baselineRole: string;
  leapCompany: string;
  leapRole: string;
  jumpTag: string;
  growthPercent: string;
  jumpMultiplier: string;
  jumpStory: string;
  skills: string[];
}

const VERIFIED_TRANSITION_MENTORS: TransitionMentor[] = [
  // 1. AI / ML
  {
    id: 'ishita',
    name: 'Ishita Sharma',
    role: 'Senior Data Scientist & AI Lead',
    company: 'Swiggy',
    domain: 'AI/ML',
    category: 'ai',
    experience: '7+ Yrs Exp.',
    rating: 4.95,
    reviewsCount: 112,
    followersCount: '2.8k',
    sessionsCount: 240,
    price: 899,
    avatar: '/avatars/ishita.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Mu Sigma Services',
    baselineRole: 'BI Analyst',
    leapCompany: 'Swiggy',
    leapRole: 'Senior Data Scientist',
    jumpTag: 'Services ➔ Product',
    growthPercent: '+480% Growth',
    jumpMultiplier: '4.8x Leap',
    jumpStory: 'Transitioned from SQL dashboards to building multi-modal LLM search algorithms serving 2M orders daily.',
    skills: ['PyTorch', 'LLMs', 'RAG Systems', 'Vector Search', 'FastAPI']
  },
  {
    id: 'raghavan',
    name: 'Dr. Raghavan Nair',
    role: 'Principal AI Systems Architect',
    company: 'NVIDIA',
    domain: 'AI/ML',
    category: 'ai',
    experience: '9+ Yrs Exp.',
    rating: 4.95,
    reviewsCount: 124,
    followersCount: '4.2k',
    sessionsCount: 260,
    price: 1599,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Mindtree Services',
    baselineRole: 'Senior ML Engineer',
    leapCompany: 'NVIDIA',
    leapRole: 'Principal AI Architect',
    jumpTag: 'Architect Leap',
    growthPercent: '+300% Growth',
    jumpMultiplier: '4.0x Leap',
    jumpStory: 'Leveled up from standard scikit-learn into GPU-accelerated model serving and CUDA inference at NVIDIA.',
    skills: ['CUDA C++', 'TensorRT', 'LLM Inference', 'Distributed Training', 'vLLM']
  },
  {
    id: 'tanvi',
    name: 'Tanvi Kulkarni',
    role: 'Senior Staff GenAI Researcher',
    company: 'Adobe',
    domain: 'AI/ML',
    category: 'ai',
    experience: '7+ Yrs Exp.',
    rating: 4.94,
    reviewsCount: 89,
    followersCount: '1.9k',
    sessionsCount: 180,
    price: 1199,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Mindtree Services',
    baselineRole: 'CV Engineer',
    leapCompany: 'Adobe Firefly',
    leapRole: 'Staff AI Researcher',
    jumpTag: 'Services ➔ Research',
    growthPercent: '+450% Growth',
    jumpMultiplier: '5.5x Leap',
    jumpStory: 'Moved from traditional OpenCV image processing to pioneering generative Firefly visual models.',
    skills: ['Diffusion Models', 'Stable Diffusion', 'PyTorch', 'LoRA Fine-Tuning']
  },
  {
    id: 'neha-sharma',
    name: 'Neha Sharma',
    role: 'Senior ML & Platform Engineer',
    company: 'Swiggy',
    domain: 'AI/ML',
    category: 'ai',
    experience: '6+ Yrs Exp.',
    rating: 4.92,
    reviewsCount: 95,
    followersCount: '2.4k',
    sessionsCount: 190,
    price: 999,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Cognizant',
    baselineRole: 'Backend Dev',
    leapCompany: 'Swiggy',
    leapRole: 'Senior ML Engineer',
    jumpTag: 'Backend ➔ ML',
    growthPercent: '+350% Growth',
    jumpMultiplier: '4.5x Leap',
    jumpStory: 'Transitioned from backend microservices into high-scale real-time recommendation engines at Swiggy & Flipkart.',
    skills: ['Real-time RecSys', 'Feast Store', 'PyTorch', 'High-Scale APIs']
  },

  // 2. SEMICONDUCTOR
  {
    id: 'karthik',
    name: 'Karthik Nambiar',
    role: 'Lead Silicon Verification Architect',
    company: 'Qualcomm',
    domain: 'Semiconductor',
    category: 'semi',
    experience: '8+ Yrs Exp.',
    rating: 4.9,
    reviewsCount: 88,
    followersCount: '3.1k',
    sessionsCount: 185,
    price: 1299,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Wipro VLSI',
    baselineRole: 'FPGA Engineer',
    leapCompany: 'Qualcomm',
    leapRole: 'Lead Silicon Architect',
    jumpTag: 'FPGA ➔ Silicon Lead',
    growthPercent: '+290% Growth',
    jumpMultiplier: '3.8x Leap',
    jumpStory: 'Made the transition from outsourced FPGA board testing to leading tapeout verification for flagship 3nm chipsets.',
    skills: ['SystemVerilog', 'UVM Methodology', 'PCIe Gen5', 'Formal Verification']
  },
  {
    id: 'priya',
    name: 'Priya Raman',
    role: 'Staff ASIC Physical Design Lead',
    company: 'Texas Instruments',
    domain: 'Semiconductor',
    category: 'semi',
    experience: '7.5+ Yrs Exp.',
    rating: 4.88,
    reviewsCount: 74,
    followersCount: '1.8k',
    sessionsCount: 155,
    price: 1199,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'SmartSoC Services',
    baselineRole: 'Layout Engineer',
    leapCompany: 'Texas Instruments',
    leapRole: 'Staff ASIC Lead',
    jumpTag: 'Layout ➔ ASIC Lead',
    growthPercent: '+300% Growth',
    jumpMultiplier: '4.0x Leap',
    jumpStory: 'Started in manual layout cleanups; mastered automated P&R flows in ICC2 to lead sub-micron chip tapeouts.',
    skills: ['ASIC Physical Design', 'Static Timing (STA)', 'Floorplanning', 'Synopsys ICC2']
  },
  {
    id: 'rohan',
    name: 'Rohan Deshmukh',
    role: 'Principal VLSI Verification Lead',
    company: 'Intel',
    domain: 'Semiconductor',
    category: 'semi',
    experience: '10+ Yrs Exp.',
    rating: 4.93,
    reviewsCount: 94,
    followersCount: '2.1k',
    sessionsCount: 210,
    price: 1399,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Wipro VLSI Practice',
    baselineRole: 'FPGA Validator',
    leapCompany: 'Intel',
    leapRole: 'Principal VLSI Lead',
    jumpTag: 'Services ➔ Principal VLSI',
    growthPercent: '+360% Growth',
    jumpMultiplier: '4.6x Leap',
    jumpStory: 'Shifted from FPGA prototyping to full ASIC verification signoff on server silicon processors at Intel.',
    skills: ['SystemVerilog', 'UVM', 'Formal Verification', 'ARM Architecture']
  },

  // 3. CYBER-SECURITY
  {
    id: 'devansh',
    name: 'Devansh Saxena',
    role: 'Lead Cloud Security & DevSecOps',
    company: 'Palo Alto Networks',
    domain: 'Cybersecurity',
    category: 'cyber',
    experience: '7+ Yrs Exp.',
    rating: 4.92,
    reviewsCount: 104,
    followersCount: '2.6k',
    sessionsCount: 220,
    price: 1099,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'HCL Tech Support',
    baselineRole: 'Linux Sysadmin',
    leapCompany: 'Palo Alto Networks',
    leapRole: 'Lead CloudSec Architect',
    jumpTag: 'Sysadmin ➔ CloudSec',
    growthPercent: '+440% Growth',
    jumpMultiplier: '5.3x Leap',
    jumpStory: 'Mastered cloud security posture management (CSPM) and Kubernetes zero-trust to make the jump.',
    skills: ['Cloud Security', 'K8s Hardening', 'DevSecOps', 'AWS IAM', 'Terraform']
  },
  {
    id: 'meera',
    name: 'Meera Iyer',
    role: 'Staff SOC & Threat Hunting Architect',
    company: 'CrowdStrike',
    domain: 'Cybersecurity',
    category: 'cyber',
    experience: '8+ Yrs Exp.',
    rating: 4.89,
    reviewsCount: 82,
    followersCount: '2.3k',
    sessionsCount: 175,
    price: 1199,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Wipro Managed Security',
    baselineRole: 'SOC Analyst',
    leapCompany: 'CrowdStrike',
    leapRole: 'Staff Threat Hunter',
    jumpTag: 'SOC ➔ Threat Hunter',
    growthPercent: '+440% Growth',
    jumpMultiplier: '5.4x Leap',
    jumpStory: 'Escaped alert fatigue by building automated threat attribution playbooks. Now hunting APTs at CrowdStrike.',
    skills: ['Threat Hunting', 'EDR Telemetry', 'Splunk SIEM', 'Incident Response']
  },
  {
    id: 'neha-sec',
    name: 'Neha Singhal',
    role: 'Principal AppSec & Red Team Lead',
    company: 'Microsoft',
    domain: 'Cybersecurity',
    category: 'cyber',
    experience: '9+ Yrs Exp.',
    rating: 4.92,
    reviewsCount: 85,
    followersCount: '3.5k',
    sessionsCount: 190,
    price: 1299,
    avatar: '/avatars/neha.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Infosys Security',
    baselineRole: 'Vulnerability Analyst',
    leapCompany: 'Microsoft',
    leapRole: 'Principal AppSec Lead',
    jumpTag: 'Services ➔ Principal AppSec',
    growthPercent: '+540% Growth',
    jumpMultiplier: '6.4x Leap',
    jumpStory: 'Leaped from running static scanner reports into discovering zero-days and leading red team exercises for Azure.',
    skills: ['Application Security', 'Penetration Testing', 'Cloud Red Teaming', 'DevSecOps']
  },

  // 4. FULL-STACK
  {
    id: 'saheli',
    name: 'Saheli Kanjilal',
    role: 'Staff Frontend Architect',
    company: 'Razorpay',
    domain: 'Full-Stack',
    category: 'fullstack',
    experience: '7+ Yrs Exp.',
    rating: 4.9,
    reviewsCount: 178,
    followersCount: '3.8k',
    sessionsCount: 360,
    price: 999,
    avatar: '/avatars/saheli.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'TCS Services',
    baselineRole: 'Frontend Dev',
    leapCompany: 'Razorpay',
    leapRole: 'Staff UI Architect',
    jumpTag: 'Services ➔ Staff Architect',
    growthPercent: '+320% Growth',
    jumpMultiplier: '4.1x Leap',
    jumpStory: 'Mastered micro-frontends and SSR architecture to break into Tier-1 product engineering.',
    skills: ['React.js 19', 'TypeScript', 'Micro-Frontends', 'Module Federation', 'Core Web Vitals']
  },
  {
    id: 'vikram',
    name: 'Vikram Joshi',
    role: 'Staff Engineering Manager',
    company: 'Google',
    domain: 'Full-Stack',
    category: 'fullstack',
    experience: '10+ Yrs Exp.',
    rating: 4.9,
    reviewsCount: 190,
    followersCount: '5.1k',
    sessionsCount: 420,
    price: 1499,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Wipro Digital',
    baselineRole: 'Senior SDE',
    leapCompany: 'Google',
    leapRole: 'Staff EM (L6)',
    jumpTag: 'Services ➔ Google Staff',
    growthPercent: '+310% Growth',
    jumpMultiplier: '4.0x Leap',
    jumpStory: 'Cleared Google L6 loop after systematically leveling up in distributed state consensus and system design.',
    skills: ['Full-Stack Architecture', 'System Design', 'Cloud Infrastructure', 'Distributed Systems']
  },
  {
    id: 'nisha',
    name: 'Nisha Kumari',
    role: 'Staff Frontend Architect & UI Lead',
    company: 'Flipkart',
    domain: 'Full-Stack',
    category: 'fullstack',
    experience: '6+ Yrs Exp.',
    rating: 4.91,
    reviewsCount: 65,
    followersCount: '2.9k',
    sessionsCount: 145,
    price: 1299,
    avatar: '/avatars/nisha.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Mid-tier Services',
    baselineRole: 'Software Engineer',
    leapCompany: 'Flipkart',
    leapRole: 'Staff UI Architect',
    jumpTag: 'Services ➔ Staff Lead',
    growthPercent: '+350% Growth',
    jumpMultiplier: '4.5x Leap',
    jumpStory: 'Bridged core architecture and high-performance system design requirements to land role leading web checkout.',
    skills: ['React 19', 'Micro-Frontends', 'System Design', 'Web Performance']
  },

  // 5. OTHERS (Product Management, Search & Solr, SRE & Data Infra, SaaS Sales)
  {
    id: 'akash',
    name: 'Akash Jain',
    role: 'Lead Product Manager',
    company: 'Shine (HT Media)',
    domain: 'Product Management',
    category: 'others',
    experience: '7+ Yrs Exp.',
    rating: 4.95,
    reviewsCount: 142,
    followersCount: '3.4k',
    sessionsCount: 310,
    price: 999,
    avatar: '/avatars/akash.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'InfoEdge / Naukri',
    baselineRole: 'Backend SDE',
    leapCompany: 'Shine (HT Media)',
    leapRole: 'Lead Product Manager',
    jumpTag: 'SDE ➔ Product Lead',
    growthPercent: '+225% Growth',
    jumpMultiplier: '3.2x Leap',
    jumpStory: 'Spent 4 years writing backend APIs before transitioning into technical product management.',
    skills: ['Product Strategy', 'Growth Metrics', 'PRD Discovery', 'A/B Testing']
  },
  {
    id: 'pooja',
    name: 'Pooja Sundaram',
    role: 'Director of Growth & Product Strategy',
    company: 'Zepto',
    domain: 'Product Management',
    category: 'others',
    experience: '8+ Yrs Exp.',
    rating: 4.89,
    reviewsCount: 110,
    followersCount: '2.7k',
    sessionsCount: 240,
    price: 1199,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Oyo Rooms',
    baselineRole: 'Operations Analyst',
    leapCompany: 'Zepto',
    leapRole: 'Director of Growth',
    jumpTag: 'Ops ➔ Growth Director',
    growthPercent: '+330% Growth',
    jumpMultiplier: '4.3x Leap',
    jumpStory: 'Transformed operational analytics background into rapid-cycle growth engineering.',
    skills: ['Product Growth Loops', 'Retention Optimization', 'Funnel Analytics']
  },
  {
    id: 'anirudh',
    name: 'Anirudh Sharma',
    role: 'Principal Search & Database Architect',
    company: 'Shine (HT Media)',
    domain: 'Search & Data Infra',
    category: 'others',
    experience: '8+ Yrs Exp.',
    rating: 4.9,
    reviewsCount: 165,
    followersCount: '2.2k',
    sessionsCount: 390,
    price: 1199,
    avatar: '/avatars/anirudh.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Cognizant',
    baselineRole: 'Java Engineer',
    leapCompany: 'Shine (HT Media)',
    leapRole: 'Principal Search Architect',
    jumpTag: 'Java ➔ Search Architect',
    growthPercent: '+350% Growth',
    jumpMultiplier: '4.5x Leap',
    jumpStory: 'Shifted from enterprise maintenance contracts to designing real-time indexing for 40M+ profiles.',
    skills: ['Apache Solr', 'Search Indexing', 'Database Tuning', 'Distributed DBs']
  },
  {
    id: 'arunachalam',
    name: 'Arunachalam Murugan',
    role: 'Principal Platform & SRE Architect',
    company: 'Uber',
    domain: 'Platform & SRE',
    category: 'others',
    experience: '11+ Yrs Exp.',
    rating: 4.96,
    reviewsCount: 135,
    followersCount: '4.5k',
    sessionsCount: 320,
    price: 1499,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Sify Technologies',
    baselineRole: 'Sysadmin',
    leapCompany: 'Uber',
    leapRole: 'Principal SRE Architect',
    jumpTag: 'Sysadmin ➔ Principal SRE',
    growthPercent: '+800% Growth',
    jumpMultiplier: '9.0x Leap',
    jumpStory: 'Self-taught distributed systems from bare-metal server provisioning to orchestrating 50,000+ container nodes.',
    skills: ['Kubernetes Fleet', 'Observability', 'Chaos Engineering', 'Go Microservices']
  },
  {
    id: 'amit',
    name: 'Amit Verma',
    role: 'Senior Enterprise SaaS Sales Director',
    company: 'Salesforce',
    domain: 'SaaS Sales',
    category: 'others',
    experience: '8+ Yrs Exp.',
    rating: 4.86,
    reviewsCount: 120,
    followersCount: '2.5k',
    sessionsCount: 280,
    price: 999,
    avatar: '/avatars/amit.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Local IT Consultancy',
    baselineRole: 'BDE',
    leapCompany: 'Salesforce',
    leapRole: 'Senior Sales Director',
    jumpTag: 'IT Sales ➔ Enterprise Director',
    growthPercent: '+520% Growth',
    jumpMultiplier: '6.2x Leap',
    jumpStory: 'Transitioned from selling basic IT outsourcing into global cloud software contracts.',
    skills: ['Enterprise SaaS Sales', 'MEDDIC Framework', 'Stakeholder Pitching', 'Pipeline Forecasting']
  }
];

interface CareerGuidanceViewProps {
  onNavigate: (view: ViewType) => void;
  onSelectExpert: (expertId: string) => void;
  experts: Expert[];
}

export const CareerGuidanceView: React.FC<CareerGuidanceViewProps> = ({
  onNavigate,
  onSelectExpert,
  experts,
}) => {
  const { 
    userProfile, 
    setIsCreatorWizardOpen, 
    currentUser, 
    isCreatorMode,
    isCalibrationModalOpen,
    setIsCalibrationModalOpen,
    bootcamps,
    registeredBootcampIds,
    registerForBootcamp,
    setBookingDraft,
    setIsBookingModalOpen,
    toggleFollowMentor,
    isFollowingMentor
  } = useApp();

  const [activeTab, setActiveTab] = useState<MentorCategoryTab>('top');
  const isMentor = currentUser?.role === 'mentor';

  // Automatically trigger Unlock/Calibration modal if candidate is not calibrated
  useEffect(() => {
    if (!userProfile.isCalibrated && !isCreatorMode && currentUser?.role === 'candidate') {
      setIsCalibrationModalOpen(true);
    }
  }, [userProfile.isCalibrated, isCreatorMode, currentUser?.role]);

  // Dynamic salary benchmark
  const benchmark = calculateSalaryBenchmark(userProfile.currentCtc, userProfile.targetCtc);
  const userCurrentSalary = benchmark.currentCtcDisplay;
  const userTargetSalary = benchmark.targetCtcDisplay;
  const jumpPercentageDisplay = benchmark.jumpPercentageDisplay;

  // Candidate Target context
  const userTargetRole = userProfile.targetRole || 'Full-Stack UI Architect';
  const userDreamCompany = userProfile.dreamCompany || 'Swiggy / Qualcomm / Razorpay';
  const userCurrentCompany = userProfile.currentCompany || 'Tech Services';

  // Calculate dynamic match scores & Top 5 Recommended
  const { topRecommendedMentors, domainCounts } = useMemo(() => {
    const targetRoleLower = userTargetRole.toLowerCase();
    const dreamCompanyLower = userDreamCompany.toLowerCase();

    // Score all mentors based on target role, company & skills
    const scoredMentors = VERIFIED_TRANSITION_MENTORS.map(m => {
      let score = 70;

      // Domain / role matching
      if (
        (targetRoleLower.includes('ai') || targetRoleLower.includes('ml') || targetRoleLower.includes('data')) &&
        m.category === 'ai'
      ) {
        score += 24;
      } else if (
        (targetRoleLower.includes('semi') || targetRoleLower.includes('vlsi') || targetRoleLower.includes('silicon') || targetRoleLower.includes('rtl')) &&
        m.category === 'semi'
      ) {
        score += 24;
      } else if (
        (targetRoleLower.includes('cyber') || targetRoleLower.includes('security') || targetRoleLower.includes('appsec')) &&
        m.category === 'cyber'
      ) {
        score += 24;
      } else if (
        (targetRoleLower.includes('full') || targetRoleLower.includes('front') || targetRoleLower.includes('react') || targetRoleLower.includes('arch')) &&
        m.category === 'fullstack'
      ) {
        score += 24;
      } else if (
        (targetRoleLower.includes('pm') || targetRoleLower.includes('product') || targetRoleLower.includes('search') || targetRoleLower.includes('solr')) &&
        m.category === 'others'
      ) {
        score += 24;
      }

      // Company match bonus
      if (dreamCompanyLower && m.company.toLowerCase().includes(dreamCompanyLower.split(' ')[0].toLowerCase())) {
        score += 6;
      }

      // Rating bonus
      score += Math.round((m.rating - 4.8) * 10);

      return {
        ...m,
        matchScore: Math.min(99, Math.max(78, score))
      };
    });

    // Sort descending by match score
    const sorted = [...scoredMentors].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    const top5 = sorted.slice(0, 5);

    // Count per category
    const counts: Record<MentorCategoryTab, number> = {
      top: 5,
      ai: VERIFIED_TRANSITION_MENTORS.filter(m => m.category === 'ai').length,
      semi: VERIFIED_TRANSITION_MENTORS.filter(m => m.category === 'semi').length,
      cyber: VERIFIED_TRANSITION_MENTORS.filter(m => m.category === 'cyber').length,
      fullstack: VERIFIED_TRANSITION_MENTORS.filter(m => m.category === 'fullstack').length,
      others: VERIFIED_TRANSITION_MENTORS.filter(m => m.category === 'others').length
    };

    return {
      topRecommendedMentors: top5,
      domainCounts: counts
    };
  }, [userTargetRole, userDreamCompany]);

  // Displayed mentors for current active tab
  const displayedMentors = useMemo(() => {
    if (activeTab === 'top') {
      return topRecommendedMentors;
    }
    return VERIFIED_TRANSITION_MENTORS.filter(m => m.category === activeTab);
  }, [activeTab, topRecommendedMentors]);

  // Action: Book 1:1 Session with Mentor -> opens booking modal popup
  const handleBook1on1 = (mentor: TransitionMentor) => {
    const matchedExpert: Expert = (experts && experts.find(e => e.id === mentor.id)) || {
      id: mentor.id,
      name: mentor.name,
      role: mentor.role,
      company: mentor.company,
      domain: mentor.domain,
      experience: mentor.experience,
      rating: mentor.rating,
      reviewsCount: mentor.reviewsCount,
      sessionsCount: mentor.sessionsCount,
      price: mentor.price,
      location: 'Bengaluru / Remote',
      duration: '01:00',
      avatar: mentor.avatar,
      videoPoster: mentor.avatar,
      teaserTitle: `Teaser: 1:1 Career Leap into ${mentor.role} @ ${mentor.company}`,
      skills: mentor.skills,
      bio: mentor.jumpStory,
      verifiedEmail: `${mentor.id}@${mentor.company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      isVerifiedEmployer: true
    };

    if (setBookingDraft) {
      setBookingDraft({
        expert: matchedExpert,
        date: 'Tomorrow, 11 Sep',
        timeSlot: '07:00 PM - 08:00 PM',
        attachedCvName: userProfile.resumeFileName || '',
        sessionType: `1:1 Career Transition & ${mentor.domain} Guidance`,
        amount: mentor.price || 999,
        duration: '45 Mins'
      });
    }

    onSelectExpert(mentor.id);
    setIsBookingModalOpen(true);
  };

  // Action: View Mentor Profile -> navigates to expert profile page
  const handleViewMentorProfile = (mentorId: string) => {
    onSelectExpert(mentorId);
  };

  const scrollToMentors = () => {
    const el = document.getElementById('mentorsShowcaseSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="content-wrapper peerpath-guidance-page">

      {/* Trajectory Calibration Status Bar (Shown ONLY after user has calibrated) */}
      {userProfile.isCalibrated && (
        <div className="peerpath-trajectory-status-bar calibrated">
          <div className="ptsb-left">
            <span className="ptsb-chip-badge">🎯 CALIBRATED TARGET MATCH</span>
            <div className="ptsb-route">
              <span className="ptsb-cur">{userCurrentCompany}</span>
              <span className="ptsb-arrow">➔</span>
              <span className="ptsb-target">{userDreamCompany}</span>
              <span className="ptsb-role">({userTargetRole})</span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-ptsb-recalibrate"
            onClick={() => setIsCalibrationModalOpen(true)}
            title="Update your target role or target company"
          >
            <RefreshCw size={12} />
            <span>Recalibrate Target</span>
          </button>
        </div>
      )}

      {/* Main Peerpath Content Flow */}
      <div 
        className={`peerpath-main-content-flow ${!userProfile.isCalibrated ? 'peerpath-locked-blur' : ''}`}
        onClick={() => {
          if (!userProfile.isCalibrated) {
            setIsCalibrationModalOpen(true);
          }
        }}
      >

        {/* Peerpath Top Sub-Nav View Switcher (Candidate Mode Only) */}
        {!isCreatorMode && (
          <div className="peerpath-top-nav-switcher">
            <div className="ptn-left-group">
              <button 
                type="button"
                className="ptn-tab-btn active"
                onClick={() => {}}
              >
                <TrendingUp size={15} className="ptn-icon" />
                <span>Matched Mentors</span>
                <span className="ptn-badge-pill">Target Matched</span>
              </button>
              
              <button 
                type="button" 
                className="ptn-tab-btn ptn-mentors-highlight"
                onClick={() => onNavigate('experts-view')}
              >
                <div className="ptn-avatars-stack">
                  <img src="/avatars/saheli.jpg" alt="Mentor" className="ptn-av" />
                  <img src="/avatars/ishita.jpg" alt="Mentor" className="ptn-av" />
                  <img src="/avatars/akash.jpg" alt="Mentor" className="ptn-av" />
                  <span className="ptn-live-dot"></span>
                </div>
                <span className="ptn-label-main">Explore 500+ Mentors</span>
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
        )}

        {/* 1. Official Shine Peerpath Hero Banner (Clean Full Width) */}
        <div className="peerpath-hero-banner-card">
          <div className="phb-left">
            {/* Main Heading & Candidate Subtitle */}
            <h1 className="phb-title">
              Targeted Mentors for {userProfile.name || 'Prakash Mahto'}
            </h1>
            <div className="phb-role-subtitle">
              Targeting: <strong>{userTargetRole}</strong> @ <strong>{userDreamCompany}</strong>
            </div>

            {/* Description */}
            <p className="phb-desc">
              Connect directly with verified tech leaders & engineers from Swiggy, Qualcomm, Razorpay, and Google who made the exact career jump.
            </p>

            {/* 3 Metric Cards Row */}
            <div className="phb-stats-row">
              <div className="phb-stat-card">
                <div className="phb-stat-icon-wrap icon-purple">
                  <Users size={16} />
                </div>
                <div className="phb-stat-info">
                  <span className="phb-stat-label">Verified Mentors</span>
                  <strong className="phb-stat-val val-purple">500+ Active</strong>
                </div>
              </div>

              <div className="phb-stat-card">
                <div className="phb-stat-icon-wrap icon-green">
                  <TrendingUp size={16} />
                </div>
                <div className="phb-stat-info">
                  <span className="phb-stat-label">Career Leap</span>
                  <strong className="phb-stat-val val-green">Services ➔ Tier-1</strong>
                </div>
              </div>

              <div className="phb-stat-card">
                <div className="phb-stat-icon-wrap icon-blue">
                  <Video size={16} />
                </div>
                <div className="phb-stat-info">
                  <span className="phb-stat-label">1:1 Live Guidance</span>
                  <strong className="phb-stat-val val-blue">100% Verified</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mentors Showcase Section with Category Tabs */}
        <div className="peerpath-mentors-showcase-section" id="mentorsShowcaseSection">
          
          {/* Section Header */}
          <div className="pms-section-header">
            <div className="pms-title-wrap">
              <div className="pms-badge-row">
                <span className="pms-section-pill">
                  <ShieldCheck size={13} className="text-emerald-600" /> 100% VERIFIED PEER MENTORS
                </span>
              </div>
              <h2 className="pms-heading">Verified Mentors for Your Career Leap</h2>
              <p className="pms-subheading">
                Connect 1:1 with industry leaders from Swiggy, Qualcomm, Razorpay, NVIDIA, Google, and Microsoft who made the exact career jump.
              </p>
            </div>
          </div>

          {/* Segmented Category Tabs Bar */}
          <div className="peerpath-mentor-tabs-bar">
            <button
              type="button"
              className={`pm-tab-btn ${activeTab === 'top' ? 'active' : ''}`}
              onClick={() => setActiveTab('top')}
            >
              <Target size={14} className="pm-tab-icon" />
              <span>🎯 Top 5 Recommended</span>
              <span className="pm-tab-count">{domainCounts.top}</span>
            </button>

            <button
              type="button"
              className={`pm-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <Sparkles size={14} className="pm-tab-icon text-teal-600" />
              <span>🤖 AI / ML</span>
              <span className="pm-tab-count">{domainCounts.ai}</span>
            </button>

            <button
              type="button"
              className={`pm-tab-btn ${activeTab === 'semi' ? 'active' : ''}`}
              onClick={() => setActiveTab('semi')}
            >
              <Cpu size={14} className="pm-tab-icon text-indigo-600" />
              <span>⚡ Semi-conductor</span>
              <span className="pm-tab-count">{domainCounts.semi}</span>
            </button>

            <button
              type="button"
              className={`pm-tab-btn ${activeTab === 'cyber' ? 'active' : ''}`}
              onClick={() => setActiveTab('cyber')}
            >
              <ShieldCheck size={14} className="pm-tab-icon text-blue-600" />
              <span>🛡️ Cyber-security</span>
              <span className="pm-tab-count">{domainCounts.cyber}</span>
            </button>

            <button
              type="button"
              className={`pm-tab-btn ${activeTab === 'fullstack' ? 'active' : ''}`}
              onClick={() => setActiveTab('fullstack')}
            >
              <Code size={14} className="pm-tab-icon text-purple-600" />
              <span>💻 Full-stack</span>
              <span className="pm-tab-count">{domainCounts.fullstack}</span>
            </button>

            <button
              type="button"
              className={`pm-tab-btn ${activeTab === 'others' ? 'active' : ''}`}
              onClick={() => setActiveTab('others')}
            >
              <Layers size={14} className="pm-tab-icon text-amber-600" />
              <span>✨ Others / Custom</span>
              <span className="pm-tab-count">{domainCounts.others}</span>
            </button>
          </div>

          {/* Mentors Grid Cards */}
          <div className="peerpath-mentors-grid">
            {displayedMentors.map((mentor) => {
              const matchScore = (mentor as any).matchScore || 92;
              const isFollowing = isFollowingMentor(mentor.id);
              return (
                <div key={mentor.id} className="pm-mentor-card">
                  
                  {/* Row 1: Top Status & Verification Badges */}
                  <div className="pm-card-top-badges">
                    <div className="pm-badge-left">
                      <span className="pm-verified-employer-pill">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>Verified @ {mentor.company.split(' ')[0]}</span>
                      </span>
                      <span className="pm-domain-chip">
                        {mentor.domain}
                      </span>
                    </div>
                    <span className="pm-match-score-tag">
                      <Zap size={11} fill="#7C3AED" color="#7C3AED" /> {matchScore}% Match
                    </span>
                  </div>

                  {/* Row 2: Profile & Current Role Info */}
                  <div className="pm-profile-row">
                    <div className="pm-avatar-container">
                      <img src={mentor.avatar} alt={mentor.name} className="pm-avatar-img" />
                      <span className="pm-online-dot" title="Available for 1:1 Booking"></span>
                    </div>

                    <div className="pm-profile-meta">
                      {/* Name & Social Signals Line (Rating + Followers + Follow Action) */}
                      <div className="pm-name-line">
                        <strong className="pm-mentor-name">{mentor.name}</strong>

                        <div className="pm-social-badges-group">
                          {/* Rating Badge */}
                          <div className="pm-rating-badge" title={`${mentor.rating} rating (${mentor.reviewsCount} reviews)`}>
                            <Star size={10.5} fill="#F59E0B" color="#F59E0B" />
                            <span>{mentor.rating} ({mentor.reviewsCount})</span>
                          </div>

                          {/* Followers Badge */}
                          <div className="pm-followers-badge" title={`${mentor.followersCount} followers`}>
                            <Users size={10.5} className="text-blue-600" />
                            <span>{mentor.followersCount}</span>
                          </div>

                          {/* Follow Button */}
                          <button
                            type="button"
                            className={`pm-follow-pill-btn ${isFollowing ? 'following' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollowMentor(mentor.id, mentor.name);
                            }}
                            title={isFollowing ? 'Following mentor' : 'Follow mentor'}
                          >
                            {isFollowing ? (
                              <>
                                <Check size={9.5} strokeWidth={3} />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <Plus size={9.5} strokeWidth={3} />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pm-role-company-line">
                        <span className="pm-current-role">{mentor.role}</span>
                        <span className="pm-at-company">@ {mentor.company}</span>
                        <span className="pm-exp-pill">• {mentor.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: High-Credibility Transition Pathway Box */}
                  <div className="pm-trajectory-box">
                    <div className="pm-trajectory-header">
                      <div className="pm-trajectory-title">
                        <TrendingUp size={11} className="text-emerald-600" />
                        <span>TRANSITION PATH</span>
                        {mentor.jumpTag && (
                          <span className="pm-trajectory-tag">{mentor.jumpTag}</span>
                        )}
                      </div>
                      <div className="pm-growth-pill">
                        <span className="pm-growth-val">{mentor.growthPercent}</span>
                        <span className="pm-growth-mult">({mentor.jumpMultiplier})</span>
                      </div>
                    </div>

                    <div className="pm-trajectory-stepper">
                      <div className="pm-step-node from">
                        <span className="pm-node-tag">STARTED AT</span>
                        <strong className="pm-node-role">{mentor.baselineRole}</strong>
                        <span className="pm-node-company">{mentor.baselineCompany}</span>
                      </div>

                      <div className="pm-stepper-divider">
                        <div className="pm-stepper-arrow-circle">
                          <ArrowRight size={10} strokeWidth={2.5} />
                        </div>
                      </div>

                      <div className="pm-step-node to">
                        <span className="pm-node-tag leap">CAREER LEAP</span>
                        <strong className="pm-node-role">{mentor.leapRole}</strong>
                        <span className="pm-node-company">@{mentor.leapCompany}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Skills Pills */}
                  <div className="pm-skills-tags-row">
                    {mentor.skills.slice(0, 4).map((skill, sIdx) => (
                      <span key={sIdx} className="pm-skill-tag">
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 4 && (
                      <span className="pm-skill-more">+{mentor.skills.length - 4} more</span>
                    )}
                  </div>

                  {/* Row 5: 2 Clear CTA Buttons (Profile & Book Session) */}
                  <div className="pm-card-actions-row">
                    <button
                      type="button"
                      className="btn-pm-profile-view"
                      onClick={() => handleViewMentorProfile(mentor.id)}
                      title="View mentor profile & full trajectory"
                    >
                      <User size={13} />
                      <span>View Profile</span>
                    </button>

                    <button
                      type="button"
                      className="btn-pm-book-session"
                      onClick={() => handleBook1on1(mentor)}
                      title="Book 1:1 Mentorship Session"
                    >
                      <Video size={13} />
                      <span>Book 1:1 Session</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* 3. Special Transition Campaigns & 1-Time Live Sprints Section */}
        <div className="bootcamp-bridge-container" id="bootcampBridgeSection">
          <div className="bootcamp-bridge-header">
            <div className="bbh-tag-row">
              <span className="bbh-tag-pill">🚀 SPECIAL TRANSITION SPRINTS</span>
              <span className="bbh-sub-tag">1-Time Free Live Interactive Sprints • Max 100 Seats</span>
            </div>
            <h2 className="bbh-title">Join a 1-Time Live Career Transition Sprint</h2>
            <p className="bbh-desc">
              Experience a high-impact, 1-time live transition sprint curated with verified Tier-1 mentors. Get immediate interview blueprints, real-world system design teardowns, and referral fast-tracks. <strong>(Strictly 1 free sprint claim per candidate).</strong>
            </p>
          </div>

          <div className="bootcamp-grid">
            {bootcamps.map((bootcamp) => {
              const isRegistered = registeredBootcampIds.includes(bootcamp.id);
              const hasUsedFreeSprintOnOther = registeredBootcampIds.length >= 1 && !isRegistered;
              const seatsRemaining = Math.max(0, bootcamp.maxCapacity - (bootcamp.registeredCount + (isRegistered ? 1 : 0)));

              return (
                <div key={bootcamp.id} className="bootcamp-card">
                  <div className="bc-top">
                    <div className="bc-mentor-chip">
                      <img src={bootcamp.mentorAvatar} alt={bootcamp.mentorName} className="bc-avatar" />
                      <div>
                        <strong className="bc-name">{bootcamp.mentorName}</strong>
                        <span className="bc-role">{bootcamp.mentorRole} @ {bootcamp.mentorCompany} {bootcamp.mentorExCompany && `(${bootcamp.mentorExCompany})`}</span>
                      </div>
                    </div>
                    <span className="bc-free-tag">1-Time Free Pass</span>
                  </div>

                  <h3 className="bc-title">{bootcamp.title}</h3>

                  <div className="bc-schedule-row">
                    <span className="bc-sched-item"><Calendar size={13} /> {bootcamp.date}</span>
                    <span className="bc-sched-item"><Clock size={13} /> {bootcamp.time}</span>
                    <span className="bc-sched-item bc-sched-dur"><Sparkles size={13} /> {bootcamp.duration}</span>
                  </div>

                  <div className="bc-topics-box">
                    <span className="bc-section-lbl">Sprint Milestones & Agenda:</span>
                    <ul className="bc-topics-list">
                      {bootcamp.topics.map((t, i) => (
                        <li key={i}><CheckCircle2 size={12} className="text-purple-600 flex-shrink-0" /> <span>{t}</span></li>
                      ))}
                    </ul>
                  </div>

                  <div className="bc-takeaways-box">
                    <span className="bc-section-lbl">Sprint Toolkits Included:</span>
                    <div className="bc-takeaways-chips">
                      {bootcamp.takeaways.map((tw, i) => (
                        <span key={i} className="bc-takeaway-chip">🎁 {tw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bc-footer">
                    <div className="bc-seats-info">
                      <div className="bc-seats-header-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="bc-seats-count">
                          <strong>{bootcamp.registeredCount + (isRegistered ? 1 : 0)}</strong> / {bootcamp.maxCapacity} seats filled
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626' }}>
                          🔥 Only {seatsRemaining} seats left!
                        </span>
                      </div>

                      <div className="bc-progress-bar">
                        <div 
                          className="bc-progress-fill" 
                          style={{ width: `${Math.min(100, Math.round(((bootcamp.registeredCount + (isRegistered ? 1 : 0)) / bootcamp.maxCapacity) * 100))}%` }} 
                        />
                      </div>
                      <span className="bc-slots-note">🔒 1-Time Lifetime Benefit: 1 Free Sprint per Verified Candidate</span>
                    </div>

                    <button
                      type="button"
                      className={`btn-bootcamp-reg ${isRegistered ? 'registered' : ''} ${hasUsedFreeSprintOnOther ? 'disabled-limit' : ''}`}
                      onClick={() => registerForBootcamp(bootcamp.id)}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 size={15} className="text-emerald-600" />
                          <span>Sprint Pass Confirmed ✓</span>
                        </>
                      ) : hasUsedFreeSprintOnOther ? (
                        <span>1-Time Free Limit Claimed</span>
                      ) : (
                        <>
                          <span>Claim Free Sprint Pass (1-Time)</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
