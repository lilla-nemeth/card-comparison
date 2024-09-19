import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from 'react-router-dom';
import Navbar from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',  // Adjust the title as necessary
  component: Navbar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/home']}>
        <Story />
      </MemoryRouter>
    )
  ],
  parameters: {
   
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
