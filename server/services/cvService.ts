import { DomainVertical, GapAnalysisResult } from '../types';
import { trajectoryService } from './trajectoryService';

interface DomainJDTemplate {
  domain: DomainVertical;
  defaultTargetRole: string;
  baselineSalary: string;
  targetPackage: string;
  expectedSkills: string[];
  highLeverageBoosterSkills: string[];
}

const DOMAIN_TEMPLATES: Record<string, DomainJDTemplate> = {
  'full-stack': {
    domain: 'Full-Stack',
    defaultTargetRole: 'Staff Frontend & Micro-Frontend Architect',
    baselineSalary: '₹6L - 8L LPA',
    targetPackage: '₹22L - 34L LPA',
    expectedSkills: ['React.js', 'TypeScript', 'JavaScript', 'HTML5/CSS3', 'REST APIs', 'Git'],
    highLeverageBoosterSkills: ['Micro-Frontends', 'Module Federation', 'Core Web Vitals', 'System Design', 'Next.js App Router']
  },
  'ai/ml': {
    domain: 'AI/ML',
    defaultTargetRole: 'Senior Applied AI / GenAI Engineer',
    baselineSalary: '₹6L - 9L LPA',
    targetPackage: '₹26L - 45L LPA',
    expectedSkills: ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'Linear Algebra'],
    highLeverageBoosterSkills: ['PyTorch', 'RAG Architectures', 'LLM Agent Frameworks', 'Vector Databases (Pinecone/Milvus)', 'Model Quantization']
  },
  'semiconductor': {
    domain: 'Semiconductor',
    defaultTargetRole: 'Lead Silicon Verification / ASIC Design Engineer',
    baselineSalary: '₹7L - 10L LPA',
    targetPackage: '₹24L - 40L LPA',
    expectedSkills: ['Digital Electronics', 'Verilog', 'C/C++', 'Linux'],
    highLeverageBoosterSkills: ['SystemVerilog', 'UVM Methodology', 'Static Timing Analysis (STA)', 'PCIe/AMBA Protocols', 'Formal Verification']
  },
  'cybersecurity': {
    domain: 'Cybersecurity',
    defaultTargetRole: 'Lead Cloud Security & DevSecOps Architect',
    baselineSalary: '₹5.5L - 8L LPA',
    targetPackage: '₹22L - 36L LPA',
    expectedSkills: ['Networking (TCP/IP)', 'Linux Administration', 'Bash/Python', 'Firewalls'],
    highLeverageBoosterSkills: ['Kubernetes Security (CKS)', 'Terraform DevSecOps', 'Threat Hunting (MITRE ATT&CK)', 'Cloud IAM Posture', 'Splunk SIEM']
  }
};

export class CvService {
  /**
   * Parse raw CV text / structure into standardized candidate attributes.
   */
  public parseCv(cvText: string, metadata?: Record<string, any>) {
    const textLower = (cvText || '').toLowerCase();
    
    // Skill extraction heuristics
    const knownSkills = [
      'react.js', 'react', 'typescript', 'javascript', 'next.js', 'node.js',
      'python', 'sql', 'pytorch', 'rag', 'llms', 'fastapi', 'docker', 'kubernetes',
      'systemverilog', 'uvm', 'verilog', 'asic', 'sta', 'cloud security', 'devsecops',
      'aws', 'terraform', 'splunk', 'micro-frontends', 'module federation'
    ];

    const detectedSkills = knownSkills.filter(s => textLower.includes(s));

    // Experience estimation
    let detectedExp = '3-5 Years';
    const expMatch = textLower.match(/(\d+)\+?\s*(years?|yrs?)/);
    if (expMatch) {
      detectedExp = `${expMatch[1]} Years Exp.`;
    }

    return {
      parsedSkills: detectedSkills.length > 0 ? detectedSkills : ['React.js', 'TypeScript', 'JavaScript'],
      estimatedExperience: detectedExp,
      rawLength: cvText.length,
      extractedHighlights: [
        'Solid foundation in core engineering principles',
        'Demonstrates readiness for Tier-1 trajectory transition',
        'Strong upside with booster skill acquisition'
      ]
    };
  }

  /**
   * Run targeted gap analysis against target role JDs across the 4 key verticals.
   */
  public performGapAnalysis(
    domainKey: string = 'full-stack', 
    candidateSkills: string[] = [],
    candidateRole: string = 'Senior Frontend Engineer',
    currentCtc: string = '₹7.5 LPA'
  ): GapAnalysisResult {
    const key = domainKey.toLowerCase().replace(/[^a-z0-9]/g, '');
    let matchedTemplate = DOMAIN_TEMPLATES['full-stack'];
    
    if (key.includes('ai') || key.includes('ml')) {
      matchedTemplate = DOMAIN_TEMPLATES['ai/ml'];
    } else if (key.includes('semiconductor') || key.includes('vlsi') || key.includes('silicon')) {
      matchedTemplate = DOMAIN_TEMPLATES['semiconductor'];
    } else if (key.includes('cyber') || key.includes('security')) {
      matchedTemplate = DOMAIN_TEMPLATES['cybersecurity'];
    }

    const candSkillsLower = candidateSkills.map(s => s.toLowerCase());

    const matchedSkills = matchedTemplate.expectedSkills.filter(es => 
      candSkillsLower.some(cs => cs.includes(es.toLowerCase()))
    );

    const missingBoosterSkills = matchedTemplate.highLeverageBoosterSkills.filter(bs => 
      !candSkillsLower.some(cs => cs.includes(bs.toLowerCase()))
    );

    const currentScore = Math.min(85, 60 + matchedSkills.length * 5);
    const targetScore = 96;

    // Run trajectory matching to get top 3 verified creators who made this jump
    const recommendedCreators = trajectoryService.matchTrajectories({
      currentRole: candidateRole,
      currentExperience: '4 Years',
      currentSalary: currentCtc,
      targetRole: matchedTemplate.defaultTargetRole,
      targetPackage: matchedTemplate.targetPackage,
      domain: matchedTemplate.domain,
      skills: candidateSkills
    }).slice(0, 3);

    return {
      candidateRole,
      targetRole: matchedTemplate.defaultTargetRole,
      targetDomain: matchedTemplate.domain,
      currentSalaryBaseline: currentCtc || matchedTemplate.baselineSalary,
      targetSalaryPotential: matchedTemplate.targetPackage,
      estimatedJump: '+₹14L - ₹20L Jump',
      currentScore,
      targetScore,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : matchedTemplate.expectedSkills.slice(0, 3),
      missingBoosterSkills: missingBoosterSkills.length > 0 ? missingBoosterSkills : matchedTemplate.highLeverageBoosterSkills.slice(0, 2),
      trajectoryRecommendation: `Bridge the ${missingBoosterSkills.slice(0, 2).join(' and ')} gap with verified mentors from ${matchedTemplate.domain} who made this exact jump.`,
      recommendedCreators
    };
  }
}

export const cvService = new CvService();
