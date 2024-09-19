import type { Meta, StoryObj } from "@storybook/react";

import NotFoundPage from "./NotFoundPage";
import { MemoryRouter } from "react-router-dom";

const meta = {
  component: NotFoundPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/not-found']}>
        <Story />
      </MemoryRouter>
    )
  ],
} satisfies Meta<typeof NotFoundPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
