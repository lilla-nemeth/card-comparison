import type { Meta, StoryObj } from "@storybook/react";

import FixFoodLogo from "./FixFoodLogo";

const meta = {
  component: FixFoodLogo,
} satisfies Meta<typeof FixFoodLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
