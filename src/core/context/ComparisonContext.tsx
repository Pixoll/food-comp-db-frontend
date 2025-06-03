import { createContext, useState, useContext } from "react";
type foodTag = {
  code: string;
  name: string;
};
type ComparisonContextType = {
  comparisonFoods: foodTag[];
  addToComparison: (food: foodTag) => void;
  removeFromComparison: (itemId: string) => void;
  clearComparison: () => void;
};
const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

export default function ComparisonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [comparisonFoods, setComparisonFoods] = useState<foodTag[]>([]); // codes of the foods to compare of moment

  const addToComparison = (food: foodTag) => {
    setComparisonFoods((prev) => {
      if (prev.some((i) => i.code === food.code)) {
        return prev;
      }
      return [...prev, food]; // Assuming the name is the same as the code for now
    });
  };

  const removeFromComparison = (code: string) => {
    setComparisonFoods((prev) => prev.filter((item) => item.code !== code));
  };

  const clearComparison = () => {
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
    throw new Error(
      "useComparison debe usarse dentro de un ComparisonProvider"
    );
  }

  return context;
}
