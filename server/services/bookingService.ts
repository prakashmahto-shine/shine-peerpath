import { store } from '../data/store';
import { MentorshipSession } from '../types';

export interface CheckoutPayload {
  expertId: string;
  candidateId?: string;
  candidateName?: string;
  candidateRole?: string;
  candidateAvatar?: string;
  candidateGoal?: string;
  candidateEmail?: string;
  date: string;
  timeSlot: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  upiId?: string;
  amount: number;
}

export class BookingService {
  public getAllSessions(userId?: string, role?: 'candidate' | 'mentor'): MentorshipSession[] {
    return store.getSessions(userId, role);
  }

  public getSession(id: string): MentorshipSession | undefined {
    return store.getSessionById(id);
  }

  public processCheckout(payload: CheckoutPayload): {
    success: boolean;
    session: MentorshipSession;
    receipt: {
      transactionId: string;
      amountPaid: number;
      paymentMethod: string;
      paidAt: string;
      meetingUrl: string;
      status: 'PAID_AND_CONFIRMED';
    };
  } {
    const expert = store.getCreatorById(payload.expertId);
    if (!expert) {
      throw new Error(`Expert with id "${payload.expertId}" not found`);
    }

    const transactionId = 'pay_shine_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const sessionId = 'sess-' + Date.now();
    const meetingLink = `https://meet.shine.com/room/peerpath-${expert.id}-${sessionId.substring(5)}`;

    const newSession: MentorshipSession = {
      id: sessionId,
      expertId: expert.id,
      expert,
      candidateId: payload.candidateId || 'prakash',
      candidateName: payload.candidateName || 'Prakash Mahto',
      candidateRole: payload.candidateRole || 'Senior Frontend Engineer',
      candidateAvatar: payload.candidateAvatar || '/avatars/prakash.jpg',
      candidateGoal: payload.candidateGoal || `Trajectory mentorship & target jump into ${expert.company}`,
      candidateEmail: payload.candidateEmail || 'prakash.mahto@gmail.com',
      date: payload.date,
      timeSlot: payload.timeSlot,
      status: 'upcoming',
      meetingLink,
      paymentId: transactionId,
      amountPaid: payload.amount || expert.price,
      bookedAt: new Date().toISOString()
    };

    store.addSession(newSession);

    return {
      success: true,
      session: newSession,
      receipt: {
        transactionId,
        amountPaid: newSession.amountPaid || expert.price,
        paymentMethod: payload.paymentMethod,
        paidAt: new Date().toISOString(),
        meetingUrl: meetingLink,
        status: 'PAID_AND_CONFIRMED'
      }
    };
  }

  public cancelSession(sessionId: string): MentorshipSession {
    const session = store.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updated = store.updateSession(sessionId, { status: 'cancelled' });
    if (!updated) {
      throw new Error(`Could not cancel session ${sessionId}`);
    }
    return updated;
  }

  public rescheduleSession(sessionId: string, newDate: string, newTimeSlot: string): MentorshipSession {
    const session = store.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updated = store.updateSession(sessionId, {
      date: newDate,
      timeSlot: newTimeSlot
    });
    if (!updated) {
      throw new Error(`Could not reschedule session ${sessionId}`);
    }
    return updated;
  }
}

export const bookingService = new BookingService();
