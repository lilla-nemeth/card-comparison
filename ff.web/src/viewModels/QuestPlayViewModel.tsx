import { action, computed, makeObservable, runInAction } from "mobx";
import TagManager from "react-gtm-module";

import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import sessionDataStore from "@vuo/stores/SessionDataStore";
import webSocketStore from "@vuo/stores/WebSocketStore";
import playerQuestDataStore from "@vuo/stores/PlayerQuestDataStore";
import EventBus, { PlayerQuestDataChangedParameters } from "@vuo/utils/EventBus";
import { PlayerQuest, PlayerQuestState, PlayerQuestStep, StepState } from "@vuo/models/PlayerQuest";

class QuestPlayViewModel extends BaseViewModel {
  private webSocketStore = webSocketStore;
  private playerQuestDataStore = playerQuestDataStore
  private sessionDataStore = sessionDataStore

  playerQuestId?: string

  constructor(id: string) {
    super()
    makeObservable(this, {
      ...BaseViewModelProps,
      updateStepState: action,
      playerQuest: computed,
      currentStep: computed,
      isCurrentUserHost: computed,
    })
    this.loadData(id)
    this.playerQuestId = id

    const playerQuestDataReceived = (params: PlayerQuestDataChangedParameters) => {
      // TODO: Host instance have to do some merge magic so that previous changes are not overwritten
      runInAction(() => {
        this.playerQuestDataStore.addPlayerQuest(params.playerQuest)
      })
    };
    // TODO: This will be called when server send message to everyone in the channel
    // TODO: Maybe it can send updatePlayerquest message only to other channel users?
    EventBus.on("playerQuestDataChanged", playerQuestDataReceived);
  }

  get playerQuest(): PlayerQuest | undefined {
    if (!this.playerQuestId) { return undefined }

    return this.playerQuestDataStore.getPlayerQuestById(this.playerQuestId)
  }

  get isCurrentUserHost() {
    return this.webSocketStore.isCurrentUserHost()
  }

  get activeMPSession() {
    return this.webSocketStore.activeSession
  }

  get currentUser() {
    return this.sessionDataStore.user
  }

  async loadData(id: string): Promise<void> {
    if (this.webSocketStore.isCurrentUserHost() || !this.webSocketStore.activeSession) {
      // TODO: if offline, just get from PlayerQuestDataStore
      const pq = await this.fetchData<PlayerQuest>({ url: `v1/playerQuests/${id}` })
      if (pq) {
        runInAction(() => {
          this.playerQuestDataStore.addPlayerQuest(pq)
          if (!this.webSocketStore.activeSession && !this.currentStep && this.playerQuest?.recipe.steps[0]) {
            this.claimStep(this.playerQuest?.recipe.steps[0].id)
          }
        })
      } else {
        // TODO: Error for not found
      }
    }
  }

  get currentStep(): PlayerQuestStep | undefined {
    if (!this.playerQuest) return undefined;

    const { recipe } = this.playerQuest
    return recipe.steps.find(playerStep => playerStep.claimedBy?.id === webSocketStore.currentUserId && (playerStep.state !== StepState.completed))
  }

  get currentRecipeProgress(): { max: number, value: number } {
    if (!this.playerQuest) return { max: 0, value: 0 };

    const max = this.playerQuest.recipe.steps.length
    const value = this.playerQuest.recipe.steps.filter(s =>
      (s.state === StepState.completed || s.state === StepState.skipped)).length
    return { max, value }
    return { max: 10, value: 5 }
  }

  async claimStep(stepId: string) {
    if (!this.playerQuest) { return }
    const { steps } = this.playerQuest.recipe;

    if (this.webSocketStore.isCurrentUserHost() || !this.webSocketStore.activeSession) {
      this.patchData<PlayerQuest>(`v1/playerQuests/${this.playerQuest.id}/${stepId}/claim`, {})
    }
    const currentIndex = steps.findIndex((s: PlayerQuestStep) => s.id === stepId);
    const updatedSteps = [...steps];

    updatedSteps[currentIndex] = { ...updatedSteps[currentIndex], claimedBy: this.sessionDataStore.user };
    const updatedPlayerQuest: PlayerQuest = {
      ...this.playerQuest,
      recipe: { ...this.playerQuest.recipe, steps: updatedSteps }
    }
    if (this.webSocketStore.activeSession) {
      this.webSocketStore.updatePlayerQuest(updatedPlayerQuest)
    } else {
      runInAction(() => {
        this.playerQuestDataStore.addPlayerQuest(updatedPlayerQuest)
      })
    }
  }

