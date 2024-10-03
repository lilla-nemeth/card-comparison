interface FormData {
  goals: FormDataGoals["goal"];
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
  allergies: FormDataAllergies[];
  dislikes: FormDataDislikes[];
  cuisinePreferences: FormDataCuisinePreferences;
  pantry: string;
  cookingSkills: string;
}

interface FormDataGoals {
  goal: string[];
}

interface FormDataAllergies {
  allergies: string;
}

interface FormDataDislikes {
  dislike: string[];
}

interface FormDataCuisinePreferences {
  [key: string]: unknown;
}

export type {
  FormData,
  FormDataGoals,
  FormDataAllergies,
  FormDataDislikes,
  FormDataCuisinePreferences,
};
