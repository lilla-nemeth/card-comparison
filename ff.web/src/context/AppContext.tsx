import React, { createContext, useEffect, useReducer } from "react";
import { AppContextValue } from "@vuo/types/contextProps";

type PropTypes = {
  children: React.ReactNode;
};

// Create the AppContext
export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

// Define the initial state interface
interface State {
  isOnboardingComplete: boolean;
}

// Set the initial state
const initialState: State = {
  isOnboardingComplete: false,
};

// Define action types
type Action = { type: "SET_ONBOARDING_COMPLETE"; payload: boolean };

// Define the reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ONBOARDING_COMPLETE":
      return { ...state, isOnboardingComplete: action.payload };
    default:
      return state;
  }
}

// Create the AppContextProvider component
export const AppContextProvider: React.FC<PropTypes> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to update the onboarding status
  const setIsOnboardingComplete = (value: boolean) => {
    dispatch({ type: "SET_ONBOARDING_COMPLETE", payload: value });
  };

  useEffect(() => {
    if (localStorage.getItem("profileData")) {
      setIsOnboardingComplete(true);
    }
  }, []);

  // Provide the context value to the children components
  return (
    <AppContext.Provider
      value={{
        isOnboardingComplete: state.isOnboardingComplete,
        setIsOnboardingComplete,
        // Add other state and methods here
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