  async acceptChallenge(stepId: string) {
    if (!this.playerQuest) { return }
    const { steps } = this.playerQuest.recipe;

    if (this.isCurrentUserHost || !this.webSocketStore.activeSession) {
      this.patchData<PlayerQuest>(`v1/playerQuests/${this.playerQuest.id}`, { stepId, state: StepState.challengeAccepted })
    }

    const currentIndex = steps.findIndex((s: PlayerQuestStep) => s.id === stepId);
    const updatedSteps = [...steps];
    updatedSteps[currentIndex] = {
      ...updatedSteps[currentIndex],
      state: StepState.challengeAccepted,
      subSteps: updatedSteps[currentIndex].subSteps?.map(ss => ({...ss, claimedBy: this.sessionDataStore.user }))
    };

    const updatedPlayerQuest: PlayerQuest = {
      ...this.playerQuest,
      finishedAt: undefined,
      state: PlayerQuestState.inProgress,
      recipe: { ...this.playerQuest.recipe, steps: updatedSteps }
    }
    if (this.webSocketStore.activeSession) {
      this.webSocketStore.updatePlayerQuest(updatedPlayerQuest)
    } else {
      runInAction(() => {
        this.playerQuestDataStore.addPlayerQuest(updatedPlayerQuest)
      })
    }
  }

  async updateSubStepState(stepId: string) {
    if (!this.playerQuest) { return }
    const { steps } = this.playerQuest.recipe;

    let foundSubStep: PlayerQuestStep | undefined;
    let mainStepIndex: number = -1;
    let subStepIndex: number = -1;

    // Find the main step and sub-step
    const foundStep = steps.find((s, index) => {
      const subStep = s.subSteps?.find((ss, subIndex) => {
        if (ss.id === stepId) {
          subStepIndex = subIndex;
          return true;
        }
        return false;
      });
      if (subStep) {
        foundSubStep = subStep;
        mainStepIndex = index;
        return true;
      }
      return false;
    });

    if (!foundStep || !foundSubStep) { return; }

    // Update the sub-step's state
    const updatedSubSteps = [...(foundStep.subSteps || [])];
    updatedSubSteps[subStepIndex] = { ...updatedSubSteps[subStepIndex], state: StepState.completed };

    // Create updated main step with the updated sub-steps
    const updatedSteps = [...steps];
    updatedSteps[mainStepIndex] = {
      ...foundStep,
      subSteps: updatedSubSteps
    };

    // Check if all sub-steps are completed or skipped
    const allSubStepsCompleted = updatedSubSteps.every(ss => ss.state === StepState.completed || ss.state === StepState.skipped);

    if (allSubStepsCompleted) {
      // Update the main step state to completed if all sub-steps are done
      updatedSteps[mainStepIndex] = { ...updatedSteps[mainStepIndex], state: StepState.completed };
    }

    // Update the player quest with the updated steps
    const updatedPlayerQuest: PlayerQuest = {
      ...this.playerQuest,
      recipe: { ...this.playerQuest.recipe, steps: updatedSteps }
    };

    const nextNotStartedIndex = updatedSteps.findIndex((s, index) => index > mainStepIndex && s.state === StepState.notStarted);

    // Update on the server or through WebSocket
    if (this.webSocketStore.activeSession) {
      this.webSocketStore.updatePlayerQuest(updatedPlayerQuest);
    } else {
      runInAction(() => {
        this.playerQuestDataStore.addPlayerQuest(updatedPlayerQuest);
        this.claimStep(updatedSteps[nextNotStartedIndex].id)
      });
    }
  }

  async updateStepState(stepId: string, state: StepState) {
    if (!this.playerQuest) { return }
    const { steps } = this.playerQuest.recipe;

    if (this.isCurrentUserHost || !this.webSocketStore.activeSession) {
      this.patchData<PlayerQuest>(`v1/playerQuests/${this.playerQuest.id}`, { stepId, state })
    }

    const currentIndex = steps.findIndex((s: PlayerQuestStep) => s.id === stepId);
    TagManager.dataLayer({
      dataLayer: {
        event: "task_completed",
        step: { ...steps[currentIndex] },
      },
    });
    EventBus.emit("stepCompleted", { step: steps[currentIndex], playerQuest: this.playerQuest });
    steps[currentIndex].skills.forEach(skill => {
      TagManager.dataLayer({
        dataLayer: {
          event: "skill_xp_gainer",
          skill: { ...skill },
        },
      });
    })

    const updatedSteps = [...steps];
    updatedSteps[currentIndex] = { ...updatedSteps[currentIndex], state };
    const nextNotStartedIndex = updatedSteps.findIndex((s, index) => index > currentIndex && s.state === StepState.notStarted);
    const allStepsCompleted = updatedSteps.every((s) => s.state === StepState.completed || s.state === StepState.skipped);
    const updatedPlayerQuest: PlayerQuest = {
      ...this.playerQuest,
      finishedAt: allStepsCompleted ? new Date() : undefined,
      state: allStepsCompleted ? PlayerQuestState.completed : PlayerQuestState.inProgress,
      recipe: { ...this.playerQuest.recipe, steps: updatedSteps }
    }
    if (this.webSocketStore.activeSession) {
      this.webSocketStore.updatePlayerQuest(updatedPlayerQuest)
    } else {
      runInAction(() => {
        this.playerQuestDataStore.addPlayerQuest(updatedPlayerQuest)
        this.claimStep(updatedSteps[nextNotStartedIndex].id)
      })
    }

    TagManager.dataLayer({
      dataLayer: {
        event: "task_started",
        step: { ...updatedSteps[nextNotStartedIndex] },
      },
    });
  }
}

export default QuestPlayViewModel