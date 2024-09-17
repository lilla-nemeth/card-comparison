import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from "./BottomNavigation";

const meta: Meta<typeof BottomNavigation> = {
  title: 'Components/BottomNavigation', // Adjust the title as necessary
  component: BottomNavigation,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/initial']}> {/* Set the initial URL if needed */}
        <Story />
      </MemoryRouter>
    )
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};