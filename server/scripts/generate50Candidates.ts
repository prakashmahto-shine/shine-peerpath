import fs from 'fs';
import path from 'path';
import { Creator, CandidateProfile, PeerVerifiedBadge } from '../types';
import { SEED_CREATORS } from '../data/seedData';

// Top 10 Curated Mentors
const TEN_MENTORS: Creator[] = SEED_CREATORS.slice(0, 10);

const FIRST_NAMES_M = [
  'Prakash', 'Sunil', 'Rohan', 'Amit', 'Kunal', 'Rahul', 'Sandeep', 'Varun', 'Harish',
  'Arjun', 'Mohit', 'Abhinav', 'Gaurav', 'Prateek', 'Tarun', 'Vivek',
  'Chetan', 'Deepesh', 'Arvind', 'Rajesh', 'Vinay', 'Nikhil',
  'Farhan', 'Jaspreet', 'Alok', 'Manish', 'Deepak', 'Hemant', 'Karthik', 'Sanjay'
];

const FIRST_NAMES_F = [
  'Aditi', 'Sneha', 'Divya', 'Neha', 'Pooja', 'Tanvi', 'Ananya', 'Bhavna',
  'Ritu', 'Shreya', 'Nidhi', 'Kavita', 'Simran', 'Pallavi', 'Ankita',
  'Manisha', 'Swati', 'Jyoti', 'Shalini',
  'Kriti', 'Sonal', 'Radhika', 'Preeti', 'Priyanka'
];

const LAST_NAMES = [
  'Mahto', 'Kumar', 'Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Nair',
  'Iyer', 'Joshi', 'Singh', 'Chopra', 'Malhotra', 'Bose', 'Mukherjee',
  'Deshmukh', 'Kulkarni', 'Mehta', 'Rao', 'Pandey', 'Saxena', 'Bhatia'
];

const LOCATIONS = [
  'Bengaluru, India',
  'Hyderabad, India',
  'Pune, India',
  'Noida / Delhi NCR, India',
  'Gurugram, India',
  'Chennai, India',
  'Remote, India'
];

const SERVICE_COMPANIES = [
  'TCS (Tata Consultancy Services)',
  'Infosys Digital',
  'Wipro Technologies',
  'Cognizant Technology Solutions',
  'HCLTech',
  'Accenture Solutions',
  'Mindtree / LTIMindtree',
  'Persistent Systems',
  'Capgemini India',
  'Tech Mahindra'
];

const COLLEGES = [
  'VTU Bengaluru',
  'Anna University, Chennai',
  'Pune University (SPPU)',
  'JNTU Hyderabad',
  'Delhi Technological University (DTU)',
  'Vellore Institute of Technology (VIT)',
  'BITS Pilani',
  'NIT Trichy',
  'Thapar University',
  'Manipal Institute of Technology'
];

interface CandidateSpec {
  domain: 'Full-Stack' | 'AI/ML' | 'Semiconductor' | 'Cybersecurity';
  currentRole: string;
  targetRole: string;
  expYears: string;
  currentCtc: string;
  targetCtc: string;
  skills: string[];
  summary: string;
  badge?: {
    title: string;
    mentor: Creator;
    badgeSkills: string[];
  };
}

