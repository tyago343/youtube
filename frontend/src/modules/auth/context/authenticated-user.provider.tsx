import type { User } from "@/modules/user/schemas/user.schema";
import type { ReactNode } from "react";
import { AuthenticatedUserContext } from "./authenticated-user.context";

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
