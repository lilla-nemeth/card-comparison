interface FormData {
  goals: string[];
  sex: string;
  age: string;
  height: string;
  currentWeight: string;
  goalWeight: string;
  motivation: string;
  activityLevel?: string;
  mindset: string;
  speed: string;
  dietPlan: string;
  pastExperience: string;
  format: string;
  allergies: string[];
  dislikes: string[];
  cuisinePreferences: FormDataCuisinePreferences;
  pantry: string;
  cookingSkills: string;
}

interface FormDataCuisinePreferences {
  [key: string]: unknown;
}

/* Flavour Flow */
interface FlavourFlowDataset {
  [key: string]: FlavourFlowChoices[];
}

interface FlavourFlowChoices {
  [key: string]: FlavourFlowChoice;
}

interface FlavourFlowChoice {
  title: string;
  image: string;
}

interface Meal {
  id: string;
  title: string;
  elo: number;
  image: string;
  name?: string;
}

export type {
  FormData,
  FormDataCuisinePreferences,
  FlavourFlowDataset,
  FlavourFlowChoices,
  FlavourFlowChoice,
  Meal,
};
