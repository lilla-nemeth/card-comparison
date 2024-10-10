import type { Meta, StoryObj } from "@storybook/react";

import MealMap from "./MealMap";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: MealMap,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/meal-map']}>
        <Story />
      </MemoryRouter>
    )
  ],
} satisfies Meta<typeof MealMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
