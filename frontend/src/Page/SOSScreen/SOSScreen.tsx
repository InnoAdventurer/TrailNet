// frontend/src/Page/SOSScreen/SOSScreen.tsx

import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SOSScreen.css';
import { ErrorContext } from '../../contexts/ErrorContext';
import sosSound from '../../assets/help.mp3';

let sosInterval: NodeJS.Timeout | null = null;
let wakeLock: WakeLockSentinel | null = null;

function SOSScreen() {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const [countdown, setCountdown] = useState<number>(5);
  const [sosStarted, setSosStarted] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(new Audio(sosSound)); 

  const startSOSActions = () => {
    playSosSound();
    flashTorch();
    keepScreenAwake();
  };

  const stopSOSActions = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (sosInterval) clearInterval(sosInterval);

    if (wakeLock) {
      wakeLock.release().catch(() => {});
      wakeLock = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop camera and torch
      setStream(null);
    }

    // Clear the error message upon exiting
    setError(null);
  };

  const playSosSound = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.loop = true;
      audioRef.current.play().catch((err) =>
        setError('Error playing sound. Please ensure your browser allows it.')
      );
    }
  };

  const requestCameraAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Failed to access the camera. Torch will not work.');
      return null;
    }
  };

  const flashTorch = async () => {
    const mediaStream = await requestCameraAccess();
    if (!mediaStream) return;
  
    const track = mediaStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any; // Cast to 'any' to avoid TypeScript errors
  
    if (capabilities.torch) {
      let toggle = false;
      sosInterval = setInterval(() => {
        toggle = !toggle;
        track
          .applyConstraints({
            advanced: [{ torch: toggle } as MediaTrackConstraintSet], // Type casting to satisfy TypeScript
          })
          .catch((err) => console.error('Error toggling torch:', err));
      }, 500);
    } 
  };

  const keepScreenAwake = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.error('Screen wake Error:', err);
      }
    } else {
      setError('Screen wake lock is not supported on this device.')
    }
  };

  const handleStopSOS = () => {
    stopSOSActions();
    navigate('/emergencyscreen');
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          setSosStarted(true);
          startSOSActions();
        }
        return prevCount - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(countdownInterval);
      stopSOSActions();
    };
  }, []);

  return (
    <div className="sos-screen-container" onClick={handleStopSOS}>
      {!sosStarted ? (
        <>
          <h2>SOS Activation in {countdown}...</h2>
          <p>Please allow camera access to enable torch mode.</p>
          <p>Click anywhere to cancel and exit.</p>
        </>
      ) : (
        <>
          <h2>SOS Activated</h2>
          <p>Click anywhere to stop the SOS signal and exit.</p>
        </>
      )}
    </div>
  );
}

export default SOSScreen;