import type { Meta, StoryObj } from "@storybook/react";
import ChoiceUI from "./ChoiceUI";
import { Meal } from "../pages/FlavourFlowPage";
import CauliflowerImage from "../../../public/images/CauliflowerRice.webp";
import Day1BaconImage from "../../../public/images/1.webp";
import Day2KetoImage from "../../../public/images/2.webp";

const meta: Meta<typeof ChoiceUI> = {
  component: ChoiceUI,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ChoiceUI>;

const sampleMeals: Meal[] = [
  { id: "1", title: "Meal 1", elo: 1200, image: CauliflowerImage },
  { id: "2", title: "Meal 2", elo: 1200, image: Day1BaconImage },
  { id: "3", title: "Meal 3", elo: 1200, image: Day2KetoImage },
];

export const DefaultChoiceUI: Story = {
  args: {
    meals: sampleMeals,
    handleChoice: (winner: Meal, loser: Meal) => {
      console.log(`Winner: ${winner.name}, Loser: ${loser.name}`);
    },
  },
};
