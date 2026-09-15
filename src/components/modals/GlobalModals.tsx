import React from 'react';
import { useApp } from '../../context/AppContext';

import { BookingModal } from './BookingModal';
import { CreatorWizardModal } from './CreatorWizardModal';
import { LoginModal } from './LoginModal';
import { MentorAssessmentModal } from './MentorAssessmentModal';
import { CvUploadSyncModal } from './CvUploadSyncModal';
import { TrajectoryCalibrationModal } from './TrajectoryCalibrationModal';
import { UpdateProfileModal } from './UpdateProfileModal';

/**
 * Global Modals Orchestrator
 * Mounts all top-level application modal dialogs
 */
export const GlobalModals: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookingDraft,
    setBookingDraft,
    selectedExpert,
    navigate
  } = useApp();

  return (
    <>
      <BookingModal
        expert={bookingDraft?.expert || selectedExpert}
        isOpen={isBookingModalOpen}
        selectedDate={bookingDraft?.date}
        selectedTime={bookingDraft?.timeSlot}
        onClose={() => setIsBookingModalOpen(false)}
        onSelectDate={(d) => setBookingDraft(prev => ({ ...prev, date: d }))}
        onSelectTime={(t) => setBookingDraft(prev => ({ ...prev, timeSlot: t }))}
        onProceedToPay={() => {
          setIsBookingModalOpen(false);
          navigate('payment-view');
        }}
      />

      <CreatorWizardModal />
      <LoginModal />
      <MentorAssessmentModal />
      <CvUploadSyncModal />
      <TrajectoryCalibrationModal />
      <UpdateProfileModal />
    </>
  );
};
