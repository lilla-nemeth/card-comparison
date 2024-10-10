import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";

import worker from "@vuo/mock/browser";
import mockData from "@vuo/mock/short_player_quest.json";

import QuestOutro from "./QuestOutro";

const meta: Meta<typeof QuestOutro> = {
  title: "Pages/QuestOutro",
  component: QuestOutro,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter
        initialEntries={[
          `/${import.meta.env.BASE_URL}/playerQuests/:111aaa/outro`,
        ]}
      >
        <Routes>
          <Route
            path={`/${import.meta.env.BASE_URL}/playerQuests/:id/outro`}
            element={<Story />}
          />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuestOutro>;

export const DefaultQuestCard: Story = {
  decorators: [
    (Story) => {
      worker.use(
        http.get(/playerQuests\/.+/, () => HttpResponse.json(mockData)),
      );
      return <Story />;
    },
  ],
};
