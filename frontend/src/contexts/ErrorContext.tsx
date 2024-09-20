// frontend\src\contexts\ErrorContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface ErrorContextType {
  error: string | null;
  setError: (message: string | null) => void;
}

export const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = (message: string | null) => {
    if (message) {
      console.error(message); // Log the error to the console
    }
    setErrorState(message);
  };

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
