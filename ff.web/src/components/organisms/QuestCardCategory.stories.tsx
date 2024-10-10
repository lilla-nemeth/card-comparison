import type { Meta, StoryObj } from "@storybook/react";
import type { TypeWithDeepControls } from "storybook-addon-deep-controls";

import getMockRecipeObject from "@vuo/mock/Mock";
import QuestCardCategory from "./QuestCardCategory";

const meta: Meta<typeof QuestCardCategory> = {
  title: "Organisms/QuestCardCategory",
  component: QuestCardCategory,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof QuestCardCategory>;

const quests = Array.from({ length: 14 }).map(() => getMockRecipeObject());

export const DefaultQuestCardCategory: TypeWithDeepControls<Story> = {
  args: {
    quests,
    category: 'Spaghetti'
  }
}