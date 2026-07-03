"use client";

import { ReactNode, useMemo, useState } from "react";
import { RootContext } from "./RootContext";
import { User } from "@/shared/interface";

type RootProviderProps = {
    children: ReactNode;
};

const RootProvider = ({ children }: RootProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const contextValue = useMemo(
        () => ({
            user,
            setUser,
            accessToken,
            setAccessToken,
            authLoading,
            setAuthLoading,
        }),
        [user, accessToken, authLoading]
    );

    return <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>;
};

export default RootProvider;
