import { Router, Request, Response } from 'express';
import { bookingService } from '../services/bookingService';

const router = Router();

// GET /api/bookings - List sessions for candidate or mentor
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const role = req.query.role as 'candidate' | 'mentor' | undefined;
    const sessions = bookingService.getAllSessions(userId, role);
    return res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching sessions' });
  }
});

// GET /api/bookings/:id - Get single session
router.get('/:id', (req: Request, res: Response) => {
  try {
    const session = bookingService.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.json({ success: true, data: session });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching session' });
  }
});

// POST /api/payments/checkout OR /api/bookings - Mock payment processing & session confirmation
router.post('/checkout', (req: Request, res: Response) => {
  try {
    const { expertId, candidateId, candidateName, candidateRole, candidateAvatar, candidateGoal, candidateEmail, date, timeSlot, paymentMethod, upiId, amount } = req.body;
    
    if (!expertId || !date || !timeSlot) {
      return res.status(400).json({ error: 'expertId, date, and timeSlot are required' });
    }

    const result = bookingService.processCheckout({
      expertId,
      candidateId,
      candidateName,
      candidateRole,
      candidateAvatar,
      candidateGoal,
      candidateEmail,
      date,
      timeSlot,
      paymentMethod: paymentMethod || 'upi',
      upiId,
      amount: Number(amount) || 999
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error processing checkout' });
  }
});

// Aliased POST /api/bookings
router.post('/', (req: Request, res: Response) => {
  try {
    const { expertId, candidateId, candidateName, candidateRole, candidateAvatar, candidateGoal, candidateEmail, date, timeSlot, paymentMethod, upiId, amount } = req.body;
    
    if (!expertId || !date || !timeSlot) {
      return res.status(400).json({ error: 'expertId, date, and timeSlot are required' });
    }

    const result = bookingService.processCheckout({
      expertId,
      candidateId,
      candidateName,
      candidateRole,
      candidateAvatar,
      candidateGoal,
      candidateEmail,
      date,
      timeSlot,
      paymentMethod: paymentMethod || 'upi',
      upiId,
      amount: Number(amount) || 999
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error processing booking' });
  }
});

// POST /api/bookings/:id/cancel - Cancel session
router.post('/:id/cancel', (req: Request, res: Response) => {
  try {
    const session = bookingService.cancelSession(req.params.id);
    return res.json({
      success: true,
      message: 'Session cancelled and mock refund initiated',
      data: session
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error cancelling session' });
  }
});

// POST /api/bookings/:id/reschedule - Reschedule session
router.post('/:id/reschedule', (req: Request, res: Response) => {
  try {
    const { newDate, newTimeSlot } = req.body;
    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ error: 'newDate and newTimeSlot are required' });
    }
    const session = bookingService.rescheduleSession(req.params.id, newDate, newTimeSlot);
    return res.json({
      success: true,
      message: 'Session rescheduled successfully',
      data: session
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error rescheduling session' });
  }
});

export default router;
