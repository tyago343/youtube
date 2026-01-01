import { clearCredentials } from "./auth.slice";
import { clearUser } from "@user/model/user.slice";
import { clearAuthStorage } from "@shared/lib/storage";
import type { AppDispatch } from "@core/store";

export async function logout(dispatch: AppDispatch) {
  dispatch(clearCredentials());
  dispatch(clearUser());
  clearAuthStorage();
}
