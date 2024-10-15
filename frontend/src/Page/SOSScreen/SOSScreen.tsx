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
      wakeLock.release();
      wakeLock = null;
    }
  };

  const playSosSound = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.loop = true;
      audioRef.current.play().catch((err) =>
        console.error('Error playing sound. Please ensure your browser allows it.')
      );
    }
  };

  const flashTorch = async () => {
    try {
      if ('mediaDevices' in navigator) {
        const supportsTorch = (navigator.mediaDevices.getSupportedConstraints() as any).torch;
        if (supportsTorch) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities() as any;

          if (capabilities.torch) {
            let toggle = false;
            sosInterval = setInterval(() => {
              toggle = !toggle;
              track.applyConstraints({ advanced: [{ torch: toggle } as any] });
            }, 500);
          }
        }
      }
    } catch (err) {
      console.error('Torch Error:', err);
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
      console.error('Screen wake lock is not supported on this device.');
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