import { action, computed, makeObservable, observable, runInAction } from "mobx";
import TagManager from "react-gtm-module";
import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import { Quest } from "@vuo/models/Quest";
import { PlayerQuest } from "@vuo/models/PlayerQuest";
import { Skill } from "@vuo/models/Step";
import { jwtDecode } from "jwt-decode";
import playerAchievementStore from "@vuo/stores/PlayerAchievementStore";
import playerQuestDataStore from "@vuo/stores/PlayerQuestDataStore";
import { PlayerAchievement } from "@vuo/models/PlayerAchievement";
import { Achievement } from "@vuo/models/Achievement";
import { AchievementType } from "@vuo/models/AchievementRequirement";
import webSocketStore from "@vuo/stores/WebSocketStore";
import EventBus, { PlayerQuestDataChangedParameters } from "@vuo/utils/EventBus";
import { UserGroupMembership } from "@vuo/models/UserGroupMembership";

export default class QuestIntroViewModel extends BaseViewModel {
  private webSocketStore = webSocketStore;
  playerQuest?: PlayerQuest

  quest?: Quest
  memberships: UserGroupMembership[] = []

  private playerAchievementStore = playerAchievementStore
  private playerQuestDataStore = playerQuestDataStore
  currentUserId: string | null = null;

  constructor(questId: string) {
    super()

    makeObservable(this, {
      ...BaseViewModelProps,
      quest: observable,
      playerQuest: observable,
      memberships: observable,
      multiplayerSessionURL: computed,
      multiplayerUsers: computed,
      isCurrentUserHost: computed,
      isCurrentUserMember: computed,
      claimMembership: action,
      loadData: action,
      startCurrentQuest: action,
      getRandomSkills: action,
      startMPSession: action,
      closeMPSession: action,
      addGroupMembership: action,
      unlockableAchievements: computed
    })

    this.loadData(questId)

    const storage = JSON.parse(localStorage.getItem('SessionDataStore')!)
    const { token } = storage
    if (token) {
      const decode = jwtDecode<{ id: string }>(token);
      this.currentUserId = decode.id
    }

    const playerQuestDataReceived = (params: PlayerQuestDataChangedParameters) => {
      runInAction(() => {
        this.playerQuest = params.playerQuest
        this.playerQuestDataStore.addPlayerQuest(params.playerQuest)
      })
    };
    // Host don't need to update state from eventbus
    if (!this.isCurrentUserHost) {
      EventBus.on("playerQuestDataChanged", playerQuestDataReceived);
    }

    const membershipClaimed = () => {
      this.getGroupMemberships()
    }

    EventBus.on("membershipClaimed", membershipClaimed)
  }

  get isCurrentUserMember() {
    return this.memberships.some(membership => membership.userId?.id === this.currentUserId);
  }

  get multiplayerSessionURL() {
    return this.webSocketStore.channelId
  }

  get multiplayerUsers() {
    return this.webSocketStore.channelUsers()
  }

  get isCurrentUserHost() {
    return this.webSocketStore.isCurrentUserHost()
  }

  async getGroupMemberships(): Promise<void> {
    const userGroupMemberships = await this.getData<UserGroupMembership[]>("v1/memberships")
    if (userGroupMemberships) {
      runInAction(() => {
        this.memberships = userGroupMemberships
      })
    }
  }

  async addGroupMembership(nickname: string): Promise<void> {
    const userGroupMembership = await this.postData<UserGroupMembership>("v1/memberships", { nickname })
    if (userGroupMembership) {
      runInAction(() => {
        this.memberships = this.memberships.concat([userGroupMembership])
      })
    }
  }

  async claimMembership(id: string): Promise<void> {
    this.webSocketStore.claimMembership(id)
  }

  async startMPSession(url: string): Promise<void> {
    if (!this.quest) { return }
    // TODO: error handling
    this.webSocketStore.connect()
    this.webSocketStore.createChannel(url, this.quest?.id)
  }

