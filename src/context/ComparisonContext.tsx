"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type foodTag = {
    code: string;
    name: string;
};

type ComparisonContextType = {
    comparisonFoods: foodTag[];
    addToComparison: (foods: foodTag[]) => void;
    removeFromComparison: (codes: string[]) => void;
    clearComparison: () => void;
};

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export default function ComparisonProvider({ children }: { children: ReactNode }): JSX.Element {
    const [comparisonFoods, setComparisonFoods] = useState<foodTag[]>([]);

    const addToComparison = (foods: foodTag[]): void => {
        const newFoods = foods.filter(food =>
            !comparisonFoods.some(existing => existing.code === food.code)
        );
        setComparisonFoods(prev => [...prev, ...newFoods]);
    };

    const removeFromComparison = (codes: string[]): void => {
        // const foodsToRemove = comparisonFoods.filter(food => codes.includes(food.code));

        setComparisonFoods(prev => prev.filter(item => !codes.includes(item.code)));

    };

    const clearComparison = (): void => {
        // const count = comparisonFoods.length;
        setComparisonFoods([]);
    };

    const value: ComparisonContextType = {
        comparisonFoods,
        addToComparison,
        removeFromComparison,
        clearComparison,
    };

    return (
        <ComparisonContext.Provider value={value}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison(): ComparisonContextType {
    const context = useContext(ComparisonContext);

    if (context === undefined) {
        throw new Error("useComparison debe usarse dentro de un ComparisonProvider");
    }

    return context;
}
