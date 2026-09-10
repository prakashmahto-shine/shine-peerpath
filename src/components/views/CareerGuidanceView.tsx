import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, Sparkles, Video, User, Clock, MapPin, GraduationCap, 
  Zap, CheckCircle2, ThumbsUp, Check, ArrowRight, TrendingUp,
  Briefcase, Star, Building2, UserCheck, ChevronRight, ChevronDown, Award, Plus, LockOpen, Users,
  ShieldCheck, Loader2, BarChart2, Target, Lightbulb, IndianRupee, Wifi, Filter, Info, Cpu, Code, BookOpen,
  Calendar, RefreshCw, Layers, ExternalLink, UserPlus, Search, X, SlidersHorizontal
} from 'lucide-react';
import { ViewType, Expert } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateSalaryBenchmark } from '../../utils/salaryBenchmark';
import { peerpathApi } from '../../services/api';

export type MentorCategoryTab = 'top' | 'all' | 'ai' | 'semi' | 'cyber' | 'fullstack' | 'others';

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
    jumpMultiplier: '4.8x Growth',
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
    jumpTag: 'Architect Switch',
    growthPercent: '+300% Growth',
    jumpMultiplier: '4.0x Growth',
    jumpStory: 'Transitioned from standard scikit-learn into GPU-accelerated model serving and CUDA inference at NVIDIA.',
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
    jumpMultiplier: '5.5x Growth',
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
    jumpMultiplier: '4.5x Growth',
    jumpStory: 'Transitioned from backend microservices into high-scale real-time recommendation engines at Swiggy & Flipkart.',
    skills: ['Real-time RecSys', 'Feast Store', 'PyTorch', 'High-Scale APIs']
  },

  // 2. SEMICONDUCTOR
  {
    id: 'karthik',
    name: 'Karthik Nambiar',
    role: 'Lead Silicon Verification Architect',
    company: 'Qualcomm',
    domain: 'VLSI Design',
    category: 'semi',
    experience: '9+ Yrs Exp.',
    rating: 4.93,
    reviewsCount: 104,
    followersCount: '3.1k',
    sessionsCount: 210,
    price: 1099,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Wipro VLSI Practice',
    baselineRole: 'RTL Engineer',
    leapCompany: 'Qualcomm',
    leapRole: 'Lead Silicon Architect',
    jumpTag: 'Services ➔ Product',
    growthPercent: '+380% Growth',
    jumpMultiplier: '3.8x Growth',
    jumpStory: 'Transitioned from outsourced IP block verification into driving full-chip tapeouts for flagship Snapdragon 5G SoCs.',
    skills: ['UVM Verification', 'SystemVerilog', 'PCIe Gen5', 'Synthesis', 'Low Power Design']
  },
  {
    id: 'ananya',
    name: 'Ananya Deshmukh',
    role: 'Staff ASIC Design & Timing Lead',
    company: 'Texas Instruments',
    domain: 'VLSI Design',
    category: 'semi',
    experience: '8+ Yrs Exp.',
    rating: 4.91,
    reviewsCount: 78,
    followersCount: '2.1k',
    sessionsCount: 160,
    price: 999,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'TCS Semiconductor Hub',
    baselineRole: 'STA Trainee',
    leapCompany: 'Texas Instruments',
    leapRole: 'Staff ASIC Lead',
    jumpTag: 'Services ➔ Product',
    growthPercent: '+400% Growth',
    jumpMultiplier: '4.0x Growth',
    jumpStory: 'Navigated from legacy static timing analysis into sub-5nm analog/mixed-signal power optimization.',
    skills: ['Primetime STA', 'Cadence Innovus', 'Clock Tree Synthesis', '5nm FinFET']
  },
  {
    id: 'siddharth',
    name: 'Siddharth Rao',
    role: 'Principal Physical Design Lead',
    company: 'Intel',
    domain: 'VLSI Design',
    category: 'semi',
    experience: '11+ Yrs Exp.',
    rating: 4.96,
    reviewsCount: 142,
    followersCount: '4.8k',
    sessionsCount: 310,
    price: 1399,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'HCL Technologies',
    baselineRole: 'Layout Engineer',
    leapCompany: 'Intel',
    leapRole: 'Principal VLSI Lead',
    jumpTag: 'Services ➔ Product',
    growthPercent: '+460% Growth',
    jumpMultiplier: '4.6x Growth',
    jumpStory: 'Transitioned from standard cell layout drafting into leading top-level floorplanning and timing closure for Intel Core microarchitectures.',
    skills: ['Top Floorplanning', 'DRC/LVS Clean', 'Power Integrity (RedHawk)', 'Synopsys ICC2']
  },

  // 3. CYBERSECURITY
  {
    id: 'vikram',
    name: 'Vikramaditya Roy',
    role: 'Lead Cloud Security & DevSecOps Architect',
    company: 'Palo Alto Networks',
    domain: 'Cybersecurity',
    category: 'cyber',
    experience: '8+ Yrs Exp.',
    rating: 4.94,
    reviewsCount: 98,
    followersCount: '2.9k',
    sessionsCount: 220,
    price: 1299,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Infosys SOC',
    baselineRole: 'L1 SOC Analyst',
    leapCompany: 'Palo Alto Networks',
    leapRole: 'Lead CloudSec Architect',
    jumpTag: 'SOC ➔ Cloud Architect',
    growthPercent: '+530% Growth',
    jumpMultiplier: '5.3x Growth',
    jumpStory: 'Graduated from tier-1 alert monitoring shifts into automated cloud threat prevention and zero-trust Kubernetes architectures.',
    skills: ['Prisma Cloud', 'Kubernetes Security', 'AWS IAM Hardening', 'Zero Trust', 'Terraform Sec']
  },
  {
    id: 'meera',
    name: 'Meera Nambisan',
    role: 'Staff Threat Hunter & Incident Lead',
    company: 'CrowdStrike',
    domain: 'Cybersecurity',
    category: 'cyber',
    experience: '7+ Yrs Exp.',
    rating: 4.92,
    reviewsCount: 86,
    followersCount: '2.3k',
    sessionsCount: 175,
    price: 1099,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Wipro Cyber Defense',
    baselineRole: 'SOC Analyst',
    leapCompany: 'CrowdStrike',
    leapRole: 'Staff Threat Hunter',
    jumpTag: 'Services ➔ Product',
    growthPercent: '+540% Growth',
    jumpMultiplier: '5.4x Growth',
    jumpStory: 'Shifted from manual log correlation into tracking advanced persistent threat (APT) campaigns and building behavioral detection models.',
    skills: ['Splunk Phantom', 'MITRE ATT&CK', 'EDR Forensics', 'Threat Hunting', 'Malware Analysis']
  },
  {
    id: 'rohit',
    name: 'Rohit Kulkarni',
    role: 'Principal Application Security Lead',
    company: 'Microsoft',
    domain: 'Cybersecurity',
    category: 'cyber',
    experience: '10+ Yrs Exp.',
    rating: 4.97,
    reviewsCount: 156,
    followersCount: '4.6k',
    sessionsCount: 340,
    price: 1499,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    isVerifiedEmployer: true,
    baselineCompany: 'Tech Mahindra',
    baselineRole: 'QA Automation',
    leapCompany: 'Microsoft',
    leapRole: 'Principal AppSec Lead',
    jumpTag: 'QA ➔ AppSec Lead',
    growthPercent: '+640% Growth',
    jumpMultiplier: '6.4x Growth',
    jumpStory: 'Transitioned from running static scanner reports into discovering zero-days and leading red team exercises for Azure.',
    skills: ['Red Teaming', 'Threat Modeling', 'SAST/DAST Triage', 'Cryptographic Protocols', 'Zero-Day Exploit']
  },

  // 4. FULL-STACK & SYSTEM ARCHITECTURE
  {
    id: 'akash',
    name: 'Akash Jain',
    role: 'Staff UI Platform Architect',
    company: 'Razorpay',
    domain: 'Full-stack',
    category: 'fullstack',
    experience: '8+ Yrs Exp.',
    rating: 4.98,
    reviewsCount: 210,
    followersCount: '5.4k',
    sessionsCount: 420,
    price: 999,
    avatar: '/avatars/akash.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'TCS Digital',
    baselineRole: 'Angular Dev',
    leapCompany: 'Razorpay',
    leapRole: 'Staff UI Architect',
    jumpTag: 'Services ➔ Product',
    growthPercent: '+410% Growth',
    jumpMultiplier: '4.1x Growth',
    jumpStory: 'Shifted from monolithic Angular enterprise portals into designing micro-frontend payment checkouts processing $80B+ TPV.',
    skills: ['Micro-Frontends', 'React 19', 'Design Systems', 'Web Vitals', 'System Design']
  },
  {
    id: 'rahul',
    name: 'Rahul Sharma',
    role: 'Staff Engineering Manager (L6)',
    company: 'Google',
    domain: 'Full-stack',
    category: 'fullstack',
    experience: '12+ Yrs Exp.',
    rating: 4.95,
    reviewsCount: 180,
    followersCount: '6.2k',
    sessionsCount: 380,
    price: 1499,
    avatar: '/avatars/rahul.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Infosys',
    baselineRole: 'Java Developer',
    leapCompany: 'Google',
    leapRole: 'Staff EM (L6)',
    jumpTag: 'Services ➔ Tier-1 Tech',
    growthPercent: '+400% Growth',
    jumpMultiplier: '4.0x Growth',
    jumpStory: 'Transformed traditional backend skillset into leading large-scale distributed cloud systems at Google.',
    skills: ['System Design', 'Distributed Systems', 'Go / Java', 'Engineering Management']
  },
  {
    id: 'nisha',
    name: 'Nisha Singhania',
    role: 'Staff UI Architect & Frontend Lead',
    company: 'Flipkart',
    domain: 'Full-stack',
    category: 'fullstack',
    experience: '8+ Yrs Exp.',
    rating: 4.96,
    reviewsCount: 175,
    followersCount: '4.1k',
    sessionsCount: 310,
    price: 899,
    avatar: '/avatars/nisha.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Capgemini',
    baselineRole: 'Frontend Dev',
    leapCompany: 'Flipkart',
    leapRole: 'Staff UI Architect',
    jumpTag: 'Services ➔ Tier-1',
    growthPercent: '+450% Growth',
    jumpMultiplier: '4.5x Growth',
    jumpStory: 'Graduated from outsourced enterprise UI maintenance to leading high-concurrency Big Billion Day checkout experiences.',
    skills: ['React 19', 'Performance Tuning', 'Design Systems', 'Next.js']
  },

  // 5. OTHERS (Product Management, SRE, Tech Sales)
  {
    id: 'saheli',
    name: 'Saheli Chatterjee',
    role: 'Lead Product Manager & Growth Strategist',
    company: 'Shine (HT Media)',
    domain: 'Product Management',
    category: 'others',
    experience: '7+ Yrs Exp.',
    rating: 4.92,
    reviewsCount: 145,
    followersCount: '3.8k',
    sessionsCount: 320,
    price: 999,
    avatar: '/avatars/saheli.jpg',
    isVerifiedEmployer: true,
    baselineCompany: 'Accenture Strategy',
    baselineRole: 'Business Consultant',
    leapCompany: 'Shine (HT Media)',
    leapRole: 'Lead Product Manager',
    jumpTag: 'Consulting ➔ Tech PM',
    growthPercent: '+320% Growth',
    jumpMultiplier: '3.2x Growth',
    jumpStory: 'Transitioned from management deck presentations into shipping AI-driven matching algorithms for 3.5M+ active users.',
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
    jumpMultiplier: '4.3x Growth',
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
    jumpMultiplier: '4.5x Growth',
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
    jumpMultiplier: '9.0x Growth',
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
    jumpMultiplier: '6.2x Growth',
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'experience' | 'price'>('match');
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
  const { scoredAllMentors, topRecommendedMentors, domainCounts } = useMemo(() => {
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
      all: scoredMentors.length,
      ai: scoredMentors.filter(m => m.category === 'ai').length,
      semi: scoredMentors.filter(m => m.category === 'semi').length,
      cyber: scoredMentors.filter(m => m.category === 'cyber').length,
      fullstack: scoredMentors.filter(m => m.category === 'fullstack').length,
      others: scoredMentors.filter(m => m.category === 'others').length
    };

    return {
      scoredAllMentors: sorted,
      topRecommendedMentors: top5,
      domainCounts: counts
    };
  }, [userTargetRole, userDreamCompany]);

  // Displayed mentors with search, category tab, company filter, and sorting
  const displayedMentors = useMemo(() => {
    let list: (TransitionMentor & { matchScore?: number })[] = [];

    if (activeTab === 'top') {
      list = [...topRecommendedMentors];
    } else if (activeTab === 'all') {
      list = [...scoredAllMentors];
    } else {
      list = scoredAllMentors.filter(m => m.category === activeTab);
    }

    // Company filter
    if (selectedCompany !== 'all') {
      list = list.filter(m => 
        m.company.toLowerCase().includes(selectedCompany.toLowerCase()) ||
        m.leapCompany.toLowerCase().includes(selectedCompany.toLowerCase())
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q)) ||
        m.jumpStory.toLowerCase().includes(q)
      );
    }

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'experience') {
        const expA = parseFloat(a.experience) || 0;
        const expB = parseFloat(b.experience) || 0;
        return expB - expA;
      }
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });
  }, [activeTab, topRecommendedMentors, scoredAllMentors, selectedCompany, searchQuery, sortBy]);

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
      teaserTitle: `Teaser: 1:1 Career Switch into ${mentor.role} @ ${mentor.company}`,
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
            {/* Ecosystem Trust Badge (Zomato/Blinkit Trust model) */}
            <div className="peerpath-ecosystem-trust-badge">
              <span className="petb-dot"></span>
              <span><strong>Peerpath by shine.com</strong> • India's 1st Verified 1:1 Tech Transition Platform • Backed by 3.5Cr+ Recruiter Network</span>
            </div>

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
                  <span className="phb-stat-label">Career Switch</span>
                  <strong className="phb-stat-val val-green">Services ➔ Product</strong>
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
              <h2 className="pms-heading">Verified Mentors for Your Career Transition</h2>
              <p className="pms-subheading">
                Connect 1:1 with industry leaders from Swiggy, Qualcomm, Razorpay, NVIDIA, Google, and Microsoft who made the exact career jump.
              </p>
            </div>
          </div>

          {/* MODERN DOMAIN EXPLORER & DISCOVERY CONTROLS */}
          <div className="peerpath-domain-explorer-wrap">
            
            {/* 1. Primary Category Segmented Tab Bar */}
            <div className="peerpath-domain-tabs-nav">
              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'top' ? 'active' : ''}`}
                onClick={() => setActiveTab('top')}
              >
                <Sparkles size={15} className="pm-dtab-ico text-amber-500" />
                <span className="pm-dtab-title">Top Recommended</span>
                <span className="pm-dtab-count">{domainCounts.top}</span>
              </button>

              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                <Cpu size={15} className="pm-dtab-ico text-purple-600" />
                <span className="pm-dtab-title">AI & Data Science</span>
                <span className="pm-dtab-count">{domainCounts.ai}</span>
              </button>

              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'semi' ? 'active' : ''}`}
                onClick={() => setActiveTab('semi')}
              >
                <Zap size={15} className="pm-dtab-ico text-amber-600" />
                <span className="pm-dtab-title">Semiconductor & VLSI</span>
                <span className="pm-dtab-count">{domainCounts.semi}</span>
              </button>

              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'cyber' ? 'active' : ''}`}
                onClick={() => setActiveTab('cyber')}
              >
                <ShieldCheck size={15} className="pm-dtab-ico text-blue-600" />
                <span className="pm-dtab-title">Cybersecurity & Cloud</span>
                <span className="pm-dtab-count">{domainCounts.cyber}</span>
              </button>

              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'fullstack' ? 'active' : ''}`}
                onClick={() => setActiveTab('fullstack')}
              >
                <Code size={15} className="pm-dtab-ico text-emerald-600" />
                <span className="pm-dtab-title">Full-Stack & Systems</span>
                <span className="pm-dtab-count">{domainCounts.fullstack}</span>
              </button>

              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'others' ? 'active' : ''}`}
                onClick={() => setActiveTab('others')}
              >
                <Compass size={15} className="pm-dtab-ico text-indigo-600" />
                <span className="pm-dtab-title">Product & Leadership</span>
                <span className="pm-dtab-count">{domainCounts.others}</span>
              </button>

              <button
                type="button"
                className={`pm-domain-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <Layers size={15} className="pm-dtab-ico text-slate-600" />
                <span className="pm-dtab-title">All Mentors</span>
                <span className="pm-dtab-count">{domainCounts.all}</span>
              </button>
            </div>

            {/* 2. Search, Company Filter Chips & Sort Controls Toolbar */}
            <div className="peerpath-filter-toolbar">
              <div className="pm-filter-left-controls">
                
                {/* Live Search Input */}
                <div className="pm-search-box-wrap">
                  <Search size={15} className="pm-search-ico" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by mentor name, skill (PyTorch, VLSI, React) or company..."
                    className="pm-search-text-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="pm-search-clear-action"
                      onClick={() => setSearchQuery('')}
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Company Filter Chips */}
                <div className="pm-company-chips-scroll">
                  <span className="pm-company-label">
                    <Building2 size={13} /> Target Companies:
                  </span>
                  {['all', 'Swiggy', 'Qualcomm', 'Razorpay', 'NVIDIA', 'Google', 'Flipkart', 'Zepto'].map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      className={`pm-company-chip ${selectedCompany === comp ? 'active' : ''}`}
                      onClick={() => setSelectedCompany(comp)}
                    >
                      {comp === 'all' ? 'All Companies' : comp}
                    </button>
                  ))}
                </div>

              </div>

              {/* Sort Selector Dropdown */}
              <div className="pm-filter-right-controls">
                <div className="pm-sort-dropdown-wrap">
                  <SlidersHorizontal size={13} className="pm-sort-ico" />
                  <span className="pm-sort-title">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pm-sort-native-select"
                  >
                    <option value="match">⚡ Highest Match %</option>
                    <option value="rating">⭐ Top Rated (4.9+)</option>
                    <option value="experience">💼 Years of Exp</option>
                    <option value="price">💸 Fee: Low to High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Results Summary & Active Filters Pill Bar */}
            <div className="peerpath-results-status-bar">
              <div className="pm-status-left">
                <span className="pm-results-badge">
                  Showing <strong>{displayedMentors.length}</strong> verified mentor{displayedMentors.length !== 1 ? 's' : ''}
                </span>
                {(searchQuery || selectedCompany !== 'all' || activeTab !== 'top') && (
                  <div className="pm-active-filters-list">
                    {activeTab !== 'top' && (
                      <span className="pm-active-tag">
                        Domain: {activeTab === 'all' ? 'All' : activeTab.toUpperCase()}
                      </span>
                    )}
                    {selectedCompany !== 'all' && (
                      <span className="pm-active-tag">
                        Company: {selectedCompany}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="pm-active-tag">
                        Query: "{searchQuery}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {(searchQuery || selectedCompany !== 'all' || activeTab !== 'top') && (
                <button
                  type="button"
                  className="pm-btn-reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCompany('all');
                    setActiveTab('top');
                    setSortBy('match');
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

          </div>

          {/* Mentors Horizontal List or Empty State */}
          {displayedMentors.length === 0 ? (
            <div className="peerpath-mentors-empty-state">
              <div className="pm-empty-icon-wrap">
                <Search size={28} className="text-indigo-600" />
              </div>
              <h3>No verified mentors match your current filter</h3>
              <p>Try searching for different skills (e.g. PyTorch, VLSI, React) or reset your active company and domain filters.</p>
              <button
                type="button"
                className="btn-pm-empty-reset"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCompany('all');
                  setActiveTab('top');
                  setSortBy('match');
                }}
              >
                <RefreshCw size={14} />
                <span>View All Top Recommended Mentors</span>
              </button>
            </div>
          ) : (
            <div className="peerpath-mentors-grid">
              {displayedMentors.map((mentor) => {
                const matchScore = (mentor as any).matchScore || 95;
                return (
                  <div key={mentor.id} className="pm-mentor-card-h">
                  
                  {/* Left Column: Avatar + Identity + Rating + Skills */}
                  <div className="pm-h-col-left">
                    <div className="pm-avatar-container">
                      <img src={mentor.avatar} alt={mentor.name} className="pm-avatar-img" />
                      <span className="pm-online-dot" title="Available for 1:1 Sessions"></span>
                    </div>

                    <div className="pm-h-profile-details">
                      <div className="pm-h-name-row">
                        <h4 className="pm-mentor-name">{mentor.name}</h4>
                        <span className="pm-match-badge">
                          <Zap size={10} fill="currentColor" /> {matchScore}% Match
                        </span>
                      </div>

                      <p className="pm-role-company">
                        <span className="pm-role-name">{mentor.role}</span>
                        <span className="pm-company-name">@{mentor.company}</span>
                      </p>

                      <div className="pm-meta-row">
                        <span className="pm-rating-text">
                          <Star size={10.5} fill="#F59E0B" color="#F59E0B" />
                          <strong>{mentor.rating}</strong> ({mentor.reviewsCount})
                        </span>
                        <span className="pm-meta-sep">•</span>
                        <span className="pm-exp-text">{mentor.experience}</span>
                        <span className="pm-meta-sep">•</span>
                        <span className="pm-verified-text">
                          <CheckCircle2 size={10.5} className="text-emerald-600" />
                          Verified
                        </span>
                      </div>

                      {/* Skills Chips */}
                      <div className="pm-skills-row mt-1">
                        {mentor.skills.slice(0, 3).map((skill, sIdx) => (
                          <span key={sIdx} className="pm-skill-chip">{skill}</span>
                        ))}
                        {mentor.skills.length > 3 && (
                          <span className="pm-skill-chip-more">+{mentor.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Career Transition Box */}
                  <div className="pm-h-col-center">
                    <div className="pm-h-transition-card">
                      <div className="pm-h-transition-header">
                        <span className="pm-h-trans-title">
                          <TrendingUp size={11} className="text-emerald-600" />
                          CAREER TRANSITION JOURNEY
                        </span>
                        <span className="pm-leap-pill">{mentor.growthPercent} ({mentor.jumpMultiplier})</span>
                      </div>

                      <div className="pm-h-stepper-row">
                        <div className="pm-h-node from">
                          <span className="pm-h-node-label">Started At</span>
                          <strong className="pm-h-node-val">{mentor.baselineRole}</strong>
                          <span className="pm-h-node-sub">{mentor.baselineCompany.split(' ')[0]}</span>
                        </div>

                        <div className="pm-h-node-arrow">
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </div>

                        <div className="pm-h-node to">
                          <span className="pm-h-node-label leap">Switched To</span>
                          <strong className="pm-h-node-val">{mentor.leapRole}</strong>
                          <span className="pm-h-node-sub">@{mentor.leapCompany}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Quick Actions */}
                  <div className="pm-h-col-right">
                    <div className="pm-h-price-wrap">
                      <span className="pm-h-price-num">₹{mentor.price || 899}</span>
                      <span className="pm-h-price-lbl">/ 60-min service</span>
                    </div>

                    <div className="pm-h-actions-group">
                      <button
                        type="button"
                        className="btn-pm-book-session"
                        onClick={() => handleBook1on1(mentor)}
                        title="Book 1:1 Mentorship Session"
                      >
                        <Calendar size={12} />
                        <span>Book 1:1 Session</span>
                        <ArrowRight size={12} />
                      </button>

                      <button
                        type="button"
                        className="btn-pm-profile-view"
                        onClick={() => handleViewMentorProfile(mentor.id)}
                        title="View mentor profile & full trajectory"
                      >
                        <User size={12} />
                        <span>View Profile</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
          )}

        </div>

      </div>
    </div>
  );
};
