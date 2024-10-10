import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { v4 as uuid } from 'uuid';

import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import RecipeGeneratorService from '@vuo/viewModels/RecipeGeneratorService';

import { Step, createNewStep, ReviewStatus } from "@vuo/models/Step";
import { Media } from "@vuo/models/Media";
import { Resource } from "@vuo/models/Resource";

export enum RecipeState {
  notStarted = "NOT_STARTED",
  current = "CURRENT",
  done = "DONE"
}

export enum RecipeProcessingState {
  NeedProcessing = 'NeedProcessing',
  DoNotProcess = 'DoNotProcess',
  Processing = 'Processing',
  Processed = 'Processed'
}

export interface AdminUser {
  username: string;
}

export interface AdminRecipe {
  id?: string;
  createdAt: string;
  creator?: AdminUser;
  updatedAt: string;
  resources?: Resource[];
  name: string;
  media?: Media;
  processingState: RecipeProcessingState;
  rawData?: string;
  simplifiedData?: string;
  state?: RecipeState;
  steps?: Step[];
  description?: string;
  servingSize?: string
}

export default class RecipeGeneratorViewModel extends BaseViewModel {

  focusMode: boolean = true
  recipe: AdminRecipe
  busyFields: { [key: string]: boolean } = {};

  constructor(id?: string) {
    super()
    this.recipe = { name: '', description: '', createdAt: '', updatedAt: '', steps: [], processingState: RecipeProcessingState.NeedProcessing }

    makeObservable(this, {
      ...BaseViewModelProps,
      addSubStepToParentStep: action,
      extractDescription: action,
      extractName: action,
      generateDescription: action,
      generateRecipeName: action,
      setField: action,
      setFieldForStep: action,
      saveRecipe: action,
      switchFocusModel: action,
      currentRootItem: computed,
      nextStepToReview: computed,
      busyFields: observable,
      focusMode: observable,
      recipe: observable
    })
    if (id) {
      this.fetchRecipe(id)
    }
  }

  get currentRootItem(): Step | null {
    const currenStep = this.nextStepToReview
    if (!currenStep) { return null }
    return this.findParentStep(currenStep.id) || currenStep
  }

  get nextStepToReview(): Step | null {
    if (!this.recipe.steps) { return null }

    let foundStep: Step | null = null;
    const search = (stepsArray: Step[]): boolean => stepsArray.some(step => {
      if (!step.reviewStatus.textVerified) {
        foundStep = step;
        return true;
      }
      if (step.subSteps) {
        return search(step.subSteps);
      }
      return false;
    });
    search(this.recipe.steps);
    return foundStep;
  }

  switchFocusModel() {
    runInAction(() => {
      this.focusMode = !this.focusMode
    })
  }

  addSubStepToParentStep(stepId: string) {
    const step = this.findParentStep(stepId)
    if (step) {
      const subStep = createNewStep({ text: "New step title" })
      runInAction(() => {
        if (!step.subSteps) {
          step.subSteps = [subStep]
        } else {
          step.subSteps.push(subStep)
        }
      })
    }
  }

  findStepById(id: string): Step | null {
    if (!this.recipe.steps) { return null }

    let foundStep: Step | null = null;

    const search = (steps: Step[]): boolean => steps.some(step => {
      if (step.id === id) {
        foundStep = step;
        return true; // Stop the loop
      }
      if (step.subSteps) {
        return search(step.subSteps);
      }
      return false;
    });
    search(this.recipe.steps);
    return foundStep;
  };

  async atomizeStep(stepId: string) {
    if (!this.recipe) { return }

    let foundStep: Step | undefined;
    foundStep = this.recipe.steps?.find(s => s.id === stepId);

    if (!foundStep) {
      this.recipe.steps?.some(mainStep => {
        foundStep = mainStep.subSteps?.find(ss => ss.id === stepId);
        return foundStep !== undefined;
      });
    }
    if (foundStep !== undefined) {
      this.setBusy(`atomize_${stepId}`, true);
      try {
        const result = await RecipeGeneratorService.atomizeStep(foundStep.text, this.concatenatePreviousStepTexts(foundStep.id))
        if (result.steps) {
          runInAction(() => {
            foundStep!.subSteps = result.steps.map(rs => (
              {
                ...rs,
                id: uuid(),
                skills: [],
                subSteps: [],
                reviewStatus: {
                  processed: false,
                  textVerified: false,
                  ingredientsVerified: false,
                  mediaGenerated: false,
                  mediaApproved: false,
                  skillsAssigned: false
                },
                suggestedMedias: [],
                attachable: true,
                text: rs.text
              }));;
          });
        }
      } catch (error) { /* empty */ } finally {
        this.setBusy(`atomize_${stepId}`, false);
      }
    }
  }

