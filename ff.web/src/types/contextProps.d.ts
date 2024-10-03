type AppContextPropTypes = {
  children: React.ReactNode;
};

// Define the shape of your context value
interface AppContextValue {
  // Add your context properties and methods here
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: React.Dispatch<React.SetStateAction<boolean>>;
}



export type { AppContextPropTypes, AppContextValue };
