import type { Meta, StoryObj } from "@storybook/react";
import ChoiceUI from "./ChoiceUI";

import CauliflowerImage from "../../../public/images/CauliflowerRice.webp";
import Day1BaconImage from "../../../public/images/1.webp";
import Day2KetoImage from "../../../public/images/2.webp";
import { FlavourFlowMeal } from "@vuo/types/dataTypes";

const meta: Meta<typeof ChoiceUI> = {
  component: ChoiceUI,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ChoiceUI>;

const sampleMeals: FlavourFlowMeal[] = [
  {
    id: "1",
    title: "Sweet",
    elo: 0,
    image: CauliflowerImage,
    name: "Cauliflower",
    category: "Taste",
  },
  {
    id: "2",
    title: "Savory",
    elo: 0,
    image: Day1BaconImage,
    name: "Bacon",
    category: "Taste",
  },
  {
    id: "3",
    title: "Quick and easy",
    elo: 0,
    image: Day2KetoImage,
    category: "Time & Complexity",
  },
];

export const DefaultChoiceUI: Story = {
  args: {
    meals: sampleMeals,
    handleChoice: (winner: FlavourFlowMeal, loser: FlavourFlowMeal) => {
      console.log(`Winner: ${winner.name}, Loser: ${loser.name}`);
    },
  },
};
