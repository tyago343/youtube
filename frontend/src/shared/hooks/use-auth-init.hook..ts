import { useEffect, useState } from "react";
import { useAppDispatch } from "@/core/store";
import { setCredentials, clearCredentials } from "@auth/model/auth.slice";
import { setUser } from "@user/model/user.slice";
import { clearAuthStorage, getStoredCredentials } from "@/shared/lib/storage";
import { useLazyGetMeQuery } from "@auth/model/auth.api";

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const [getMe, { isLoading }] = useLazyGetMeQuery();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      const { accessToken, refreshToken } = getStoredCredentials();

      if (!accessToken) {
        setIsInitialized(true);
        return;
      }

      if (accessToken && refreshToken) {
        dispatch(
          setCredentials({
            accessToken,
            refreshToken,
          })
        );
      }

      try {
        const result = await getMe().unwrap();
        dispatch(setUser(result));
      } catch (error) {
        console.warn("Failed to restore session:", error);
        dispatch(clearCredentials());
        clearAuthStorage();
      } finally {
        setIsInitialized(true);
      }
    }

    initializeAuth();
  }, [dispatch, getMe]);

  return { isInitialized, isLoading };
}
