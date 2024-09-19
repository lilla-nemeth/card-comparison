import type { Meta, StoryObj } from "@storybook/react";

import Home from "./Home";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: Home,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/home']}> {/* Set the initial URL if needed */}
        <Story />
      </MemoryRouter>
    )
  ],
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
