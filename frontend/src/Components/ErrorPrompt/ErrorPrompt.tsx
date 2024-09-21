// frontend\src\Components\ErrorPrompt\ErrorPrompt.tsx

import React, { useContext } from 'react';
import './ErrorPrompt.css';
import { ErrorContext } from '../../contexts/ErrorContext';

const ErrorPrompt = () => {
  const { error, setError } = useContext(ErrorContext);

  if (!error) return null;

  // Handle click on div (to stop propagation)
  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent click event from bubbling up
  };

  // Handle button click to close the error
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setError(null); // Close the error prompt
  };

  return (
    <div className="error-prompt" onClick={handleDivClick}>
      <div className="error-message">
        <p>{error}</p>
        <button onClick={handleButtonClick}>Close</button>
      </div>
    </div>
  );
};

export default ErrorPrompt;