import { useComparison } from "../../core/context/ComparisonContext"; 
export default function ComparisonPage() {
     const { comparisonFoods } = useComparison();
    return (
        <div>
            <h1>Comparison Page</h1>
            <div className="comparison-container">
                {comparisonFoods.length > 0 ? (
                    comparisonFoods.map((food, index) => (
                        <div key={index} className="comparison-item">
                            <p>{food}</p>
                        </div>
                    ))
                ) : (
                    <p>No items to compare</p>
                )}
            </div>
        </div>
         )   
}