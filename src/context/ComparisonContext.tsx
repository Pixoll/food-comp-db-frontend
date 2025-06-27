'use client'
import { createContext, useState, useContext } from 'react';

type foodTag = {
    code: string;
    name: string;
}

type ComparisonContextType = {
    comparisonFoods: foodTag[];
    addToComparison: (foods: foodTag[]) => void;
    removeFromComparison: (codes: string[]) => void;
    clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export default function ComparisonProvider({children}: {children: React.ReactNode}) {
    const [comparisonFoods, setComparisonFoods] = useState<foodTag[]>([]);

    const addToComparison = (foods: foodTag[]) => {
        const newFoods = foods.filter(food =>
            !comparisonFoods.some(existing => existing.code === food.code)
        );
        setComparisonFoods(prev => [...prev, ...newFoods]);
    };

    const removeFromComparison = (codes: string[]) => {
        const foodsToRemove = comparisonFoods.filter(food => codes.includes(food.code));

        setComparisonFoods(prev => prev.filter(item => !codes.includes(item.code)));

    };

    const clearComparison = () => {
        const count = comparisonFoods.length;
        setComparisonFoods([]);
    };

    const value: ComparisonContextType = {
        comparisonFoods,
        addToComparison,
        removeFromComparison,
        clearComparison
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
        throw new Error('useComparison debe usarse dentro de un ComparisonProvider');
    }

    return context;
}
