import { GoogleTask, GoogleTaskList, GoogleUserProfile } from '../types';

const CLIENT_ID = '168766959651-2hmgefet6h5bu046jjb57n1rhakrtemd.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

class GoogleTasksService {
  private token: string | null = null;
  private tokenClient: any = null;
  private isInitialized = false;

  constructor() {
    // Check session storage
    if (typeof window !== 'undefined') {
      const savedToken = sessionStorage.getItem('google_tasks_access_token');
      const tokenExpiry = sessionStorage.getItem('google_tasks_token_expiry');
      if (savedToken && tokenExpiry && Date.now() < Number(tokenExpiry)) {
        this.token = savedToken;
      }
    }
  }

  public initGSI(onTokenReceived?: (token: string) => void): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      const checkGoogle = () => {
        if ((window as any).google?.accounts?.oauth2) {
          try {
            this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
              client_id: CLIENT_ID,
              scope: SCOPES,
              callback: async (resp: any) => {
                if (resp.error) {
                  console.error('GSI Auth error:', resp);
                  return;
                }
                if (resp.access_token) {
                  this.token = resp.access_token;
                  const expiresIn = resp.expires_in ? Number(resp.expires_in) * 1000 : 3500000;
                  sessionStorage.setItem('google_tasks_access_token', resp.access_token);
                  sessionStorage.setItem('google_tasks_token_expiry', String(Date.now() + expiresIn));
                  if (onTokenReceived) {
                    onTokenReceived(resp.access_token);
                  }
                }
              },
            });
            this.isInitialized = true;
            resolve(true);
          } catch (e) {
            console.error('Failed to init GSI token client', e);
            resolve(false);
          }
        } else {
          setTimeout(checkGoogle, 300);
        }
      };

      checkGoogle();
    });
  }

  public isConnected(): boolean {
    return Boolean(this.token);
  }

  public getAccessToken(): string | null {
    return this.token;
  }

  public requestAuth(promptConsent = false): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        if ((window as any).google?.accounts?.oauth2) {
          this.initGSI();
        } else {
          reject(new Error('Google Identity Services SDK is not loaded yet. Please try again.'));
          return;
        }
      }

      const oldCallback = this.tokenClient.callback;
      this.tokenClient.callback = (resp: any) => {
        if (oldCallback) oldCallback(resp);
        if (resp.error) {
          reject(new Error(resp.error_description || resp.error));
        } else if (resp.access_token) {
          this.token = resp.access_token;
          resolve(resp.access_token);
        } else {
          reject(new Error('No access token received.'));
        }
      };

      this.tokenClient.requestAccessToken({ prompt: promptConsent ? 'consent' : '' });
    });
  }

  public logout() {
    this.token = null;
    sessionStorage.removeItem('google_tasks_access_token');
    sessionStorage.removeItem('google_tasks_token_expiry');
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
    if (!this.token) {
      throw new Error('Google Tasks is not connected. Please connect your Google account.');
    }

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      this.logout();
      throw new Error('Google authentication expired. Please reconnect.');
    }
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Tasks API Error (${res.status}): ${errText}`);
    }

    if (res.status === 204) {
      return { success: true };
    }
    return res.json();
  }

  public async getUserProfile(): Promise<GoogleUserProfile | null> {
    if (!this.token) return null;
    try {
      const data = await this.fetchWithAuth('https://www.googleapis.com/oauth2/v3/userinfo');
      return {
        email: data.email || 'smurari229@gmail.com',
        name: data.name || 'User',
        picture: data.picture,
      };
    } catch {
      return { email: 'smurari229@gmail.com', name: 'Connected User' };
    }
  }

  public async getTaskLists(): Promise<GoogleTaskList[]> {
    const data = await this.fetchWithAuth('https://tasks.googleapis.com/tasks/v1/users/@me/lists');
    return data.items || [];
  }

  public async createTaskList(title: string): Promise<GoogleTaskList> {
    return this.fetchWithAuth('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  public async getTasks(taskListId: string): Promise<GoogleTask[]> {
    const data = await this.fetchWithAuth(
      `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?showCompleted=true&showHidden=true`
    );
    return data.items || [];
  }

  public async createTask(
    taskListId: string,
    task: { title: string; notes?: string; due?: string }
  ): Promise<GoogleTask> {
    return this.fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  public async toggleTaskStatus(
    taskListId: string,
    taskId: string,
    currentStatus: 'needsAction' | 'completed'
  ): Promise<GoogleTask> {
    const newStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
    return this.fetchWithAuth(
      `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      }
    );
  }

  public async deleteTask(taskListId: string, taskId: string): Promise<void> {
    await this.fetchWithAuth(
      `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
      {
        method: 'DELETE',
      }
    );
  }

  public async syncRoadmapPlan(
    planTitle: string,
    tasks: { title: string; notes: string; dayOffset: number }[]
  ): Promise<{ listId: string; count: number }> {
    // 1. Create a dedicated task list
    const listTitle = `🎯 AI Income: ${planTitle.slice(0, 40)}`;
    const newList = await this.createTaskList(listTitle);

    // 2. Add each task with calculated due date
    const now = new Date();
    let count = 0;

    for (const item of tasks) {
      const dueDate = new Date();
      dueDate.setDate(now.getDate() + (item.dayOffset || 1));
      dueDate.setHours(18, 0, 0, 0);

      await this.createTask(newList.id, {
        title: item.title,
        notes: item.notes || `Day ${item.dayOffset} action step for ${planTitle}`,
        due: dueDate.toISOString(),
      });
      count++;
    }

    return { listId: newList.id, count };
  }
}

export const googleTasksService = new GoogleTasksService();
