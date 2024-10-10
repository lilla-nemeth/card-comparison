import { Step } from "./Step";
import { Resource } from "./Resource";

export enum Type {
  Experiment = "Experiment",
  RepCount = "RepCount",
  Tip = "Tip",
  Narration = "Narration",
  Addition = "Addition",
  Training = "Training"
}

export interface MiniGame {
  id: string;
  icon?: string;
  name: string;         // Name of the minigame, :Spaghetti Science
  text: string;
  type: string;  // Type of the minigame, <Experiment|RepCount|Tip|Narration|Addition|Training>
  mainColor?: string;
  requirements: Requirements;
  question: Question;
  hypothesis?: Hypothesis;
  experiment?: Experiment;
  result?: Result;
  rep_count?: RepCount;
  tip?: Tip;
  additions?: Additions;
};

export interface Requirements {
  aspiration?: string;  // Optional, Required aspiration, :ballet_superstar
  downtime?: number;    // Optional, Required downtime, :300
  ingredient?: string;  // Optional, Required ingredient :spaghetti
  skill?: string;        // Optional, Required skill, :seasoning
}

export interface Question {
  title: string;      // Question title, :Wanna throw some spaghetti at the wall?
  subtitle?: string;  // Optional, Question subtitle, :It's for... science!
}

export interface Hypothesis {
  title: string;          // Hypothesis title, :Make a prediction on how many...
  minimum_value: number;  // Hypothesis minimum value, :60
  maximum_value: number;  // Hypothesis maximum value, :600
  step: number            // What is the step between min and max values, :15
}

export interface Experiment {
  title: string;        // Experiment title, :Pick spaghetti from the boiling water..
  count_title: string;  // Count title with format, :Spaghetti's thrown
}

export interface Result {
  title: string;          // Result title, :Spaghetti's thrown
  success_title: string;  // Success title, :Spaghetti's stuck
  failure_title: string;   // Failured title, :Spaghetti's didn't stuck
}

export interface RepCount {
  title: string;       // Title for the rep count activity
  subtitle: string;    // Subtitle for the rep count activity
  rep_title: string;   // Title to display the count of reps done
  timer_title: string; // Title to display the remaining time
}

export interface Tip {
  step: Step;
}

export interface Additions {
  add_steps: {
    steps: Step[];
    resources: Resource[]
  };
}