const FULL_STACK_SPECS: CandidateSpec[] = [
  {
    domain: 'Full-Stack',
    currentRole: 'Senior Frontend Engineer',
    targetRole: 'Staff UI & Micro-Frontend Architect',
    expYears: '4 Years, 2 Months',
    currentCtc: '₹7.5 LPA',
    targetCtc: '₹22 - 30 LPA',
    skills: ['React.js', 'TypeScript', 'Next.js', 'JavaScript (ES6+)', 'Redux Toolkit', 'Tailwind CSS', 'REST APIs', 'Vite', 'Jest', 'Git'],
    summary: 'Senior Frontend Developer with 4+ years of hands-on experience building high-traffic, resilient web applications at scale. Specializing in React 19, TypeScript, and micro-frontends.',
    badge: {
      title: 'Tier-1 Frontend & UI Architecture',
      mentor: TEN_MENTORS[0], // Saheli (Razorpay)
      badgeSkills: ['React.js', 'TypeScript Micro-Frontends', 'UI Performance', 'Design Systems']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Full-Stack Developer',
    targetRole: 'Senior Full-Stack Engineer (Node + React)',
    expYears: '3 Years, 6 Months',
    currentCtc: '₹6.0 LPA',
    targetCtc: '₹18 - 25 LPA',
    skills: ['React.js', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'Tailwind CSS'],
    summary: 'Full-stack software engineer with deep expertise in scalable Express/Node microservices and modern React component architectures.',
    badge: {
      title: 'Microservices & High-Throughput Node.js',
      mentor: TEN_MENTORS[3], // Vikram (Google)
      badgeSkills: ['Node.js Concurrency', 'Redis Caching', 'PostgreSQL Optimization']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Frontend Developer',
    targetRole: 'Lead Frontend Engineer',
    expYears: '3 Years',
    currentCtc: '₹5.5 LPA',
    targetCtc: '₹16 - 22 LPA',
    skills: ['React.js', 'Next.js', 'JavaScript', 'HTML5/CSS3', 'REST APIs', 'Zustand', 'Vite'],
    summary: 'Frontend developer passionate about sub-second Core Web Vitals, SSR, and dynamic animations in Next.js.',
    badge: {
      title: 'Core Web Vitals & SSR Performance',
      mentor: TEN_MENTORS[0], // Saheli
      badgeSkills: ['Next.js App Router', 'SSR Optimization', 'Web Vitals LCP/CLS']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Backend Engineer',
    targetRole: 'Staff Distributed Systems Architect',
    expYears: '5 Years',
    currentCtc: '₹9.0 LPA',
    targetCtc: '₹26 - 36 LPA',
    skills: ['Go (Golang)', 'Java Spring Boot', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes', 'gRPC', 'Distributed Systems'],
    summary: 'Backend engineer designing event-driven microservices with Kafka and Go. Experience handling 20,000+ RPS.',
    badge: {
      title: 'High-Concurrency Event Streams & Kafka',
      mentor: TEN_MENTORS[2], // Anirudh (Shine)
      badgeSkills: ['Kafka Event Streaming', 'Distributed Sharding', 'Low-Latency Go APIs']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'UI/UX Frontend Engineer',
    targetRole: 'Senior Design Systems Engineer',
    expYears: '4 Years',
    currentCtc: '₹7.0 LPA',
    targetCtc: '₹20 - 26 LPA',
    skills: ['React.js', 'TypeScript', 'Storybook', 'Figma Tokens', 'CSS Architecture', 'Accessibility (a11y)'],
    summary: 'Specialist in bridging Figma UI specs to production design systems and accessible React token libraries.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Software Engineer',
    targetRole: 'Senior Full-Stack Product Engineer',
    expYears: '2.5 Years',
    currentCtc: '₹5.0 LPA',
    targetCtc: '₹15 - 20 LPA',
    skills: ['React.js', 'TypeScript', 'Node.js', 'GraphQL', 'MongoDB', 'AWS S3', 'CI/CD'],
    summary: 'Agile full-stack product engineer building fast-shipping SaaS web apps with React and GraphQL.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Senior Java/Full-Stack Engineer',
    targetRole: 'Technical Lead / Microservices Architect',
    expYears: '6 Years',
    currentCtc: '₹11 LPA',
    targetCtc: '₹28 - 38 LPA',
    skills: ['Java 21', 'Spring Boot 3', 'Microservices', 'React.js', 'Kubernetes', 'AWS', 'MySQL'],
    summary: 'Enterprise engineering lead modernizing monolithic banking applications into resilient cloud microservices.',
    badge: {
      title: 'Tier-1 Enterprise Cloud Architecture',
      mentor: TEN_MENTORS[3], // Vikram
      badgeSkills: ['Spring Boot Microservices', 'Kubernetes Deployment', 'Fault-Tolerant Patterns']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'React Native & Web Developer',
    targetRole: 'Staff Mobile & Web Architect',
    expYears: '4.5 Years',
    currentCtc: '₹8.0 LPA',
    targetCtc: '₹24 - 32 LPA',
    skills: ['React Native', 'React.js', 'TypeScript', 'Redux', 'iOS/Android Tooling', 'GraphQL'],
    summary: 'Cross-platform engineer architecting unified mobile and web frontend codebases with 90%+ code sharing.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Backend Developer',
    targetRole: 'Senior Backend Engineer (Python/Go)',
    expYears: '3 Years',
    currentCtc: '₹6.2 LPA',
    targetCtc: '₹18 - 24 LPA',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Celery'],
    summary: 'Backend specialist crafting asynchronous APIs, background job workers, and high-speed data pipelines.',
    badge: {
      title: 'Async API Design & Celery Distributed Tasks',
      mentor: TEN_MENTORS[2], // Anirudh
      badgeSkills: ['FastAPI Asynchronous', 'Redis Queue Tuning', 'Database Indexing']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Frontend Engineer',
    targetRole: 'Senior Frontend Engineer',
    expYears: '3.5 Years',
    currentCtc: '₹6.8 LPA',
    targetCtc: '₹19 - 25 LPA',
    skills: ['React.js', 'TypeScript', 'Module Federation', 'Webpack', 'Tailwind CSS', 'Playwright'],
    summary: 'Frontend developer with production experience in multi-repo micro-frontends and end-to-end testing.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Associate Software Engineer',
    targetRole: 'Full-Stack Engineer',
    expYears: '1.5 Years',
    currentCtc: '₹4.2 LPA',
    targetCtc: '₹12 - 16 LPA',
    skills: ['JavaScript', 'React.js', 'Node.js', 'Express', 'SQL', 'Git', 'Bootstrap'],
    summary: 'High-velocity junior developer ready for tier-1 startup jump. Strong fundamentals in DSA and JS internals.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Senior Web Developer',
    targetRole: 'Lead Frontend Architect',
    expYears: '5.5 Years',
    currentCtc: '₹10.5 LPA',
    targetCtc: '₹26 - 34 LPA',
    skills: ['React.js', 'Angular', 'TypeScript', 'Micro-Frontends', 'CI/CD Pipelines', 'Performance Tuning'],
    summary: 'Experienced web architect migrating legacy Angular portals to high-performance React micro-apps.',
    badge: {
      title: 'Legacy Migration & Micro-Frontend Architecture',
      mentor: TEN_MENTORS[0], // Saheli
      badgeSkills: ['Module Federation', 'Angular to React Migration', 'Runtime Sandboxing']
    }
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Cloud Software Engineer',
    targetRole: 'Senior Cloud Full-Stack Engineer',
    expYears: '4 Years',
    currentCtc: '₹8.5 LPA',
    targetCtc: '₹22 - 28 LPA',
    skills: ['React.js', 'Node.js', 'AWS Lambda', 'DynamoDB', 'Serverless', 'Terraform'],
    summary: 'Serverless architecture advocate creating event-driven cloud applications on AWS and React.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Frontend Developer',
    targetRole: 'Staff Frontend Engineer',
    expYears: '4 Years',
    currentCtc: '₹7.2 LPA',
    targetCtc: '₹21 - 28 LPA',
    skills: ['React.js', 'Next.js', 'State Management', 'GraphQL', 'Jest', 'Webpack'],
    summary: 'Frontend engineer with rich expertise in complex client-side caching, optimistic updates, and SSR.'
  },
  {
    domain: 'Full-Stack',
    currentRole: 'Full-Stack Java/React Engineer',
    targetRole: 'Senior Full-Stack Engineer',
    expYears: '3.8 Years',
    currentCtc: '₹7.8 LPA',
    targetCtc: '₹20 - 27 LPA',
    skills: ['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'Docker', 'REST APIs'],
    summary: 'Hands-on engineer building full-stack B2B analytics portals with Spring Boot backends and React frontends.'
  }
];

const AI_ML_SPECS: CandidateSpec[] = [
  {
    domain: 'AI/ML',
    currentRole: 'Data Analyst',
    targetRole: 'Applied AI Engineer / GenAI Specialist',
    expYears: '3 Years',
    currentCtc: '₹6.0 LPA',
    targetCtc: '₹18 - 24 LPA',
    skills: ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'FastAPI', 'RAG Pipelines', 'Vector Databases'],
    summary: 'Data analyst with strong Python and SQL background. Transitioning to production ML and Generative AI systems.',
    badge: {
      title: 'Production RAG & Vector Retrieval',
      mentor: TEN_MENTORS[4], // Ishita (Swiggy)
      badgeSkills: ['RAG Systems', 'PyTorch', 'FastAPI Serving']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'Machine Learning Engineer',
    targetRole: 'Senior Generative AI Architect',
    expYears: '4.5 Years',
    currentCtc: '₹9.5 LPA',
    targetCtc: '₹28 - 40 LPA',
    skills: ['Python', 'PyTorch', 'Transformers', 'LangChain', 'LlamaIndex', 'Pinecone', 'vLLM', 'Docker'],
    summary: 'ML Engineer specializing in enterprise RAG systems, LLM agents, and semantic vector caching at scale.',
    badge: {
      title: 'Enterprise LLM Agents & vLLM Serving',
      mentor: TEN_MENTORS[4], // Ishita
      badgeSkills: ['LLM Fine-Tuning', 'vLLM Multi-GPU Serving', 'Pinecone Indexing']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'Deep Learning Engineer',
    targetRole: 'Staff AI Systems & CUDA Engineer',
    expYears: '5 Years',
    currentCtc: '₹12 LPA',
    targetCtc: '₹35 - 50 LPA',
    skills: ['CUDA C++', 'PyTorch', 'TensorRT', 'Model Quantization (AWQ/FP8)', 'Distributed Training', 'C++20'],
    summary: 'Deep learning performance engineer tuning GPU kernels and accelerating trillion-token transformer inference.',
    badge: {
      title: 'Hardware-Accelerated TensorRT & CUDA Tuning',
      mentor: TEN_MENTORS[5], // Dr. Raghavan (NVIDIA)
      badgeSkills: ['CUDA Kernel Optimization', 'TensorRT-LLM', 'FP8 Quantization']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'Computer Vision Engineer',
    targetRole: 'Lead Computer Vision & Multi-Modal AI',
    expYears: '4 Years',
    currentCtc: '₹8.5 LPA',
    targetCtc: '₹24 - 32 LPA',
    skills: ['OpenCV', 'PyTorch', 'YOLOv8', 'Diffusion Models', 'ONNX Runtime', 'Python', 'C++'],
    summary: 'Computer vision specialist deploying real-time object detection and video analytics pipelines on edge devices.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'NLP Data Scientist',
    targetRole: 'Senior NLP / LLM Research Engineer',
    expYears: '3.5 Years',
    currentCtc: '₹7.8 LPA',
    targetCtc: '₹22 - 30 LPA',
    skills: ['Hugging Face', 'BERT', 'Transformers', 'Prompt Engineering', 'LoRA / QLoRA', 'Python'],
    summary: 'Data scientist experienced in instruction fine-tuning open-source LLMs (Llama 3, Mistral) for domain-specific tasks.',
    badge: {
      title: 'QLoRA Fine-Tuning & Prompt Alignment',
      mentor: TEN_MENTORS[4], // Ishita
      badgeSkills: ['LoRA Adapters', 'Token Embeddings', 'Hugging Face PEFT']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'Data Engineer',
    targetRole: 'Senior MLOps & Data Infrastructure Engineer',
    expYears: '4 Years',
    currentCtc: '₹8.0 LPA',
    targetCtc: '₹22 - 30 LPA',
    skills: ['Apache Spark', 'Airflow', 'Python', 'MLflow', 'Kubeflow', 'Snowflake', 'AWS S3'],
    summary: 'Data & MLOps engineer building automated model training workflows and feature store pipelines.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'BI & Analytics Consultant',
    targetRole: 'Applied Machine Learning Engineer',
    expYears: '3 Years',
    currentCtc: '₹6.2 LPA',
    targetCtc: '₹17 - 23 LPA',
    skills: ['Python', 'SQL', 'Tableau', 'Scikit-Learn', 'Statistical Modeling', 'XGBoost'],
    summary: 'Transitioning from legacy business intelligence to predictive customer churn and pricing models.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'AI Solutions Engineer',
    targetRole: 'Senior Generative AI Engineer',
    expYears: '3.5 Years',
    currentCtc: '₹7.5 LPA',
    targetCtc: '₹22 - 30 LPA',
    skills: ['Python', 'LangChain', 'OpenAI API', 'Vector DB (Milvus)', 'FastAPI', 'Docker'],
    summary: 'Building conversational agent bots with tool-calling, semantic memory, and document QA systems.',
    badge: {
      title: 'Agentic Workflows & Multi-Tool RAG',
      mentor: TEN_MENTORS[4], // Ishita
      badgeSkills: ['LangChain Agents', 'Vector Indexing (Milvus)', 'Tool Calling']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'Research Associate',
    targetRole: 'Machine Learning Scientist',
    expYears: '2.5 Years',
    currentCtc: '₹5.5 LPA',
    targetCtc: '₹18 - 25 LPA',
    skills: ['PyTorch', 'NumPy', 'SciPy', 'Mathematical Optimization', 'Graph Neural Networks', 'Python'],
    summary: 'Master’s graduate with published research in graph neural networks and semi-supervised learning.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'Python Backend & ML Developer',
    targetRole: 'Senior AI Platform Engineer',
    expYears: '4.5 Years',
    currentCtc: '₹9.0 LPA',
    targetCtc: '₹26 - 35 LPA',
    skills: ['Python', 'Triton Inference Server', 'FastAPI', 'Docker', 'Kubernetes', 'Redis', 'gRPC'],
    summary: 'Architecting low-latency model inference servers handling 50M+ daily predictions with Triton.',
    badge: {
      title: 'Triton Model Inference Serving at Scale',
      mentor: TEN_MENTORS[5], // Raghavan
      badgeSkills: ['Triton Server', 'Dynamic Batching', 'gRPC Microservices']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'Junior Data Scientist',
    targetRole: 'Machine Learning Engineer',
    expYears: '2 Years',
    currentCtc: '₹5.0 LPA',
    targetCtc: '₹14 - 18 LPA',
    skills: ['Python', 'Pandas', 'Scikit-Learn', 'Feature Engineering', 'SQL', 'Git'],
    summary: 'Hands-on experience building classification, regression, and clustering algorithms on consumer transaction data.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'Senior Data Scientist',
    targetRole: 'Lead AI/ML Strategist',
    expYears: '6 Years',
    currentCtc: '₹14 LPA',
    targetCtc: '₹34 - 48 LPA',
    skills: ['Predictive Modeling', 'PyTorch', 'Product Analytics', 'A/B Testing', 'Stakeholder Management', 'Python'],
    summary: 'Driving end-to-end data science projects from problem scoping to multi-million dollar revenue impact.',
    badge: {
      title: 'Strategic ML Modeling & Experimentation',
      mentor: TEN_MENTORS[1], // Akash (Product Manager)
      badgeSkills: ['Product Metric Alignment', 'Hypothesis Testing', 'Data-Driven Roadmaps']
    }
  },
  {
    domain: 'AI/ML',
    currentRole: 'MLOps Engineer',
    targetRole: 'Staff MLOps & Platform Engineer',
    expYears: '5 Years',
    currentCtc: '₹11.5 LPA',
    targetCtc: '₹30 - 42 LPA',
    skills: ['Kubeflow', 'MLflow', 'Docker', 'Kubernetes', 'Helm', 'AWS SageMaker', 'Terraform'],
    summary: 'Automating continuous training (CT) and automated drift detection for 30+ production models.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'Computer Vision Developer',
    targetRole: 'Senior Autonomous Vision Engineer',
    expYears: '3.8 Years',
    currentCtc: '₹8.0 LPA',
    targetCtc: '₹24 - 32 LPA',
    skills: ['C++', 'Python', 'OpenCV', 'SLAM', 'Point Clouds', 'ROS', 'PyTorch'],
    summary: 'Specializing in sensor fusion, stereo cameras, and real-time robotic vision perception.'
  },
  {
    domain: 'AI/ML',
    currentRole: 'NLP Engineer',
    targetRole: 'Senior Conversational AI Specialist',
    expYears: '3 Years',
    currentCtc: '₹6.8 LPA',
    targetCtc: '₹20 - 28 LPA',
    skills: ['Python', 'Spacy', 'Hugging Face', 'Intent Classification', 'FastAPI', 'MongoDB'],
    summary: 'Developing automated intent and entity extraction for multi-lingual customer support interactions.'
  }
];

const SEMICONDUCTOR_SPECS: CandidateSpec[] = [
  {
    domain: 'Semiconductor',
    currentRole: 'FPGA Design Engineer',
    targetRole: 'Lead Silicon Verification Architect (UVM)',
    expYears: '4 Years',
    currentCtc: '₹7.2 LPA',
    targetCtc: '₹22 - 32 LPA',
    skills: ['SystemVerilog', 'UVM', 'Verilog', 'PCIe Gen4', 'AMBA AXI', 'ModelSim', 'VCS'],
    summary: 'FPGA design and verification engineer mastering UVM testbenches and random constrained verification for SoC blocks.',
    badge: {
      title: 'UVM Testbench Architecture & SoC Verification',
      mentor: TEN_MENTORS[6], // Karthik (Qualcomm)
      badgeSkills: ['UVM Constrained Random', 'AMBA AXI4 Protocol', 'SystemVerilog Assertions']
    }
  },
  {
    domain: 'Semiconductor',
    currentRole: 'Junior Physical Design Engineer',
    targetRole: 'Staff ASIC Physical Design Lead (STA)',
    expYears: '3.5 Years',
    currentCtc: '₹6.5 LPA',
    targetCtc: '₹20 - 28 LPA',
    skills: ['ASIC Physical Design', 'Synopsys ICC2', 'PrimeTime', 'Static Timing Analysis', 'Floorplanning', 'FinFET'],
    summary: 'Physical design engineer closing timing on sub-7nm process nodes with Synopsys ICC2 and PrimeTime.',
    badge: {
      title: 'Static Timing Closure & FinFET Signoff',
      mentor: TEN_MENTORS[7], // Priya (TI)
      badgeSkills: ['Multi-Corner Multi-Mode (MCMM)', 'Clock Tree Synthesis (CTS)', 'IR Drop Analysis']
    }
  },
  {
    domain: 'Semiconductor',
    currentRole: 'RTL Design Engineer',
    targetRole: 'Senior Digital ASIC RTL Architect',
    expYears: '4.5 Years',
    currentCtc: '₹8.5 LPA',
    targetCtc: '₹24 - 35 LPA',
    skills: ['Verilog', 'SystemVerilog', 'RTL Synthesis (Design Compiler)', 'Linting (SpyGlass)', 'Clock Domain Crossing (CDC)'],
    summary: 'Crafting synthesis-friendly RTL blocks, CDC cleanups, and low-power clock gating for multimedia SoCs.',
    badge: {
      title: 'Low-Power RTL & Clock Domain Crossing',
      mentor: TEN_MENTORS[6], // Karthik
      badgeSkills: ['CDC Verification', 'Synopsys Design Compiler', 'UPF Power Intent']
    }
  },
  {
    domain: 'Semiconductor',
    currentRole: 'DFT Engineer',
    targetRole: 'Senior Design-For-Test Lead',
    expYears: '4 Years',
    currentCtc: '₹8.0 LPA',
    targetCtc: '₹22 - 30 LPA',
    skills: ['Scan Insertion', 'ATPG (TetraMAX)', 'JTAG / IEEE 1149.1', 'Memory BIST', 'Synopsys DFT Compiler'],
    summary: 'DFT engineer specializing in scan chain insertion, boundary scan, and silicon test coverage above 99.2%.'
  },
  {
    domain: 'Semiconductor',
    currentRole: 'Embedded Firmware & Silicon Bringup',
    targetRole: 'Senior Post-Silicon Validation Engineer',
    expYears: '3.8 Years',
    currentCtc: '₹7.5 LPA',
    targetCtc: '₹21 - 29 LPA',
    skills: ['C', 'Assembly', 'Post-Silicon Validation', 'Oscilloscopes / Logic Analyzers', 'I2C / SPI / UART', 'Python'],
    summary: 'Bridging silicon design and firmware bringup on early engineering samples in high-speed hardware labs.'
  },
  {
    domain: 'Semiconductor',
    currentRole: 'Layout / Mask Design Engineer',
    targetRole: 'Senior Custom Analog Layout Lead',
    expYears: '5 Years',
    currentCtc: '₹9.0 LPA',
    targetCtc: '₹24 - 32 LPA',
    skills: ['Cadence Virtuoso', 'DRC / LVS (Calibre)', 'Analog Layout', 'Matching & Shielding', 'Electro-Migration (EM)'],
    summary: 'Designing precision analog layouts for high-speed SerDes and low-dropout voltage regulators (LDOs).'
  },
  {
    domain: 'Semiconductor',
    currentRole: 'Verification Engineer',
    targetRole: 'Lead Formal Verification Specialist',
    expYears: '3.5 Years',
    currentCtc: '₹7.0 LPA',
    targetCtc: '₹20 - 27 LPA',
    skills: ['Formal Verification (JasperGold)', 'SystemVerilog Assertions (SVA)', 'Property Specification (PSL)'],
    summary: 'Formal verification engineer proving exhaustive safety and liveness properties for critical bus arbiters.',
    badge: {
      title: 'Formal Verification with JasperGold',
      mentor: TEN_MENTORS[6], // Karthik
      badgeSkills: ['SVA Assertions', 'Mathematical Proof Convergence', 'Deadlock Detection']
    }
  },
  {
    domain: 'Semiconductor',
    currentRole: 'Analog Circuit Design Engineer',
    targetRole: 'Staff RF / Mixed-Signal Design Lead',
    expYears: '5.5 Years',
    currentCtc: '₹11 LPA',
    targetCtc: '₹28 - 38 LPA',
    skills: ['Spectre / HSPICE', 'PLL / ADC / DAC Design', 'Cadence Virtuoso', 'Noise Analysis', 'CMOS / FinFET'],
    summary: 'Transistor-level design of high-frequency Phase-Locked Loops and data converters for 5G wireless basebands.'
  },
  {
    domain: 'Semiconductor',
    currentRole: 'STA & Synthesis Specialist',
    targetRole: 'Senior Timing Signoff Architect',
    expYears: '4 Years',
    currentCtc: '₹8.2 LPA',
    targetCtc: '₹23 - 31 LPA',
    skills: ['PrimeTime', 'Static Timing Analysis', 'ECO Generation', 'Design Compiler', 'Tcl Scripting'],
    summary: 'Tcl scripting master automating multi-corner timing closure and setup/hold ECO fixes for 100M+ gate ASICs.',
    badge: {
      title: 'Automated PrimeTime ECO Flows',
      mentor: TEN_MENTORS[7], // Priya
      badgeSkills: ['PrimeTime Tcl Flows', 'Setup/Hold Slack Closure', 'On-Chip Variation (OCV)']
    }
  },
  {
    domain: 'Semiconductor',
    currentRole: 'VLSI Trainee / Fresher',
    targetRole: 'ASIC Verification Engineer',
    expYears: '1 Year',
    currentCtc: '₹4.0 LPA',
    targetCtc: '₹12 - 16 LPA',
    skills: ['Verilog', 'Digital Electronics', 'Linux', 'C Programming', 'Bash Scripting'],
    summary: 'Dedicated junior VLSI engineer with strong fundamentals in Boolean algebra, state machines, and Verilog simulation.'
  }
];

const CYBERSECURITY_SPECS: CandidateSpec[] = [
  {
    domain: 'Cybersecurity',
    currentRole: 'Lead QA & Test Automation Architect',
    targetRole: 'Principal SDET & Security Automation Architect',
    expYears: '6 Years',
    currentCtc: '₹10 LPA',
    targetCtc: '₹20 - 25 LPA',
    skills: ['Playwright', 'Selenium', 'Postman API Testing', 'CI/CD Pipelines', 'Performance Testing', 'Python', 'OWASP ZAP'],
    summary: 'Experienced QA lead specializing in distributed load testing, API automation, and CI/CD security scanning.',
    badge: {
      title: 'Distributed Test Automation & Performance',
      mentor: TEN_MENTORS[2], // Anirudh
      badgeSkills: ['Playwright / Selenium', 'Postman API Testing', 'Load Testing on Solr']
    }
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Linux System Administrator',
    targetRole: 'Lead Cloud Security & DevSecOps Architect',
    expYears: '4 Years',
    currentCtc: '₹6.2 LPA',
    targetCtc: '₹22 - 30 LPA',
    skills: ['Linux Administration', 'Kubernetes Hardening (CKS)', 'Terraform', 'AWS IAM', 'Docker', 'Prisma Cloud', 'Bash'],
    summary: 'Sysadmin transitioning into cloud security architecture, zero-trust infrastructure, and shift-left pipelines.',
    badge: {
      title: 'Cloud Security Posture & K8s Hardening',
      mentor: TEN_MENTORS[8], // Devansh (Palo Alto)
      badgeSkills: ['Kubernetes Security Policies', 'Terraform DevSecOps', 'Zero Trust IAM']
    }
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Tier-1 SOC Monitoring Analyst',
    targetRole: 'Staff SOC & Threat Hunting Architect',
    expYears: '3.5 Years',
    currentCtc: '₹5.5 LPA',
    targetCtc: '₹18 - 26 LPA',
    skills: ['Splunk SIEM', 'Threat Hunting', 'EDR Telemetry', 'MITRE ATT&CK', 'Incident Response', 'YARA'],
    summary: 'SOC analyst mastering proactive threat hunting, malware attribution playbooks, and SIEM correlation rules.',
    badge: {
      title: 'Advanced Threat Hunting & EDR Telemetry',
      mentor: TEN_MENTORS[9], // Meera (CrowdStrike)
      badgeSkills: ['Threat Hunting Playbooks', 'Endpoint Telemetry', 'MITRE ATT&CK Mapping']
    }
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Application Security Engineer',
    targetRole: 'Senior Product Security Architect',
    expYears: '4.5 Years',
    currentCtc: '₹9.0 LPA',
    targetCtc: '₹26 - 36 LPA',
    skills: ['DAST / SAST', 'Burp Suite Pro', 'OWASP Top 10', 'Threat Modeling (STRIDE)', 'Python', 'Docker Security'],
    summary: 'AppSec engineer embedding automated code security reviews, vulnerability triage, and developer security guardrails.',
    badge: {
      title: 'AppSec Pipeline & STRIDE Threat Modeling',
      mentor: TEN_MENTORS[8], // Devansh
      badgeSkills: ['Burp Suite Automation', 'SAST/DAST Tooling', 'STRIDE Threat Modeling']
    }
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Penetration Tester / Ethical Hacker',
    targetRole: 'Staff Offensive Security & Red Team Lead',
    expYears: '5 Years',
    currentCtc: '₹11 LPA',
    targetCtc: '₹28 - 38 LPA',
    skills: ['Metasploit', 'Active Directory Attacks', 'Cobalt Strike', 'Python Exploit Writing', 'Network Penetration Testing'],
    summary: 'Offensive red teamer demonstrating full kill-chain lateral movements and active directory privilege escalation.',
    badge: {
      title: 'Red Teaming & Active Directory Attacks',
      mentor: TEN_MENTORS[9], // Meera
      badgeSkills: ['Active Directory Kerberoasting', 'Privilege Escalation', 'Adversary Simulation']
    }
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Network Security Engineer',
    targetRole: 'Senior Zero-Trust Network Architect',
    expYears: '4 Years',
    currentCtc: '₹7.8 LPA',
    targetCtc: '₹22 - 28 LPA',
    skills: ['Palo Alto Firewalls', 'Cisco ASA', 'VPN / IPsec', 'BGP / OSPF', 'SD-WAN', 'Zero-Trust Network Access (ZTNA)'],
    summary: 'Designing micro-segmented enterprise perimeter networks with next-gen firewalls and ZTNA gateways.'
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Cloud Security Specialist',
    targetRole: 'Senior Cloud Security Architect',
    expYears: '3.8 Years',
    currentCtc: '₹8.2 LPA',
    targetCtc: '₹24 - 32 LPA',
    skills: ['AWS Security Hub', 'GuardDuty', 'Terraform', 'Azure Defender', 'CloudTrail / CloudWatch', 'Python'],
    summary: 'Automating multi-account AWS cloud governance, IAM least-privilege policies, and guardrails.'
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Security Compliance & GRC Analyst',
    targetRole: 'Lead InfoSec Compliance Manager',
    expYears: '5 Years',
    currentCtc: '₹8.5 LPA',
    targetCtc: '₹20 - 28 LPA',
    skills: ['ISO 27001', 'SOC 2 Type II', 'GDPR', 'Vendor Risk Management', 'Security Audits', 'NIST CSF'],
    summary: 'Guiding high-growth fintech and SaaS platforms through successful SOC 2 Type II and ISO 27001 audits.'
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Incident Response Analyst',
    targetRole: 'Senior DFIR Specialist',
    expYears: '4 Years',
    currentCtc: '₹8.0 LPA',
    targetCtc: '₹23 - 31 LPA',
    skills: ['Digital Forensics (Autopsy/FTK)', 'Memory Forensics (Volatility)', 'Malware Triage', 'Splunk', 'Linux Forensics'],
    summary: 'Digital forensics expert extracting volatile memory artifacts, timeline reconstruction, and ransomware isolation.',
    badge: {
      title: 'Digital Forensics & Incident Response (DFIR)',
      mentor: TEN_MENTORS[9], // Meera
      badgeSkills: ['Memory Extraction (Volatility)', 'Ransomware Reverse Engineering', 'Forensic Timelines']
    }
  },
  {
    domain: 'Cybersecurity',
    currentRole: 'Junior Security Operations Analyst',
    targetRole: 'SOC Security Engineer',
    expYears: '1.5 Years',
    currentCtc: '₹4.5 LPA',
    targetCtc: '₹13 - 17 LPA',
    skills: ['Wireshark', 'Packet Analysis', 'Linux Commands', 'Basic Python', 'Firewall Logs'],
    summary: 'Entry-level cyber analyst with keen eye for anomaly detection in network packet captures and firewall syslog streams.'
  }
];

const ALL_SPECS = [
  ...FULL_STACK_SPECS, // 15
  ...AI_ML_SPECS,      // 15
  ...SEMICONDUCTOR_SPECS, // 10
  ...CYBERSECURITY_SPECS  // 10
];

console.log(`Generating exactly ${ALL_SPECS.length} candidates and ${TEN_MENTORS.length} mentors...`);

const candidates: CandidateProfile[] = ALL_SPECS.map((spec, index) => {
  const isFemale = index % 2 === 1;
  const firstName = isFemale 
    ? FIRST_NAMES_F[(index * 3) % FIRST_NAMES_F.length]
    : FIRST_NAMES_M[(index * 2) % FIRST_NAMES_M.length];
  const lastName = LAST_NAMES[(index * 5) % LAST_NAMES.length];
  const fullName = index === 0 ? 'Prakash Mahto' : index === 15 ? 'Aditi Rao' : index === 40 ? 'Sunil Kumar' : `${firstName} ${lastName}`;
  const id = fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const location = LOCATIONS[index % LOCATIONS.length];
  const pastCompany = SERVICE_COMPANIES[index % SERVICE_COMPANIES.length];
  const college = COLLEGES[index % COLLEGES.length];

  const badges: PeerVerifiedBadge[] = [];
  if (spec.badge) {
    badges.push({
      id: `badge-${id}-${index}`,
      title: spec.badge.title,
      subtitle: `Verified by ${spec.badge.mentor.name} • ${spec.badge.mentor.role} @ ${spec.badge.mentor.company}`,
      verifierName: spec.badge.mentor.name,
      verifierRole: spec.badge.mentor.role,
      verifierAvatar: spec.badge.mentor.avatar,
      verifierCompany: spec.badge.mentor.company,
      date: `Aug ${10 + (index % 18)}, 2026`,
      skills: spec.badge.badgeSkills,
      status: 'verified',
      verificationHash: `SHINE-PEER-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${spec.domain.substring(0, 2).toUpperCase()}`
    });
  }

  const baseScore = 75 + (index % 15);
  const profileScore = badges.length > 0 ? Math.min(98, baseScore + 10) : baseScore;
  const recruiterSearchMultiplier = badges.length > 0 ? +(2.5 + (index % 10) * 0.2).toFixed(1) : 1.2;

  const statuses = [
    'Serving Notice Period (30 Days)',
    'Actively Looking (Immediate Joiner)',
    'Open to Offers (15 Days Notice)',
    'Passively Exploring High-Growth Roles'
  ];

  return {
    id,
    name: fullName,
    email: `${id.replace(/-/g, '.')}@example.com`,
    phone: `+91 ${98000 + index * 13} ${10000 + index * 37}`,
    headline: `${spec.currentRole} • ${spec.expYears} • ${location.split(',')[0]}`,
    experienceYears: spec.expYears,
    location,
    profileScore,
    jobSearchStatus: statuses[index % statuses.length],
    summary: spec.summary,
    skills: spec.skills,
    currentCtc: spec.currentCtc,
    targetCtc: spec.targetCtc,
    targetRole: spec.targetRole,
    pastCompany,
    pastCompanyRole: spec.currentRole,
    educationDegree: 'B.Tech / M.Tech Computer Engineering',
    educationCollege: college,
    badges,
    recruiterSearchMultiplier
  };
});

const dbFilePath = path.join(process.cwd(), 'server', 'data', 'db.json');
const rawDb = fs.readFileSync(dbFilePath, 'utf-8');
const existingDb = JSON.parse(rawDb);

const newDb = {
  creators: TEN_MENTORS,
  candidates,
  sessions: existingDb.sessions || [],
  badges: candidates.flatMap(c => c.badges),
  analytics: {
    profileUpdatesThisMonth: 18450,
    newRegistrationsThisMonth: 8200,
    totalSessionsBooked: 2640,
    totalActiveCreators: TEN_MENTORS.length
  }
};

fs.writeFileSync(dbFilePath, JSON.stringify(newDb, null, 2), 'utf-8');

console.log(`✅ Successfully wrote to ${dbFilePath}:`);
console.log(`   - Mentors: ${newDb.creators.length}`);
console.log(`   - Candidates: ${newDb.candidates.length}`);
console.log(`   - Verified Badges: ${newDb.badges.length}`);
