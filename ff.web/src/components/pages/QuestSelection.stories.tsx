import type { Meta, StoryObj } from "@storybook/react";
import type { TypeWithDeepControls } from "storybook-addon-deep-controls";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";

import worker from "@vuo/mock/browser";
import questData from "@vuo/mock/short_quest.json";
import QuestSelection from "./QuestSelection";

const meta: Meta<typeof QuestSelection> = {
  title: "Pages/QuestSelection",
  component: QuestSelection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter
        initialEntries={[`/${import.meta.env.BASE_URL}/quests/123aaa/intro`]}
      >
        <Routes>
          <Route
            path={`/${import.meta.env.BASE_URL}/quests/:id/intro`}
            element={<Story />}
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuestSelection>;
export const DefaultQuestSelection: TypeWithDeepControls<Story> = {
  decorators: [
    (Story) => {
      worker.use(
        http.get(/quests/, () =>
          HttpResponse.json(Array.from({ length: 3 }).map(() => questData)),
        ),
      );
      return <Story />;
    },
  ],
};
