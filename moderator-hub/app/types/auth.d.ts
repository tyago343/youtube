declare module "#auth-utils" {
  interface User {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
    createdAt: string;
    role: string;
  }

  interface UserSession {
    user: User;
    loggedInAt?: Date;
  }

  interface SecureSessionData {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
