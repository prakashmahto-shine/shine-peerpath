import time
import random
from typing import List, Dict, Optional, Any
from datetime import datetime
from backend.data.store import store
from backend.models.schemas import MentorshipSession, CheckoutPayload

class BookingService:
    def get_all_sessions(self, user_id: Optional[str] = None, role: Optional[str] = None) -> List[MentorshipSession]:
        return store.get_sessions(user_id=user_id, role=role)

    def get_session(self, session_id: str) -> Optional[MentorshipSession]:
        return store.get_session_by_id(session_id)

    def process_checkout(self, payload: CheckoutPayload) -> Dict[str, Any]:
        expert = store.get_creator_by_id(payload.expertId)
        if not expert:
            raise ValueError(f"Expert with id '{payload.expertId}' not found")

        timestamp = int(time.time() * 1000)
        random_suffix = hex(random.randint(1000, 9999))[2:]
        transaction_id = f"pay_shine_{timestamp}_{random_suffix}"
        session_id = f"sess-{timestamp}"
        meeting_link = f"https://meet.shine.com/room/peerpath-{expert.id}-{str(timestamp)[-5:]}"

        new_session = MentorshipSession(
            id=session_id,
            expertId=expert.id,
            expert=expert,
            candidateId=payload.candidateId or 'prakash',
            candidateName=payload.candidateName or 'Prakash Mahto',
            candidateRole=payload.candidateRole or 'Senior Frontend Engineer',
            candidateAvatar=payload.candidateAvatar or '/avatars/prakash.jpg',
            candidateGoal=payload.candidateGoal or f"Trajectory mentorship & target jump into {expert.company}",
            candidateEmail=payload.candidateEmail or 'prakash.mahto@gmail.com',
            date=payload.date,
            timeSlot=payload.timeSlot,
            status='upcoming',
            meetingLink=meeting_link,
            paymentId=transaction_id,
            amountPaid=payload.amount or expert.price,
            bookedAt=datetime.utcnow().isoformat() + "Z"
        )

        store.add_session(new_session)

        return {
            'success': True,
            'session': new_session,
            'receipt': {
                'transactionId': transaction_id,
                'amountPaid': new_session.amountPaid or expert.price,
                'paymentMethod': payload.paymentMethod,
                'paidAt': datetime.utcnow().isoformat() + "Z",
                'meetingUrl': meeting_link,
                'status': 'PAID_AND_CONFIRMED'
            }
        }

    def cancel_session(self, session_id: str) -> MentorshipSession:
        session = store.get_session_by_id(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        updated = store.update_session(session_id, {'status': 'cancelled'})
        if not updated:
            raise ValueError(f"Could not cancel session {session_id}")
        return updated

    def reschedule_session(self, session_id: str, new_date: str, new_time_slot: str) -> MentorshipSession:
        session = store.get_session_by_id(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        updated = store.update_session(session_id, {
            'date': new_date,
            'timeSlot': new_time_slot
        })
        if not updated:
            raise ValueError(f"Could not reschedule session {session_id}")
        return updated

booking_service = BookingService()
