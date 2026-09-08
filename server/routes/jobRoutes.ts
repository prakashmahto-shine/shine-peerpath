import { Router, Request, Response } from 'express';

export interface BackendJob {
  id: string;
  title: string;
  company: string;
  companyInitials?: string;
  companyColor?: string;
  postedTime: string;
  exp: string;
  salary: string;
  salaryNum?: number; // in LPA for filtering
  loc: string;
  domain: string;
  requiredSkills: string[];
  isActivelyHiring?: boolean;
  isEarlyApplicant?: boolean;
  description?: string;
}

const JOBS_DB: BackendJob[] = [
  {
    id: 'srp-job-1',
    title: 'Senior React / Java Developer',
    company: 'IQuest Management Consultants Pvt Ltd.',
    companyInitials: 'IM',
    companyColor: '#C026D3',
    postedTime: '3 days ago',
    exp: '5 to 10 Yrs',
    salary: '₹14 – ₹22 Lakh/Yr',
    salaryNum: 22,
    loc: 'Pune',
    domain: 'Full-Stack',
    requiredSkills: ['react.js', 'java', 'sql', 'typescript'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-2',
    title: 'AWS Java Full Stack Developer',
    company: 'SP Staffing Services Private Limited Hiring For Leading MNC Company',
    companyInitials: 'SS',
    companyColor: '#7C3AED',
    postedTime: '4 days ago',
    exp: '8 to 12 Yrs',
    salary: '₹26 – ₹38 Lakh/Yr',
    salaryNum: 38,
    loc: 'Bengaluru, Hyderabad, Pune',
    domain: 'Full-Stack',
    requiredSkills: ['java', 'spring boot', 'aws', 'micro-frontends'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-3',
    title: 'Lead UI & Micro-Frontend Architect',
    company: 'Swiggy Tech Labs',
    companyInitials: 'SW',
    companyColor: '#FC8019',
    postedTime: '1 day ago',
    exp: '4 to 8 Yrs',
    salary: '₹26 – ₹36 Lakh/Yr',
    salaryNum: 36,
    loc: 'Bengaluru / Hybrid',
    domain: 'Full-Stack',
    requiredSkills: ['react.js', 'micro-frontends', 'module federation', 'typescript', 'core web vitals'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-4',
    title: 'Staff UI Platform Architect',
    company: 'Razorpay Fintech Technologies',
    companyInitials: 'RZ',
    companyColor: '#0C2340',
    postedTime: '18 hours ago',
    exp: '5 to 9 Yrs',
    salary: '₹28 – ₹38 Lakh/Yr',
    salaryNum: 38,
    loc: 'Remote / Bengaluru',
    domain: 'Full-Stack',
    requiredSkills: ['react.js', 'component architecture', 'micro-frontends', 'typescript'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-5',
    title: 'Lead Technical Product Manager',
    company: 'Shine (HT Media Group)',
    companyInitials: 'SH',
    companyColor: '#1E3A8A',
    postedTime: '2 days ago',
    exp: '5 to 9 Yrs',
    salary: '₹28 – ₹38 Lakh/Yr',
    salaryNum: 38,
    loc: 'Gurugram / Hybrid',
    domain: 'Product Management',
    requiredSkills: ['prd discovery', 'product metrics', 'tech scoping', 'growth funnels', 'gtm strategy'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-6',
    title: 'Senior Product Manager - Growth & Monetization',
    company: 'Flipkart Internet Pvt Ltd',
    companyInitials: 'FK',
    companyColor: '#2874F0',
    postedTime: '3 days ago',
    exp: '4 to 8 Yrs',
    salary: '₹30 – ₹42 Lakh/Yr',
    salaryNum: 42,
    loc: 'Bengaluru',
    domain: 'Product Management',
    requiredSkills: ['product analytics', 'a/b testing', 'prd discovery', 'pricing strategies'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-7',
    title: 'Principal Search & Solr Database Cloud Architect',
    company: 'Adobe Systems India',
    companyInitials: 'AD',
    companyColor: '#E11D48',
    postedTime: '2 days ago',
    exp: '7 to 12 Yrs',
    salary: '₹38 – ₹48 Lakh/Yr',
    salaryNum: 48,
    loc: 'Noida / Remote',
    domain: 'Search & Data Infra',
    requiredSkills: ['apache solr', 'lucene engine', 'sub-10ms query optimization', 'inverted indexing'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-8',
    title: 'Staff Search Infrastructure Engineer',
    company: 'Uber Technologies India',
    companyInitials: 'UB',
    companyColor: '#000000',
    postedTime: '1 day ago',
    exp: '6 to 10 Yrs',
    salary: '₹35 – ₹46 Lakh/Yr',
    salaryNum: 46,
    loc: 'Bengaluru / Hyderabad',
    domain: 'Search & Data Infra',
    requiredSkills: ['elasticsearch', 'distributed systems', 'sharding', 'apache solr'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-9',
    title: 'Production GenAI & LLM Systems Engineer',
    company: 'Swiggy AI Core Lab',
    companyInitials: 'SW',
    companyColor: '#FC8019',
    postedTime: '1 day ago',
    exp: '3 to 7 Yrs',
    salary: '₹30 – ₹45 Lakh/Yr',
    salaryNum: 45,
    loc: 'Bengaluru',
    domain: 'AI/ML',
    requiredSkills: ['langchain', 'vector embeddings', 'rag pipelines', 'python', 'vllm'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-10',
    title: 'Lead AI Engineer - Enterprise RAG & Agents',
    company: 'Postman Labs',
    companyInitials: 'PM',
    companyColor: '#FF6C37',
    postedTime: '2 days ago',
    exp: '4 to 8 Yrs',
    salary: '₹32 – ₹46 Lakh/Yr',
    salaryNum: 46,
    loc: 'Bengaluru / Remote',
    domain: 'AI/ML',
    requiredSkills: ['pinecone', 'langgraph', 'model fine-tuning', 'python'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-11',
    title: 'Staff Silicon Verification & RTL Architect',
    company: 'Qualcomm India Pvt Ltd',
    companyInitials: 'QC',
    companyColor: '#002B49',
    postedTime: '3 days ago',
    exp: '5 to 11 Yrs',
    salary: '₹32 – ₹42 Lakh/Yr',
    salaryNum: 42,
    loc: 'Bengaluru / Hyderabad',
    domain: 'Semiconductor',
    requiredSkills: ['systemverilog', 'uvm architecture', 'pcie/cxl', 'rtl design'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  },
  {
    id: 'srp-job-12',
    title: 'Lead ASIC Physical Design Engineer',
    company: 'Tata Electronics (Semiconductor Fab)',
    companyInitials: 'TE',
    companyColor: '#00539B',
    postedTime: '4 days ago',
    exp: '4 to 9 Yrs',
    salary: '₹28 – ₹40 Lakh/Yr',
    salaryNum: 40,
    loc: 'Bengaluru / Dholera',
    domain: 'Semiconductor',
    requiredSkills: ['static timing analysis', 'synopsys icc2', 'floorplanning', 'systemverilog'],
    isActivelyHiring: true,
    isEarlyApplicant: true
  }
];

const router = Router();

// GET /api/jobs - List and filter verified jobs
router.get('/', (req: Request, res: Response) => {
  try {
    const { domain, q, loc, minSalary, trackKey } = req.query;
    let list = [...JOBS_DB];

    if (domain && domain !== 'all') {
      const d = String(domain).toLowerCase();
      list = list.filter(j => j.domain.toLowerCase().includes(d) || d.includes(j.domain.toLowerCase()));
    }

    if (trackKey) {
      const tk = String(trackKey).toLowerCase();
      if (tk === 'arch') list = list.filter(j => j.domain === 'Full-Stack');
      else if (tk === 'pm') list = list.filter(j => j.domain === 'Product Management');
      else if (tk === 'search') list = list.filter(j => j.domain === 'Search & Data Infra');
      else if (tk === 'ai') list = list.filter(j => j.domain === 'AI/ML');
      else if (tk === 'semi') list = list.filter(j => j.domain === 'Semiconductor');
    }

    if (loc && loc !== 'all') {
      const l = String(loc).toLowerCase();
      list = list.filter(j => j.loc.toLowerCase().includes(l));
    }

    if (q) {
      const query = String(q).toLowerCase();
      list = list.filter(j => 
        j.title.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(query)) ||
        j.loc.toLowerCase().includes(query)
      );
    }

    if (minSalary) {
      const min = Number(minSalary);
      if (!isNaN(min)) {
        list = list.filter(j => (j.salaryNum || 0) >= min);
      }
    }

    return res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching jobs' });
  }
});

// GET /api/jobs/:id - Single job by ID
router.get('/:id', (req: Request, res: Response) => {
  const job = JOBS_DB.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: `Job with ID ${req.params.id} not found` });
  }
  return res.json({ success: true, data: job });
});

export default router;
