import { store } from '../data/store';

export class AnalyticsService {
  public getMetrics() {
    const raw = store.getAnalytics();
    const creators = store.getCreators();

    const domainBreakdown = {
      'AI/ML': creators.filter(c => c.domain === 'AI/ML').length,
      'Semiconductor': creators.filter(c => c.domain === 'Semiconductor').length,
      'Cybersecurity': creators.filter(c => c.domain === 'Cybersecurity').length,
      'Full-Stack': creators.filter(c => c.domain === 'Full-Stack').length,
      'Product Management': creators.filter(c => c.domain === 'Product Management').length,
      'Search & Data Infra': creators.filter(c => c.domain === 'Search & Data Infra').length,
      'SaaS Sales': creators.filter(c => c.domain === 'SaaS Sales').length
    };

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      keyHackathonMetrics: [
        {
          metric: 'Profile Update Rate (MoM)',
          value: '+68.4%',
          whyItMatters: 'Proves mentorship sessions convert to active platform profile freshness and verified skill signals.'
        },
        {
          metric: 'New Passive Registrations Attributed to Peerpath',
          value: '6,350',
          whyItMatters: 'Direct acquisition of passive working professionals in underserved domains job alerts cannot touch.'
        },
        {
          metric: 'Sessions Booked / Month',
          value: `${raw.totalSessionsBooked.toLocaleString()}`,
          whyItMatters: 'Core marketplace velocity and transaction pulse.'
        },
        {
          metric: 'Verified Creators Live Across 4 Verticals',
          value: `${raw.verifiedCreatorsCount}`,
          whyItMatters: 'Supply-side liquidity health check across AI/ML, Semiconductor, Cybersecurity, and Full-Stack.'
        }
      ],
      verticalLiquidity: domainBreakdown,
      closingLoopOutcomes: {
        badgesIssuedTotal: raw.totalBadgesIssued,
        recruiterSearchCTRMultiplier: '3.4x higher for peer-verified candidates',
        verifiedHireConversionRate: '28.2%'
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