  removeStep(stepId: string) {
    if (!this.recipe) { return; }

    const removeStepRecursive = (stepsArray: Step[]) => {
      // Filter out the step with the matching id
      let updatedSteps = stepsArray.filter(step => step.id !== stepId);

      // Recursively remove from subSteps if they exist
      updatedSteps = updatedSteps.map(step => {
        if (step.subSteps) {
          return {
            ...step,
            subSteps: removeStepRecursive(step.subSteps)
          };
        }
        return step;
      });

      return updatedSteps;
    };

    runInAction(() => {
      if (this.recipe && this.recipe.steps) {
        this.recipe.steps = removeStepRecursive(this.recipe.steps);
      }
    });
  }

  moveStep(stepId: string, newPosition: number[]) {

    if (!this.recipe.steps) { return }

    const removeStepRecursive = (stepsList: Step[], targetStepId: string): { updatedSteps: Step[], removedStep: Step | null } => {
      for (let i = 0; i < stepsList.length; i += 1) {
        if (stepsList[i].id === targetStepId) {
          const removedStep = stepsList[i];
          const updatedSteps = stepsList.filter((_, index) => index !== i);
          return { updatedSteps, removedStep };
        }
        if (stepsList[i].subSteps && stepsList[i].subSteps!.length > 0) {
          const { updatedSteps: updatedSubSteps, removedStep } = removeStepRecursive(stepsList[i].subSteps!, targetStepId);
          if (removedStep) {
            const updatedSteps = stepsList.slice();
            updatedSteps[i] = { ...stepsList[i], subSteps: updatedSubSteps };
            return { updatedSteps, removedStep };
          }
        }
      }
      return { updatedSteps: stepsList, removedStep: null };
    };

    const insertStep = (stepsList: Step[], step: Step, position: number[]) => {
      const newStepsList: Step[] = JSON.parse(JSON.stringify(stepsList));
      let currentLevel: Step[] = newStepsList;

      for (let i = 1; i < position.length - 1; i += 1) {
        const idx = position[i];
        const currentNode = currentLevel[idx];

        if (currentNode && currentNode.subSteps) {
          currentLevel = currentNode.subSteps;
        } else {
          throw new Error(`Position ${position.slice(0, i + 1).join(',')} does not exist in the steps list.`);
        }
      }
      const finalIndex = position[position.length - 1];
      currentLevel.splice(finalIndex, 0, step)
      return newStepsList;
    }

    const { updatedSteps, removedStep } = removeStepRecursive(this.recipe.steps, stepId);

    if (removedStep) {
      const finalSteps = insertStep(updatedSteps, removedStep, newPosition);
      runInAction(() => {
        this.recipe.steps = finalSteps;
      });
    }
  }

  setBusy(field: string, isBusy: boolean) {
    runInAction(() => {
      this.busyFields[field] = isBusy;
    })
  };

  setField(field: string, value: string) {
    if (field === 'name' || field === 'description' || field === 'rawData' || field === 'simplifiedData') {
      runInAction(() => {
        this.recipe[field] = value;
      })
    }
  }

  setFieldForStep(stepId: string, field: string, value: string | Partial<ReviewStatus>) {
    if (!this.recipe) { return }

    let foundStep: Step | undefined;
    foundStep = this.recipe.steps?.find(s => s.id === stepId);

    if (!foundStep) {
      this.recipe.steps?.some(mainStep => {
        foundStep = mainStep.subSteps?.find(ss => ss.id === stepId);
        return foundStep !== undefined;
      });
    }

    if (foundStep !== undefined) {
      runInAction(() => {
        if (field === 'text') {
          foundStep!.text = value as string;
        } else if (field === 'reviewStatus') {
          if (typeof value === 'object' && value !== null) {
            foundStep!.reviewStatus = {
              ...foundStep!.reviewStatus,
              ...(value as Partial<ReviewStatus>)
            }
          }
        }
      })
    };
  }

