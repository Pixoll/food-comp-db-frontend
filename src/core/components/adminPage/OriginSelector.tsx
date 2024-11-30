import React, { useState, useRef } from "react";
import "../../../assets/css/_OriginSelector.css"
const OriginSelector: React.FC = () => {
    const [isActive, setIsActive] = useState(false); // Controla la visibilidad del menú desplegable
    const [searchTerm, setSearchTerm] = useState(""); // Maneja la búsqueda
    const [selectedValue, setSelectedValue] = useState(""); // Almacena el valor seleccionado
    const options = ["Region1", "Region2", "Region3"]; // Opciones disponibles

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectOption = (option: string) => {
        setSelectedValue(option);
        setIsActive(false); // Cierra el menú desplegable
    };

    return (
        <div className={`select-box-for-origin ${isActive ? "active" : ""}`}>
            {/* Input para mostrar el valor seleccionado */}
            <div
                className="select-option"
                onClick={() => setIsActive(!isActive)}
            >
                <input
                    type="text"
                    placeholder="Selecciona"
                    value={selectedValue}
                    id="soValue"
                    readOnly
                />
            </div>

            {/* Contenedor desplegable */}
            {isActive && (
                <div className="origins-content">
                    {/* Input de búsqueda */}
                    <div className="search-origin">
                        <input
                            type="text"
                            id="originOptionSearch"
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Opciones filtradas */}
                    <ul className="originsOptions">
                        {filteredOptions.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleSelectOption(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OriginSelector;