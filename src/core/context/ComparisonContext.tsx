import { createContext, useState, useContext } from 'react';
import { SingleFoodResult } from "../../core/types/SingleFoodResult";

type ComparisonContextType = {
    comparisonFoods: string[];
    addToComparison: (item: string) => void;
    removeFromComparison: (itemId: string) => void;
    clearComparison: () => void;
  }
const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export default function ComparisonProvider({children}: {children: React.ReactNode}) {
    const [comparisonFoods, setComparisonFoods] = useState<string[]>([]); // codes of the foods to compare of moment

    const addToComparison = (item: string) => {
        setComparisonFoods(prev => {
        if (prev.some(i => i === item)) {
            return prev;
        }
        return [...prev, item];
        });
        
      };
      const removeFromComparison = (code: string) => {
        setComparisonFoods(prev => prev.filter(item => item !== code));
      };

      const clearComparison = () => {
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
