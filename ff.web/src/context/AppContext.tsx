import React, { createContext, useEffect, useState } from "react";

// Define the shape of your context value
interface AppContextValue {
  // Add your context properties and methods here
}

type PropTypes = {
  children: React.ReactNode;
};

// Create the AppContext
export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

// Create the AppContextProvider component
export const AppContextProvider: React.FC<PropTypes> = ({
  children,
}: PropTypes) => {
  useEffect(() => {
    if (localStorage.getItem("profileData")) {
      setIsOnboardingComplete(true);
    }
  }, []);

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // You can define your state and methods here

  // Provide the context value to the children components
  return (
    <AppContext.Provider
      value={{ isOnboardingComplete, setIsOnboardingComplete }}
    >
      {children}
    </AppContext.Provider>
  );
};
