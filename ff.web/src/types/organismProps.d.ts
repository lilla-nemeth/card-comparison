interface ChoiceUIProps {
  handleChoice: (winner: Meal, loser: Meal) => void;
  meals: Meal[];
}

export type { ChoiceUIProps };
