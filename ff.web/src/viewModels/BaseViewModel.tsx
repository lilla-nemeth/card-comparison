import { action, makeObservable, observable } from "mobx";
import sessionDataStore from "@vuo/stores/SessionDataStore";

export const BaseViewModelProps = {
  errors: observable,
  loading: observable,
  setErrors: action,
  setLoading: action
};

interface RequestConfig {
  url: string;
  method?: string;
  data?: Record<string, unknown>;
}

const API_URL = "http://localhost:7702";

export class BaseViewModel {
  loading: boolean = false;

  errors: Error | null = null;

  constructor() {
    makeObservable({ ...BaseViewModelProps });
  }

  async fetchData<T>(config: RequestConfig): Promise<T | null> {
    this.setLoading(true);
    this.setErrors(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (sessionDataStore.token) {
        headers.Authorization = `Bearer ${sessionDataStore.token}`
      }
      const response = await fetch(`${API_URL}/${config.url}`, {
        method: config.method || 'GET',
        body: config.method !== 'GET' ? JSON.stringify(config.data) : undefined,
        headers
      });
      if (!response.ok) {
        if (response.status === 401) {
          sessionDataStore.token = undefined
        }
        this.setErrors(new Error(response.statusText));
        return null;
      }
      return await response.json() as T;
    } catch (error) {
      this.setErrors(error instanceof Error ? error : new Error("An unexpected error occurred"));
    } finally {
      this.setLoading(false);
    }
    return null;
  }

  async fetchMultipleData<T>(requests: RequestConfig[]): Promise<(T | null)[]> {
    this.setLoading(true);
    this.setErrors(null);
    try {
      const promises = requests.map(async req => {
        try {
          return await this.fetchData<T>(req);
        } catch (error) {
          return null
        }
      });

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      this.setErrors(error instanceof Error ? error : new Error("An unexpected error occurred while fetching multiple data"));
      return requests.map(() => null); // Consider whether this line is still necessary
    } finally {
      this.setLoading(false);
    }
  }

  async getData<T>(url: string) {
    return this.fetchData<T>({ url, method: 'GET' })
  }

  async postData<T>(url: string, data: Record<string, unknown>) {
    return this.fetchData<T>({ url, method: 'POST', data })
  }

  async patchData<T>(url: string, data: Record<string, unknown>) {
    return this.fetchData<T>({ url, method: 'PATCH', data })
  }

  async postFile(url: string, file: File) {
    this.setLoading(true);
    this.setErrors(null);
    try {
      const headers: Record<string, string> = {}
      if (sessionDataStore.token) {
        headers.Authorization = `Bearer ${sessionDataStore.token}`
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_URL}/${url}`, {
        method: 'POST',
        body: formData,
        headers
      });
      if (!response.ok) {
        if (response.status === 401) {
          sessionDataStore.token = undefined
        }
        this.setErrors(new Error(response.statusText));
        return null;
      }
      return await response.json();
    } catch (error) {
      this.setErrors(error instanceof Error ? error : new Error("An unexpected error occurred"));
    } finally {
      this.setLoading(false);
    }
    return null;
  }

  // async deleteData<T>(url: string) {
  //   return this.fetchData<T>(url, 'DELETE')
  // }

  setErrors(errors: Error | null): void {
    this.errors = errors
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
  }
}
