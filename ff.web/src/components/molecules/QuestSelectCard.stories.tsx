import type { Meta, StoryObj } from "@storybook/react";
import type { TypeWithDeepControls } from "storybook-addon-deep-controls";

import getMockRecipeObject from "@vuo/mock/Mock";
import QuestSelectCard from "./QuestSelectCard";

const meta: Meta<typeof QuestSelectCard> = {
  title: "Molecules/QuestSelectCard",
  component: QuestSelectCard,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof QuestSelectCard>;


export const DefaultQuestSelectCard: TypeWithDeepControls<Story> = {
  args: {
    quest: getMockRecipeObject()
  }
}