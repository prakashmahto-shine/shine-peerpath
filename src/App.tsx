import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

import { DashboardView } from './components/views/DashboardView';
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

import { AppProvider, useApp } from './context/AppContext';
import { ViewType } from './types';

const pathToView = (pathname: string): { view: ViewType; expertId?: string } => {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/' || clean === '/myshine' || clean === '/dashboard') {
    return { view: 'dashboard-view' };
  }
  if (clean === '/profile' || clean === '/my-profile' || clean === '/candidate-profile') {
    return { view: 'profile-view' };
  }
  if (clean === '/peerpath' || clean === '/guidance' || clean === '/career-guidance') {
    return { view: 'guidance-view' };
  }
  if (clean === '/experts' || clean === '/mentors') {
    return { view: 'experts-view' };
  }
  if (clean.startsWith('/expert/') || clean.startsWith('/mentor/')) {
    const id = clean.split('/')[2];
    return { view: 'expert-profile-view', expertId: id };
  }
  if (clean === '/expert' || clean === '/expert-profile') {
    return { view: 'expert-profile-view' };
  }
  if (clean === '/payment' || clean === '/checkout') {
    return { view: 'payment-view' };
  }
  if (clean === '/confirmed' || clean === '/success') {
    return { view: 'confirmed-view' };
  }
  if (clean === '/sessions' || clean === '/my-sessions') {
    return { view: 'sessions-view' };
  }
  if (clean === '/live-call' || clean === '/call') {
    return { view: 'live-call-view' };
  }
  if (clean === '/post-session' || clean === '/feedback' || clean === '/review') {
    return { view: 'post-session-view' };
  }
  if (clean === '/recruiter' || clean === '/recruiters') {
    return { view: 'recruiter-view' };
  }
  return { view: 'dashboard-view' };
};

const AppMain: React.FC = () => {
  const { 
    currentView, 
    navigate, 
    experts,
    selectedExpert, 
    selectExpertById,
    isBookingModalOpen, 
    setIsBookingModalOpen,
    isCreatorWizardOpen,
    setIsCreatorWizardOpen,
    bookingDraft,
    setBookingDraft,
    setSearchQuery
  } = useApp();

  const [showTopNotice, setShowTopNotice] = useState<boolean>(true);

  useEffect(() => {
    const route = pathToView(window.location.pathname);
    if (route.view !== currentView) {
      navigate(route.view);
    }
    if (route.expertId) {
      selectExpertById(route.expertId);
    }

    const onPopState = () => {
      const r = pathToView(window.location.pathname);
      navigate(r.view);
      if (r.expertId) {
        selectExpertById(r.expertId);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectExpert = (expertId: string) => {
    selectExpertById(expertId);
    navigate('expert-profile-view', `/expert/${expertId}`);
  };

  const handleOpenBooking = (expertId: string) => {
    selectExpertById(expertId);
    setIsBookingModalOpen(true);
  };

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    navigate('experts-view');
  };

  return (
    <div className="app-root-container">
      <ToastContainer />

      {showTopNotice && currentView !== 'live-call-view' && (
        <div className="myshine-top-notice-bar">
          <div className="notice-inner-flex">
            <div className="notice-left-text">
              <span className="notice-doc-icon">📄</span>
              <p>Your Profile was last updated <strong>almost a year ago</strong></p>
            </div>
            <div className="notice-right-actions">
              <button className="btn-purple-notice" onClick={() => navigate('profile-view')}>
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
        onNavigate={navigate}
        onOpenCreatorWizard={() => setIsCreatorWizardOpen(true)}
        onSearch={handleGlobalSearch}
      />

      <main className="app-main-viewport" style={{ minHeight: '80vh' }}>
        {currentView === 'dashboard-view' && (
          <DashboardView />
        )}

        {currentView === 'profile-view' && (
          <ProfileView />
        )}

        {currentView === 'guidance-view' && (
          <CareerGuidanceView
            onNavigate={navigate}
            onSelectExpert={handleSelectExpert}
            experts={experts}
          />
        )}

        {currentView === 'experts-view' && (
          <ExpertsGalleryView
            experts={experts}
            onSelectExpert={handleSelectExpert}
            onOpenBooking={handleOpenBooking}
            onNavigate={navigate}
          />
        )}

        {currentView === 'expert-profile-view' && (
          <ExpertProfileView
            expert={selectedExpert}
            onNavigate={navigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'payment-view' && (
          <PaymentView />
        )}

        {currentView === 'confirmed-view' && (
          <ConfirmedView />
        )}

        {currentView === 'sessions-view' && (
          <MySessionsView />
        )}

        {currentView === 'live-call-view' && (
          <LiveVideoCallView />
        )}

        {currentView === 'post-session-view' && (
          <PostSessionView />
        )}

        {currentView === 'recruiter-view' && (
          <RecruiterView onNavigate={navigate} />
        )}
      </main>

      {currentView !== 'live-call-view' && <Footer />}

      <BookingModal
        expert={bookingDraft.expert || selectedExpert}
        isOpen={isBookingModalOpen}
        selectedDate={bookingDraft.date}
        selectedTime={bookingDraft.timeSlot}
        onClose={() => setIsBookingModalOpen(false)}
        onSelectDate={(d) => setBookingDraft({ ...bookingDraft, date: d })}
        onSelectTime={(t) => setBookingDraft({ ...bookingDraft, timeSlot: t })}
        onProceedToPay={() => {
          setIsBookingModalOpen(false);
          navigate('payment-view');
        }}
      />

      <CreatorWizardModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppMain />
    </AppProvider>
  );
};