  async closeMPSession(): Promise<void> {
    this.webSocketStore.closeChannel()
  }

  async leaveSession(): Promise<void> {
    this.webSocketStore.leaveChannel()
  }

  async loadData(questId: string): Promise<void> {
    const results = await this.fetchMultipleData([
      { url: `v1/quests/${questId}`, method: 'GET' },
      { url: 'v1/playerAchievements/me', method: 'GET' },
      { url: 'v1/achievements', method: 'GET' },
    ]);

    const quest = results[0] as Quest
    const playerAchievements = results[1] as PlayerAchievement[]
    const achievements = results[2] as Achievement[]
    playerAchievementStore.playerAchievements = playerAchievements
    playerAchievementStore.achievements = achievements
    runInAction(() => {
      this.quest = quest
    })
  }

  async startCurrentQuest() {
    if (!this.quest) return;

    // TODO: Perhaps this can be done in client and just call this later?
    const playerQuest = await this.postData<PlayerQuest>("v1/playerQuests", { id: this.quest.id })
    if (playerQuest) {
      TagManager.dataLayer({
        dataLayer: {
          event: "quest_started",
          playerQuest: { ...playerQuest },
        },
      });
      runInAction(() => {
        this.playerQuest = playerQuest
      })
      if (this.webSocketStore.activeSession) {
        this.webSocketStore.updatePlayerQuest(playerQuest)
      } else {
        this.webSocketStore.url = ""
      }
      this.playerQuestDataStore.addPlayerQuest(playerQuest)
    }
  }

  get unlockableAchievements(): Achievement[] {
    if (!this.quest || this.playerAchievementStore.achievements.length === 0) {
      return [];
    }
    const matchingAchievements: Achievement[] = [];
    this.playerAchievementStore.achievements.forEach(achievement => {
      if (achievement.requirement) {
        if (achievement.requirement.type === AchievementType.step) {
          if (achievement.requirement.any || this.quest?.recipe.steps?.some(step => step.id === achievement.requirement?.stepId)) {
            matchingAchievements.push(achievement)
          }
        }
        if (achievement.requirement.type === AchievementType.skill) {
          if (achievement.requirement.any || this.quest?.recipe.steps?.some(step => step.skills.some(skill => skill.id === achievement.requirement?.skillId))) {
            matchingAchievements.push(achievement)
          }
        }
      }
    });
    return matchingAchievements;
  }

  private static getRandomVariation(range: number): number {
    return Math.floor(Math.random() * (range * 2 + 1)) - range;
  }

  private static getIndicesWithRandomVariation<T>(array: T[], range: number = 1): number[] {
    if (array.length === 0) {
      throw new Error("Array cannot be empty");
    }

    const indices: number[] = [];
    const maxIndex = array.length - 1;

    const startIndex = Math.max(0, Math.min(maxIndex, 0 + QuestIntroViewModel.getRandomVariation(range)));
    indices.push(startIndex);

    if (array.length > 1) {
      const middleIndex = Math.max(0, Math.min(maxIndex, Math.floor(array.length / 2) + QuestIntroViewModel.getRandomVariation(range)));
      indices.push(middleIndex);
    }

    if (array.length > 2) {
      const endIndex = Math.max(0, Math.min(maxIndex, maxIndex + QuestIntroViewModel.getRandomVariation(range)));
      indices.push(endIndex);
    }

    return indices;
  }

  getRandomSkills = (): Skill[] => {
    if (!this.playerQuest) { return [] }

    const { playerQuest } = this

    const indices = QuestIntroViewModel.getIndicesWithRandomVariation(playerQuest.recipe.steps, 0);
    const randomSkills: Skill[] = [];
    indices.forEach(index => {
      const skill = playerQuest.recipe.steps[index]?.skills[0];
      if (skill) {
        randomSkills.push(skill);
      }
    });

    return randomSkills;
  }
}