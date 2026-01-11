import { createContext, useContext } from "react";
import type { User } from "@user/schemas/user.schema";

export const AuthenticatedUserContext = createContext<User | null>(null);

function useAuthenticatedUser(): User {
  const user = useContext(AuthenticatedUserContext);

  if (!user) {
    throw new Error(
      "useAuthenticatedUser must be used within a PrivateGuard. " +
        "Make sure this component is rendered inside a private route."
    );
  }

  return user;
}
export default useAuthenticatedUser;
