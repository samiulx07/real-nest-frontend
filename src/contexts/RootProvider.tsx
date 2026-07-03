"use client";

import { ReactNode, useMemo, useState } from "react";
import { RootContext } from "./RootContext";
import { User } from "@/shared/interface";
import { setUser as setUserToken } from "@/services/tokenService";

type RootProviderProps = {
    children: ReactNode;
};

const RootProvider = ({ children }: RootProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const logout = () => {
        setUserToken(null);
        setUser(null);
        setAccessToken(null);
    };

    const contextValue = useMemo(
        () => ({
            user,
            setUser,
            accessToken,
            setAccessToken,
            authLoading,
            setAuthLoading,
            logout,
        }),
        [user, accessToken, authLoading]
    );

    return <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>;
};

export default RootProvider;
