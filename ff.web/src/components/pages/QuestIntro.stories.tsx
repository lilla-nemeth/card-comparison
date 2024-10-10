import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";

import worker from "@vuo/mock/browser";
import questData from "@vuo/mock/short_quest.json";
import playerQuestData from "@vuo/mock/short_player_quest.json";
import QuestIntro from "./QuestIntro";

const meta: Meta<typeof QuestIntro> = {
  title: "Pages/QuestIntro",
  component: QuestIntro,
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
type Story = StoryObj<typeof QuestIntro>;

export const DefaultQuestCard: Story = {
  decorators: [
    (Story) => {
      worker.use(
        http.get(/quests\/.+/, () => HttpResponse.json(questData)),
        http.post(/playerQuests/, () => HttpResponse.json(playerQuestData)),
      );
      return <Story />;
    },
  ],
};

export const FailedQuestCard: Story = {
  decorators: [
    (Story) => {
      worker.use(
        http.get(
          /quests\/.+/,
          () =>
            new HttpResponse(null, {
              status: 404,
              statusText: "How bout dem apples",
            }),
        ),
      );
      return <Story />;
    },
  ],
};
