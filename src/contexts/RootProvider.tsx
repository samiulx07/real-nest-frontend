"use client";

import { ReactNode, useMemo } from "react";
import {
    RootContext,
} from "./RootContext";

type RootProviderProps = {
    children: ReactNode;
};

const RootProvider = ({ children }: RootProviderProps) => {

    const contextValue = useMemo(
        () => ({

        }),
        []
    );

    return <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>;
};

export default RootProvider;
