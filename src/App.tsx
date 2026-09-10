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
import { MentorDashboardView } from './components/views/MentorDashboardView';
import { LoginView } from './components/views/LoginView';
import { JobsView } from './components/views/JobsView';
import { CommunityView } from './components/views/CommunityView';

import { BookingModal } from './components/modals/BookingModal';
import { CreatorWizardModal } from './components/modals/CreatorWizardModal';
import { LoginModal } from './components/modals/LoginModal';
import { MentorAssessmentModal } from './components/modals/MentorAssessmentModal';
import { CvUploadSyncModal } from './components/modals/CvUploadSyncModal';
import { TrajectoryCalibrationModal } from './components/modals/TrajectoryCalibrationModal';

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
  if (clean === '/jobs' || clean === '/job-search' || clean === '/matching-jobs' || clean.startsWith('/new-job-search')) {
    return { view: 'jobs-view' };
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
  if (clean === '/community' || clean === '/feed' || clean === '/discussions') {
    return { view: 'community-view' };
  }
  if (clean === '/mentor-dashboard' || clean === '/mentor' || clean === '/mentor-portal' || clean === '/creator-studio' || clean === '/creator' || clean === '/creator-dashboard') {
    return { view: 'mentor-dashboard-view' };
  }
  if (clean === '/login' || clean === '/signin' || clean === '/pages/myshine/login') {
    return { view: 'login-view' };
  }
  return { view: 'dashboard-view' };
};

const AppMain: React.FC = () => {
  const { 
    currentView, 
    currentUser,
    navigate, 
    experts,
    selectedExpert, 
    selectExpertById,
    isBookingModalOpen, 
    setIsBookingModalOpen,
    isCvSyncModalOpen,
    setIsCvSyncModalOpen,
    bookingDraft,
    setBookingDraft,
    setSearchQuery
  } = useApp();

  const [showTopNotice, setShowTopNotice] = useState<boolean>(true);

  useEffect(() => {
    const route = pathToView(window.location.pathname);
    if (route.view !== currentView) {
      navigate(route.view, window.location.pathname);
    }
    if (route.expertId) {
      selectExpertById(route.expertId);
    }

    const onPopState = () => {
      const r = pathToView(window.location.pathname);
      navigate(r.view, window.location.pathname);
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

      {/* Shine Jobs Top Notice Bar (ONLY ON SHINE JOBS PORTAL - NEVER ON PEERPATH) */}
      {showTopNotice && 
       ['dashboard-view', 'jobs-view', 'profile-view'].includes(currentView) && 
       currentUser?.role === 'candidate' && (
        <div className="myshine-top-notice-bar">
          <div className="notice-inner-flex">
            <div className="notice-left-text">
              <span className="notice-doc-icon">📄</span>
              <p>Your Profile was last updated <strong>almost a year ago</strong></p>
            </div>
            <div className="notice-right-actions">
              <button className="btn-purple-notice" onClick={() => setIsCvSyncModalOpen(true)}>
                Update Profile
              </button>
              <button className="btn-close-notice" onClick={() => setShowTopNotice(false)} title="Dismiss">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView !== 'login-view' && (
        <Header
          currentView={currentView}
          onNavigate={navigate}
          onOpenCreatorWizard={() => {}}
          onSearch={handleGlobalSearch}
        />
      )}

      <main className="app-main-viewport" style={{ minHeight: currentView === 'login-view' ? '100vh' : '80vh' }}>
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

        {currentView === 'jobs-view' && (
          <JobsView
            onNavigate={navigate}
            onSelectExpert={handleSelectExpert}
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

        {currentView === 'community-view' && (
          <CommunityView />
        )}

        {currentView === 'mentor-dashboard-view' && (
          <MentorDashboardView />
        )}

        {currentView === 'login-view' && (
          <LoginView />
        )}
      </main>

      {currentView !== 'live-call-view' && currentView !== 'login-view' && <Footer />}

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
