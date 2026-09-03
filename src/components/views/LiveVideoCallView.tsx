import React, { useState, useEffect, useRef } from 'react';
import { Clock, FileText, ShieldCheck, User, X, Zap, Award, Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Camera, CheckCircle2 } from 'lucide-react';
import { Expert } from '../../types';

interface LiveVideoCallViewProps {
  expert: Expert;
  onEndCall: () => void;
}

export const LiveVideoCallView: React.FC<LiveVideoCallViewProps> = ({
  expert,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState<number>(28 * 60 + 15);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [rubricApproved, setRubricApproved] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const enableWebcam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const userMediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          webcamStreamRef.current = userMediaStream;
          if (localVideoRef.current && !isSharingScreen) {
            localVideoRef.current.srcObject = userMediaStream;
            localVideoRef.current.play().catch(() => {});
          }
          setCameraError(false);
        }
      } catch (err) {
        setCameraError(true);
      }
    };

    enableWebcam();

    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    const nextState = !isVideoOff;
    setIsVideoOff(nextState);
    if (webcamStreamRef.current) {
      const videoTrack = webcamStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !nextState;
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsSharingScreen(false);
      setTimeout(() => {
        if (localVideoRef.current && webcamStreamRef.current) {
          localVideoRef.current.srcObject = webcamStreamRef.current;
          localVideoRef.current.play().catch(() => {});
        }
      }, 100);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
          });
          screenStreamRef.current = displayStream;
          setIsSharingScreen(true);

          displayStream.getVideoTracks()[0].onended = () => {
            setIsSharingScreen(false);
            if (localVideoRef.current && webcamStreamRef.current) {
              localVideoRef.current.srcObject = webcamStreamRef.current;
            }
          };

          setTimeout(() => {
            if (screenVideoRef.current) {
              screenVideoRef.current.srcObject = displayStream;
              screenVideoRef.current.play().catch(() => {});
            }
          }, 100);
        }
      } catch (err) {
      }
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `00:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEnd = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    onEndCall();
  };

  return (
    <div className="video-call-fullscreen-wrapper">
      <div className="call-top-bar">
        <div className="call-title-left">
          <span className="call-recording-pill"><span className="red-pulse-dot"></span> REC</span>
          <span className="call-session-title">
            {expert.domain} Guidance with <strong>{expert.name}</strong> ({expert.company})
          </span>
        </div>
        
        <div className="call-timer-center">
          <Clock size={16} /> <span>{formatTimer(seconds)}</span>
        </div>
        
        <div className="call-right-tools">
          <button className="btn-call-tool" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <FileText size={15} /> Pre-loaded CV Gap Report
          </button>
        </div>
      </div>

      <div className="call-main-stage">
        <div className="video-feed-box mentor-feed">
          <img src={expert.avatar} alt="Mentor Live Feed" className="feed-bg-img" />
          <div className="feed-user-label">
            <ShieldCheck size={16} className="text-brand-gold" /> {expert.name} ({expert.company})
          </div>
          <div className="sound-wave-indicator">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>

        <div className="video-feed-box candidate-feed">
          {isSharingScreen ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="feed-bg-img feed-screen-stream"
                style={{ objectFit: 'contain' }}
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#2563EB', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ScreenShare size={12} /> Sharing Your Screen / Resume
              </div>
            </div>
          ) : isVideoOff ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f172a', color: '#94a3b8', gap: '10px' }}>
              <VideoOff size={48} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Camera is turned off</span>
            </div>
          ) : cameraError ? (
            <>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80" 
                alt="Candidate Feed" 
                className="feed-bg-img" 
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', color: '#FFD200', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Camera size={12} /> Allow Camera Permission in Browser
              </div>
            </>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="feed-bg-img feed-webcam-stream"
              style={{ transform: 'scaleX(-1)', objectFit: 'cover' }}
            />
          )}

          <div className="feed-user-label">
            <User size={15} /> You (Prakash Kumar - Candidate)
          </div>
        </div>

        {isDrawerOpen && (
          <div className="cv-gap-drawer">
            <div className="drawer-header">
              <h3><Zap size={16} /> Pre-Loaded Mentee Gap Analysis</h3>
              <button className="btn-icon-xs" onClick={() => setIsDrawerOpen(false)}><X size={18} /></button>
            </div>
            <div className="drawer-body">
              <div className="candidate-brief">
                <strong>Prakash Kumar</strong> • 3 Yrs Experience ➔ Target: {expert.domain}
              </div>
              <div className="rubric-checklist-box">
                <span className="rubric-subtitle">Mentor Evaluation Rubric (Auto-Generated by Shine AI):</span>
                <label className="rubric-item">
                  <input type="checkbox" defaultChecked />
                  <span>1. Core {expert.domain} discovery & client communication</span>
                </label>
                <label className="rubric-item">
                  <input type="checkbox" defaultChecked />
                  <span>2. Production scaling & technical problem-solving</span>
                </label>
                <label className="rubric-item">
                  <input type="checkbox" defaultChecked />
                  <span>3. Enterprise culture fit & leadership readiness</span>
                </label>
              </div>
              
              <button 
                className="btn-shine-gold w-100 mt-3" 
                onClick={() => { setRubricApproved(true); alert('Rubric verified! Peer Badge will be issued upon call end.'); }}
              >
                <Award size={16} /> {rubricApproved ? 'Badge Approved ✓' : 'Approve Peer-Verified Badge'}
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="call-bottom-controls-bar">
        <div className="call-ctrl-group">
          <button 
            className={`call-action-btn ${isMuted ? 'btn-active-muted' : ''}`} 
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            <div className="btn-icon-circle">
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </div>
            <span className="btn-label">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          
          <button 
            className={`call-action-btn ${isVideoOff ? 'btn-active-muted' : ''}`} 
            onClick={toggleCamera}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            <div className="btn-icon-circle">
              {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
            </div>
            <span className="btn-label">{isVideoOff ? 'Turn On' : 'Stop Video'}</span>
          </button>
          
          <button 
            className={`call-action-btn ${isSharingScreen ? 'btn-active-screenshare' : ''}`} 
            onClick={toggleScreenShare}
            title={isSharingScreen ? 'Stop Screen Sharing' : 'Share Screen / Resume'}
          >
            <div className="btn-icon-circle">
              <ScreenShare size={18} />
            </div>
            <span className="btn-label">{isSharingScreen ? 'Stop Share' : 'Share Screen'}</span>
          </button>
          
          <button 
            className={`call-action-btn ${isDrawerOpen ? 'btn-active-drawer' : ''}`} 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            title="Mentee Gap Sheet"
          >
            <div className="btn-icon-circle">
              <FileText size={18} />
            </div>
            <span className="btn-label">CV Gap Sheet</span>
          </button>

        </div>
        
        <div className="call-end-group">
          <button className="btn-end-call-prominent" onClick={handleEnd}>
            <PhoneOff size={18} /> End Session
          </button>
        </div>

      </div>
    </div>
  );
};
