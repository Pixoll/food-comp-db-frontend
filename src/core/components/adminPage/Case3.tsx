import React from "react";

// Definir los tipos de los props
interface IngredientsProps {
  formData: {

      ingredients_es: string;
      ingredients_pt: string;
      ingredients_en: string;
    
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const Ingredients: React.FC<IngredientsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="section">
      <h3 className="subtitle">Ingredientes</h3>
      <div className="form-row">
        <label className="label">Ingredientes (Español):</label>
        <input
          className="input"
          type="text"
          placeholder="Ingredientes en Español"
          value={formData.ingredients_es}
          onChange={(e) => handleInputChange(e, "ingredients_es")}
        />
      </div>
      <div className="form-row">
        <label className="label">Ingredientes (Portugués):</label>
        <input
          className="input"
          type="text"
          placeholder="Ingredientes en Portugués"
          value={formData.ingredients_pt}
          onChange={(e) => handleInputChange(e, "ingredients_pt")}
        />
      </div>
      <div className="form-row">
        <label className="label">Ingredientes (Inglés):</label>
        <input
          className="input"
          type="text"
          placeholder="Ingredientes en Inglés"
          value={formData.ingredients_en}
          onChange={(e) => handleInputChange(e, "ingredients_en")}
        />
      </div>
    </div>
  );
};

export default Ingredients;
