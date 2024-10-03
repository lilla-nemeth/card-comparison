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

export type { FormData, FormDataCuisinePreferences };
