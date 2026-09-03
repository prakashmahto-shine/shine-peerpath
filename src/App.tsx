import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { ProfileView } from './components/views/ProfileView';
import { CareerGuidanceView } from './components/views/CareerGuidanceView';
import { ExpertsGalleryView } from './components/views/ExpertsGalleryView';
import { ExpertProfileView } from './components/views/ExpertProfileView';
import { PaymentView } from './components/views/PaymentView';
import { ConfirmedView } from './components/views/ConfirmedView';
import { MySessionsView } from './components/views/MySessionsView';
import { LiveVideoCallView } from './components/views/LiveVideoCallView';
import { PostSessionView } from './components/views/PostSessionView';
import { RecruiterView } from './components/views/RecruiterView';

import { BookingModal } from './components/modals/BookingModal';
import { CreatorWizardModal } from './components/modals/CreatorWizardModal';

import { EXPERTS_DB } from './data/expertsData';
import { ViewType, Expert } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('profile-view');
  const [selectedExpert, setSelectedExpert] = useState<Expert>(EXPERTS_DB[0]);
  const [bookingDate, setBookingDate] = useState<string>('Fri, 2 Sep');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM - 11:00 AM');
  const [showTopNotice, setShowTopNotice] = useState<boolean>(true);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isCreatorWizardOpen, setIsCreatorWizardOpen] = useState<boolean>(false);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExpert = (expertId: string) => {
    const exp = EXPERTS_DB.find((e) => e.id === expertId) || EXPERTS_DB[0];
    setSelectedExpert(exp);
  };

  const handleOpenBooking = (expertId: string) => {
    handleSelectExpert(expertId);
    setIsBookingModalOpen(true);
  };

  const handleProceedToPay = () => {
    setIsBookingModalOpen(false);
    handleNavigate('payment-view');
  };

  const handlePaymentSuccess = () => {
    handleNavigate('confirmed-view');
  };

  const handleJoinLiveCall = () => {
    handleNavigate('live-call-view');
  };

  const handleEndLiveCall = () => {
    handleNavigate('post-session-view');
  };

  const handleCreatorPublishSuccess = () => {
    setIsCreatorWizardOpen(false);
    alert('🎉 Congratulations Prakash! Your Creator Profile is now LIVE on Shine Peerpath. Trajectory matched mentees will be routed to your calendar!');
    handleNavigate('profile-view');
  };

  const handleGlobalSearch = (_query: string) => {
    handleNavigate('experts-view');
  };

  return (
    <div className="app-root-container">
      
      {showTopNotice && currentView !== 'live-call-view' && (
        <div className="myshine-top-notice-bar">
          <div className="notice-inner-flex">
            <div className="notice-left-text">
              <span className="notice-doc-icon">📄</span>
              <p>Your Profile was last updated <strong>almost a year ago</strong></p>
            </div>
            <div className="notice-right-actions">
              <button className="btn-purple-notice" onClick={() => alert('Profile update modal opened!')}>
                Update Profile
              </button>
              <button className="btn-close-notice" onClick={() => setShowTopNotice(false)} title="Dismiss">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCreatorWizard={() => setIsCreatorWizardOpen(true)}
        onSearch={handleGlobalSearch}
      />

      <main className="app-main-viewport" style={{ minHeight: '80vh' }}>
        {currentView === 'profile-view' && (
          <ProfileView
            onNavigate={handleNavigate}
            onOpenCreatorWizard={() => setIsCreatorWizardOpen(true)}
          />
        )}

        {currentView === 'guidance-view' && (
          <CareerGuidanceView
            onNavigate={handleNavigate}
            onSelectExpert={handleSelectExpert}
            experts={EXPERTS_DB}
          />
        )}

        {currentView === 'experts-view' && (
          <ExpertsGalleryView
            experts={EXPERTS_DB}
            onSelectExpert={handleSelectExpert}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'expert-profile-view' && (
          <ExpertProfileView
            expert={selectedExpert}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'payment-view' && (
          <PaymentView
            expert={selectedExpert}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            onNavigate={handleNavigate}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {currentView === 'confirmed-view' && (
          <ConfirmedView
            expert={selectedExpert}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'sessions-view' && (
          <MySessionsView
            expert={selectedExpert}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            onNavigate={handleNavigate}
            onJoinCall={handleJoinLiveCall}
          />
        )}

        {currentView === 'live-call-view' && (
          <LiveVideoCallView
            expert={selectedExpert}
            onEndCall={handleEndLiveCall}
          />
        )}

        {currentView === 'post-session-view' && (
          <PostSessionView
            expert={selectedExpert}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'recruiter-view' && (
          <RecruiterView onNavigate={handleNavigate} />
        )}
      </main>

      {currentView !== 'live-call-view' && <Footer />}

      <BookingModal
        expert={selectedExpert}
        isOpen={isBookingModalOpen}
        selectedDate={bookingDate}
        selectedTime={bookingTime}
        onClose={() => setIsBookingModalOpen(false)}
        onSelectDate={setBookingDate}
        onSelectTime={setBookingTime}
        onProceedToPay={handleProceedToPay}
      />

      <CreatorWizardModal
        isOpen={isCreatorWizardOpen}
        onClose={() => setIsCreatorWizardOpen(false)}
        onPublishSuccess={handleCreatorPublishSuccess}
      />
    </div>
  );
};
