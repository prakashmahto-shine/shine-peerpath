import { store } from '../data/store';
import { Creator, DomainVertical } from '../types';

export class CreatorService {
  public getAll(domain?: string, query?: string): Creator[] {
    return store.getCreators(domain, query);
  }

  public getById(id: string): Creator | undefined {
    return store.getCreatorById(id);
  }

  public register(payload: {
    name: string;
    role: string;
    company: string;
    domain: DomainVertical;
    experience?: string;
    price: number;
    duration?: string;
    skills: string[];
    bio: string;
    avatar?: string;
    videoPoster?: string;
    teaserTitle?: string;
    verifiedEmail?: string;
    days?: string[];
    timeSlots?: string[];
    role3YearsAgo?: string;
    company3YearsAgo?: string;
    salary3YearsAgo?: string;
  }): Creator {
    const id = 'exp-' + Date.now();
    const newCreator: Creator = {
      id,
      name: payload.name,
      role: payload.role,
      company: payload.company,
      domain: payload.domain || 'Full-Stack',
      experience: payload.experience || '6+ Years Exp.',
      rating: 5.0,
      reviewsCount: 1,
      sessionsCount: 0,
      price: payload.price || 999,
      location: 'Bengaluru / Remote',
      duration: payload.duration || '01:15',
      avatar: payload.avatar || '/avatars/nisha.jpg',
      videoPoster: payload.videoPoster || payload.avatar || '/avatars/nisha.jpg',
      teaserTitle: payload.teaserTitle || `Teaser: How I Jumped into ${payload.role} at ${payload.company}`,
      skills: payload.skills,
      bio: payload.bio,
      verifiedEmail: payload.verifiedEmail || `@${payload.company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      isVerifiedEmployer: true,
      trajectory: {
        role3YearsAgo: payload.role3YearsAgo || 'Senior Software Engineer',
        company3YearsAgo: payload.company3YearsAgo || 'Mid-tier Technology Firm',
        salary3YearsAgo: payload.salary3YearsAgo || '₹8 LPA',
        keyJumpSkills: payload.skills.slice(0, 3),
        jumpStory: `Bridged core architecture and system design requirements to land role at ${payload.company}.`
      },
      availability: {
        days: payload.days && payload.days.length > 0 ? payload.days : ['Wed', 'Sat', 'Sun'],
        timeSlots: payload.timeSlots && payload.timeSlots.length > 0 ? payload.timeSlots : ['07:00 PM - 08:00 PM', '08:30 PM - 09:30 PM']
      }
    };

    return store.addCreator(newCreator);
  }

  public updateAvailability(creatorId: string, days: string[], timeSlots: string[]): Creator | undefined {
    return store.updateCreatorAvailability(creatorId, days, timeSlots);
  }
}

export const creatorService = new CreatorService();
