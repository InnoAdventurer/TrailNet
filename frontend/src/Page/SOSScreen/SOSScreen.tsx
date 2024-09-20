// frontend/src/Page/SOSScreen/SOSScreen.tsx

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SOSScreen.css';
import { ErrorContext } from '../../contexts/ErrorContext';

let sosInterval: NodeJS.Timeout | null = null;
let wakeLock: WakeLockSentinel | null = null;

function SOSScreen() {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const [countdown, setCountdown] = useState<number>(5);
  const [sosStarted, setSosStarted] = useState<boolean>(false); // Track SOS state

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    // Start the countdown
    countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
            clearInterval(countdownInterval); // Stop the countdown at 1
            setSosStarted(true); // SOS has started after countdown
            startSOSActions(); // Start SOS actions after countdown ends
        }
        return prevCount - 1;
      });
    }, 1000);

    // Start SOS actions
    const startSOSActions = () => {
        playSosSound();
        flashTorch();
        keepScreenAwake();
    };

    // Stop SOS actions
    const stopSOSActions = () => {
        // Stop the SOS sound
        const audio = document.querySelector('audio');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Stop the torch flash
        if (sosInterval) {
            clearInterval(sosInterval);
        }

        // Release the wake lock
        if (wakeLock !== null) {
            wakeLock.release();
            wakeLock = null;
        }
    };

    // Function to play the SOS sound
    const playSosSound = () => {
        const audio = new Audio('/sounds/sos-sound.mp3'); // TODO: Place SOS sound file to DB/backend
        audio.loop = true; // Loop the sound
        audio.play().catch((err) => setError('Error playing sound. Please ensure your browser allows it.'));
    };

    // Function to flash the torch (if supported)
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
                track.applyConstraints({
                  advanced: [{ torch: toggle } as any],
                });
              }, 500); // Flash every 500ms
            } else {
              setError('Torch is not supported on this device.');
            }
          } else {
            setError('Torch/Flashlight is not supported on this device.');
          }
        } else {
          setError('Torch/Flashlight is not supported on this device.');
        }
      } catch (err) {
        setError('An error occurred while trying to access the torch.');
        console.error('Torch Error:', err);
      }
    };

    // Function to keep the screen awake
    const keepScreenAwake = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          setError('Error keeping the screen awake.');
        }
      } else {
        setError('Screen wake lock is not supported on this device.');
      }
    };

    // Cleanup function to stop everything when component is unmounted or user clicks to stop
    const handleStopSOS = (event: MouseEvent) => {
      // Ignore clicks on the error prompt
      const targetElement = event.target as HTMLElement;
      if (targetElement.closest('.error-prompt')) return; // Ignore clicks on the error prompt

      stopSOSActions();
      navigate('/emergencyscreen'); // Navigate back to emergency screen
    };

    // Attach click event listener to stop SOS
    document.addEventListener('click', handleStopSOS);

    // Cleanup on unmount
    return () => {
      clearInterval(countdownInterval);
      stopSOSActions();
      document.removeEventListener('click', handleStopSOS);
    };
  }, [navigate, setError]);

  return (
    <div className="sos-screen-container">
      {!sosStarted ? (
        <>
          <h2>SOS Activation in {countdown}...</h2>
          <p>Click anywhere to cancel.</p>
        </>
      ) : (
        <>
          <h2>SOS Activated</h2>
          <p>Click anywhere to stop the SOS signal.</p>
        </>
      )}
    </div>
  );
}

export default SOSScreen;
