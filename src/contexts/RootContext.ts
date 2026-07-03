"use client";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type RootContextValue = {

};

export const RootContext = createContext<RootContextValue | undefined>(undefined);

export const useRoot = (): RootContextValue => {
    const context = useContext(RootContext);

    if (!context) {
        throw new Error("useRoot must be used within a RootProvider");
    }

    return context;
};
