import type { Meta, StoryObj } from "@storybook/react";

import Quest from "./Quest";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: Quest,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/quest']}>
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof Quest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
