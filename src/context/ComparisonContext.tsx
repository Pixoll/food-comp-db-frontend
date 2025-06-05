'use client'
import { createContext, useState, useContext } from 'react';
import { useToast } from "@/context/ToastContext";

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
    const { addToast } = useToast();

    const addToComparison = (foods: foodTag[]) => {
        const newFoods = foods.filter(food =>
            !comparisonFoods.some(existing => existing.code === food.code)
        );

        if (newFoods.length === 0) {
            addToast({
                type: "Warning",
                message: "Los alimentos seleccionados ya están en la comparación.",
                title: "Aviso",
                position: "top-end",
                duration: 3000,
            });
            return;
        }

        setComparisonFoods(prev => [...prev, ...newFoods]);

        if (newFoods.length === 1) {
            addToast({
                type: "Success",
                message: `El alimento ${newFoods[0].code} se ha agregado con éxito para comparar.`,
                title: "Éxito",
                position: "top-end",
                duration: 3000,
            });
        } else {
            addToast({
                type: "Success",
                message: `Se han agregado ${newFoods.length} alimentos para comparar.`,
                title: "Éxito",
                position: "top-end",
                duration: 3000,
            });
        }
    };

    const removeFromComparison = (codes: string[]) => {
        const foodsToRemove = comparisonFoods.filter(food => codes.includes(food.code));

        if (foodsToRemove.length === 0) {
            addToast({
                type: "Warning",
                message: "No se encontraron alimentos para eliminar.",
                title: "Aviso",
                position: "top-end",
                duration: 3000,
            });
            return;
        }

        setComparisonFoods(prev => prev.filter(item => !codes.includes(item.code)));
        if (foodsToRemove.length === 1) {
            addToast({
                type: "Danger",
                message: `El alimento ${foodsToRemove[0].code} se ha eliminado de la comparación.`,
                title: "Eliminado de la lista",
                position: "top-end",
                duration: 3000,
            });
        } else {
            addToast({
                type: "Danger",
                message: `Se han eliminado ${foodsToRemove.length} alimentos de la comparación.`,
                title: "Eliminados de la lista",
                position: "top-end",
                duration: 3000,
            });
        }
    };

    const clearComparison = () => {
        const count = comparisonFoods.length;
        setComparisonFoods([]);

        if (count > 0) {
            addToast({
                type: "Info",
                message: `Se han eliminado ${count} alimentos de la comparación.`,
                title: "Lista limpiada",
                position: "top-end",
                duration: 3000,
            });
        }
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
