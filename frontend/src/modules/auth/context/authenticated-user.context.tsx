import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@user/schemas/user.schema";

const AuthenticatedUserContext = createContext<User | null>(null);

type AuthenticatedUserProviderProps = {
  user: User;
  children: ReactNode;
};

export function AuthenticatedUserProvider({
  user,
  children,
}: AuthenticatedUserProviderProps) {
  return (
    <AuthenticatedUserContext.Provider value={user}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export function useAuthenticatedUser(): User {
  const user = useContext(AuthenticatedUserContext);

  if (!user) {
    throw new Error(
      "useAuthenticatedUser must be used within a PrivateGuard. " +
        "Make sure this component is rendered inside a private route."
    );
  }

  return user;
}
