import type { Meta, StoryObj } from "@storybook/react";
import {
  BrowserRouter
} from 'react-router-dom'

import QuestPlay from "./QuestPlay";

const meta: Meta<typeof QuestPlay> = {
  title: "Pages/QuestPlay",
  component: QuestPlay,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof QuestPlay>;

export const DefaultQuestCard: Story = { }