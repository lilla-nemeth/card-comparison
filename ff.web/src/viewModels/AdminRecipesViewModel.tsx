import { action, makeObservable, observable, runInAction } from "mobx";
import { BaseViewModel, BaseViewModelProps } from "@vuo/viewModels/BaseViewModel";
import { ReviewStatus } from "@vuo/models/Step";
import { AdminRecipe } from "@vuo/viewModels/RecipeGeneratorViewModel";
// import { AdminRecipe, RecipeProcessingState } from "@vuo/viewModels/RecipeGeneratorViewModel";

export type ReviewStatusFilter = {
  field: keyof ReviewStatus;
  value: boolean;
}

interface Response {
  recipes: AdminRecipe[];
  total: number;
}

export interface FilterType {
  filter: string;
  value: boolean;
}

interface Option {
  name: string;
  count: number;
}

export interface AvailableFilters {
  skills: Option[];
  tools: Option[];
  ingredients: Option[];
}

export interface FilterValues {
  review_status?: FilterType;
  name?: string
  skills?: string;
  tools?: string;
  ingredients?: string;
}

export default class AdminRecipesViewModel extends BaseViewModel {

  recipes: AdminRecipe[] = []
  availableFilter?: AvailableFilters = undefined
  totalRecipes = 0
  currentPage = 1
  pageSize = 10

  constructor() {
    super()

    makeObservable(this, {
      ...BaseViewModelProps,
      fetchRecipes: action,
      availableFilter: observable,
      currentPage: observable,
      pageSize: observable,
      recipes: observable,
      totalRecipes: observable,
    })

    this.fetchAvailableFilter()
  }

  async fetchAvailableFilter(): Promise<void> {
    const data = await this.fetchData<AvailableFilters>({ url: 'v1/admin/recipes/available_filters' })
    if (data) {
      runInAction(() => {
        this.availableFilter = data
      })
    }
  }

  async fetchRecipes(filterValues: FilterValues, page = 1, limit = 10): Promise<void> {
    let url = `v1/admin/recipes?page=${page}&limit=${limit}`;
    if (filterValues.review_status !== undefined) {
      url += `&field=${filterValues.review_status.filter}&value=${filterValues.review_status.value}`;
    }

    Object.entries(filterValues).forEach(([key, value]) => {
      if (key !== 'review_status' && value) {
        url += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    const data = await this.fetchData<Response>({ url })
    if (data) {
      runInAction(() => {
        this.recipes = data.recipes
        this.totalRecipes = data.total;
        this.currentPage = page;
        this.pageSize = limit;
      })
    }
  }

  async uploadRecipeFile(file: File): Promise<void> {
    await this.postFile("v1/admin/recipes/upload", file)
  }
}