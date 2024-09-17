import type { Meta, StoryObj } from "@storybook/react";

import Login from "./Login";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: Login,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/login']}> {/* Set the initial URL if needed */}
        <Story />
      </MemoryRouter>
    )
  ],
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
