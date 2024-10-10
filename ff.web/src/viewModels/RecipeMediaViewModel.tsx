import { action, computed, makeObservable, observable, runInAction } from "mobx";

import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import { Step } from "@vuo/models/Step";
import { AdminRecipe, RecipeProcessingState } from "./RecipeGeneratorViewModel";
// import { Media } from "@vuo/models/Media";
// import { Resource } from "@vuo/models/Resource";

export default class RecipeMediaViewModel extends BaseViewModel {

  focusMode: boolean = true
  recipe: AdminRecipe
  busyFields: { [key: string]: boolean } = {};

  constructor(id: string) {
    super()
    this.recipe = { name: '', description: '', createdAt: '', updatedAt: '', steps: [], processingState: RecipeProcessingState.NeedProcessing }

    makeObservable(this, {
      ...BaseViewModelProps,
      getStepById: action,
      nextStepToReview: computed,
      recipe: observable
    })
    this.fetchRecipe(id)
  }

  async fetchRecipe(id: string): Promise<void> {
    const recipe = await this.fetchData<AdminRecipe>({ url: `v1/admin/recipes/${id}` })
    if (recipe) {
      runInAction(() => {
        this.recipe = recipe
      })
    }
  }

  getStepById = (stepId: string): Step | undefined => {
    if (!this.recipe.steps) return undefined

    return this.findStepRecursively(this.recipe.steps, stepId);
  };

  async approveMedia(stepId: string, suggestedMediaId: string) {
    const recipe = await this.patchData<AdminRecipe>(`v1/admin/recipes/${this.recipe.id}/approve-step-media`, { stepId, suggestedMediaId })
    if (recipe) {
      runInAction(() => {
        if (recipe) {
          this.recipe = recipe
        }
      })
    }
  }

  get nextStepToReview(): Step | undefined {
    if (!this.recipe.steps) return undefined

    const subSteps: Step[] = this.recipe.steps.flatMap(step => step.subSteps || []);
    return this.findNextStepToReviewRecursively(subSteps);
  }

  private findStepRecursively(stepList: Step[], stepId: string): Step | undefined {
    const foundStep = stepList.find(step => step.id === stepId);
    if (foundStep) return foundStep

    let found: Step | undefined;
    stepList.some(step => {
      if (step.subSteps && step.subSteps.length > 0) {
        found = this.findStepRecursively(step.subSteps, stepId);
        return found !== undefined;
      }
      return false;
    });
    return found;
  }

  private findNextStepToReviewRecursively(stepList: Step[]): Step | undefined {
    const foundStep = stepList.find(step => !step.reviewStatus.mediaApproved);
    if (foundStep) return foundStep

    let found: Step | undefined;
    stepList.some(step => {
      if (step.subSteps && step.subSteps.length > 0) {
        found = this.findNextStepToReviewRecursively(step.subSteps);
        return found !== undefined;
      }
      return false;
    });
    return found;
  }
}