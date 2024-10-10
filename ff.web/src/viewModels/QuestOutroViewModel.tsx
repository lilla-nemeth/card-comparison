import { action, computed, makeObservable, runInAction } from "mobx";
import { startRegistration } from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";

import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import playerAchievementStore from "@vuo/stores/PlayerAchievementStore";
import playerQuestDataStore from "@vuo/stores/PlayerQuestDataStore";
import { PlayerAchievement } from "@vuo/models/PlayerAchievement";
import { CombinedSkill, Skill } from "@vuo/models/Step";
import { PlayerQuest } from "@vuo/models/PlayerQuest";
import sessionDataStore from "@vuo/stores/SessionDataStore";
import { ChannelUser } from "@vuo/stores/WebSocketStore";

interface ShadowAccountResponse {
  token: string;
  username: string;
  user: ChannelUser;
}

export default class QuestOutroViewModel extends BaseViewModel {
  private sessionDataStore = sessionDataStore;
  private playerQuestDataStore = playerQuestDataStore
  playerQuestId?: string

  constructor(id: string) {
    super()
    makeObservable(this, {
      ...BaseViewModelProps,
      registerShadowAccount: action,
      combinedPlayerSkillsForCompletedQuest: computed,
      playerAchievementsForCompletedQuest: computed,
      playerSkillsForCompletedQuest: computed,
      shadowAccount: computed,
      playerQuest: computed
    })
    this.playerQuestId = id
    this.loadData(id)
  }

  get playerQuest(): PlayerQuest | undefined {
    if (!this.playerQuestId) { return undefined }

    return this.playerQuestDataStore.getPlayerQuestById(this.playerQuestId)
  }

  async loadData(id: string): Promise<void> {
    if (!this.playerQuest) {
      const pq = await this.fetchData<PlayerQuest>({ url: `v1/playerQuests/${id}` })
      if (pq) {
        runInAction(() => {
          this.playerQuestDataStore.addPlayerQuest(pq)
        })
      } else {
        // TODO: Error for not found
      }
    }
  }

  async registerShadowAccount(newUsername: string): Promise<void> {
    const { username } = sessionDataStore
    const optionsResponse =
      await this.fetchData<PublicKeyCredentialCreationOptionsJSON>({
        url: "v1/register/generate-shadow-account-options",
        method: "POST",
        data: { username, newUsername },
      });

    let attestation;
    try {
      attestation = await startRegistration(optionsResponse!);
    } catch (error) {
      this.setErrors(
        error instanceof Error
          ? error
          : new Error("Error with startRegistration"),
      );
    }

    const response = await this.fetchData<ShadowAccountResponse>({
      url: "v1/register/verify-shadow-account",
      method: "POST",
      data: { username, newUsername, attestation },
    });
    this.sessionDataStore.token = response!.token;
    this.sessionDataStore.username = newUsername;
    this.sessionDataStore.user = response!.user;
    this.sessionDataStore.shadowAccount = false;
  }

  get shadowAccount(): boolean {
    return this.sessionDataStore.shadowAccount
  }


  get playerAchievementsForCompletedQuest(): PlayerAchievement[] | undefined {
    if (!this.playerQuest) { return undefined }

    return playerAchievementStore.getPlayerAchievementsForQuestById(this.playerQuest.id)
  }

  get combinedPlayerSkillsForCompletedQuest(): CombinedSkill[] | undefined {
    if (!this.playerQuest) { return undefined }
    const skillMap = new Map<string, number>();

    this.playerQuest.recipe.steps.forEach(step => {
      step.skills.forEach(skill => {
        if (skillMap.has(skill.name)) {
          skillMap.set(skill.name, skillMap.get(skill.name)! + skill.challenge_rating);
        } else {
          skillMap.set(skill.name, skill.challenge_rating);
        }
      });
    });

    return Array.from(skillMap, ([name, challenge_rating]) => ({ name, challenge_rating }));
  }

  get playerSkillsForCompletedQuest(): Skill[] | undefined {
    if (!this.playerQuest) { return undefined }
    return this.playerQuest.recipe.steps.flatMap(step => step.skills).flat()
  }
}