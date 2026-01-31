import { defineStore } from "pinia";

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  createdAt: string;
  role: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
  actions: {
    async login(credentials: LoginCredentials): Promise<void> {
      const runtimeConfig = useRuntimeConfig();
      const response = await $fetch<LoginResponse>(
        `${runtimeConfig.public.apiUrl}auth/login`,
        {
          method: "POST",
          body: credentials,
        }
      );
      this.user = response.user;
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;
    },
  },
});
