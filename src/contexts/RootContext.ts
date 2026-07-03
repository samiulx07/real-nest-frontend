"use client";

import { User } from "@/shared/interface";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type RootContextValue = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    accessToken: string | null;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
    authLoading: boolean;
    setAuthLoading: Dispatch<SetStateAction<boolean>>;
};

export const RootContext = createContext<RootContextValue | undefined>(undefined);

export const useRootContext = (): RootContextValue => {
    const context = useContext(RootContext);

    if (!context) {
        throw new Error("useRootContext must be used within a RootProvider");
    }

    return context;
};