  private findParentStep(stepId: string): Step | null {
    if (!this.recipe.steps) { return null }
    let parent: Step | null = null
    const search = (steps: Step[]) => {
      steps.forEach(step => {
        if (step.subSteps && step.subSteps.some(subStep => subStep.id === stepId)) {
          parent = step
        } else if (step.subSteps) {
          search(step.subSteps)
        }
      })
    }
    search(this.recipe.steps)
    return parent
  }

  private concatenatePreviousStepTexts(stepId: string): string {
    if (!this.recipe.steps) {
      return '';
    }

    const index = this.recipe.steps.findIndex(rootStep => rootStep.id === stepId);
    if (index === -1) {
      return ''; // Step not found
    }

    let concatenatedText = '';

    this.recipe.steps.slice(0, index).forEach(rootStep => {
      if (rootStep.subSteps) {
        rootStep.subSteps.forEach(subStep => {
          concatenatedText += `${subStep.text} `;
        });
      }
    });

    return concatenatedText.trim();
  }

  async extractName() {
    this.setBusy('name', true);
    try {
      const result = await RecipeGeneratorService.extractNameAndDescription(this.recipe.simplifiedData || '');
      runInAction(() => {
        this.recipe.name = result.name;
      });
    } catch (error) { /* empty */ } finally {
      this.setBusy('name', false);
    }
  }

  async extractDescription() {
    this.setBusy('description', true);
    try {
      const result = await RecipeGeneratorService.extractNameAndDescription(this.recipe.simplifiedData || '');
      runInAction(() => {
        this.recipe.description = result.description;
      });
    } catch (error) { /* empty */ } finally {
      this.setBusy('description', false);
    }
  }

  async extractSteps(recipeText: string) {
    this.setBusy('steps', true);
    try {
      const result = await RecipeGeneratorService.extractSteps(recipeText);
      if (result.steps) {
        const extractedSteps = result.steps.map((rs) => {
          const newStep = createNewStep(
            {
              text: rs.text,
              rawData: rs.text,
              reviewStatus: {
                processed: true,
                textVerified: false,
                ingredientsVerified: false,
                mediaGenerated: false,
                mediaApproved: false,
                skillsAssigned: false
              }
            })
          return newStep
        });
        runInAction(() => {
          this.recipe.steps = extractedSteps
        });
        this.atomizeStep(extractedSteps[0].id)
      }
    } catch (error) { /* empty */ } finally {
      this.setBusy('steps', false);
    }
  }

  async generateDescription() {
    this.setBusy('description', true);
    try {
      const result = await RecipeGeneratorService.generateDescription(this.recipe.description || "");
      runInAction(() => {
        this.recipe.description = result.value;
      });
    } catch (error) { /* empty */ } finally {
      this.setBusy('description', false);
    }
  }

  async generateRecipeName() {
    this.setBusy('name', true);
    try {
      const result = await RecipeGeneratorService.generateName(this.recipe.name);
      runInAction(() => {
        this.recipe.name = result.value;
      });
    } catch (error) { /* empty */ } finally {
      this.setBusy('name', false);
    }
  }

  async fetchRecipe(id: string): Promise<void> {
    const recipe = await this.fetchData<AdminRecipe>({ url: `v1/admin/recipes/${id}` })
    if (recipe) {
      runInAction(() => {
        this.recipe = recipe
      })
    }
  }

  async saveRecipe(): Promise<AdminRecipe | null> {
    let recipe: AdminRecipe | null;
    // TODO: Do not send timestamps back to backend
    const { createdAt, updatedAt, ...data } = this.recipe
    if (this.recipe.id) {
      recipe = await this.patchData<AdminRecipe>(`v1/admin/recipes/${this.recipe.id}`, { data })
    } else {
      recipe = await this.postData<AdminRecipe>("v1/admin/recipes", { data })
    }
    runInAction(() => {
      if (recipe) {
        this.recipe = recipe
      }
    })
    return recipe
  }

  async simplifyRecipe(): Promise<void> {
    if (!this.recipe.rawData) { return }
    this.setBusy('simplifying', true)
    try {
      await this.patchData(`v1/admin/recipes/${this.recipe.id}/generate`, {})
    } catch (error) { /* empty */ } finally {
      this.setBusy('simplifying', false)
    }
  }
}