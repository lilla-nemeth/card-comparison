import type { Meta, StoryObj } from "@storybook/react";

import ShoppingCart from "./ShoppingCart";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: ShoppingCart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/shopping-cart']}> 
        <Story />
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof ShoppingCart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
