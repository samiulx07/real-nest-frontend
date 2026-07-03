"use client";

import { useEffect } from "react";
import { useRootContext } from "@/contexts/RootContext";
import { getUser, setUser } from "@/services/tokenService";
import api from "@/services/baseServices";

export default function AuthInit() {
  const { setUser: setUserContext, setAccessToken, setAuthLoading } = useRootContext();

  useEffect(() => {
    const initAuth = async () => {
      const authData = getUser();
      if (authData?.accessToken) {
        try {
          // Verify current access token by fetching latest user profile
          const response = await api.get("/auth/me");
          if (response.data?.success && response.data?.data) {
            const latestUser = response.data.data;
            setUserContext(latestUser);
            setAccessToken(authData.accessToken);
            
            // Sync local storage with verified profile
            setUser({
              user: latestUser,
              accessToken: authData.accessToken,
            });
          } else {
            // Invalid session
            setUser(null);
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          setUser(null);
        }
      }
      setAuthLoading(false);
    };

    initAuth();
  }, [setUserContext, setAccessToken, setAuthLoading]);

  return null;
}
