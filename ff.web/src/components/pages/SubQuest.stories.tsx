import type { Meta, StoryObj } from "@storybook/react";

import SubQuest from "./SubQuest";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: SubQuest,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/subquest']}> 
        <Story />
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof SubQuest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
