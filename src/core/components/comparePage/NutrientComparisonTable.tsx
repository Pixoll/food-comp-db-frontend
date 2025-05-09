import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { NutrientsValue, NutrientMeasurement, NutrientMeasurementWithComponents } from '../../types/SingleFoodResult';
import { GetFoodMeasurementsResult } from '../../../pages/comparison/ComparisonPage';
import '../../../assets/css/_NutrientComparisonTable.css';

type NutrientComparisonTableProps = {
  foodsData: GetFoodMeasurementsResult[];
  onRemoveFood: (code: string) => void;
};

export default function NutrientComparisonTable({ foodsData, onRemoveFood }: NutrientComparisonTableProps) {
  const [expandedSections, setExpandedSections] = useState({
    energy: true,
    macronutrients: true,
    micronutrients: false,
    vitamins: false,
    minerals: false
  });
  console.log(foodsData)
  const [expandedNutrients, setExpandedNutrients] = useState<Record<string, boolean>>({});
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const toggleNutrient = (nutrientId: number) => {
    setExpandedNutrients(prev => ({
      ...prev,
      [nutrientId]: !prev[nutrientId]
    }));
  };
  
  const getFoodName = (commonName: { es: string } | string) => {
    if (typeof commonName === 'object' && commonName.es) {
      return commonName.es;
    }
    return commonName as string;
  };
  
  const renderNutrientRow = (
    nutrient: NutrientMeasurement, 
    indentLevel: number = 0, 
    isComponent: boolean = false
  ) => {
    return (
      <tr key={`${nutrient.nutrientId}-${indentLevel}`} className={isComponent ? 'nutrient-component-row' : ''}>
        <td className="nutrient-name" style={{ paddingLeft: `${indentLevel * 20 + 16}px` }}>
          {nutrient.name}
          {nutrient.dataType && (
            <span className={`data-type-badge ${nutrient.dataType}`} title={nutrient.dataType}>
              {nutrient.dataType.charAt(0)}
            </span>
          )}
        </td>
        <td className="nutrient-unit">{nutrient.measurementUnit}</td>
        
        {foodsData.map(food => (
          <td key={`${food.code}-${nutrient.nutrientId}`} className="nutrient-value">
            {getNutrientValue(food.nutrientMeasurements, nutrient.nutrientId)}
          </td>
        ))}
      </tr>
    );
  };
  
  const getNutrientValue = (nutrientMeasurements: NutrientsValue, nutrientId: number): string => {
    if (nutrientMeasurements?.energy) {
      const energyNutrient = nutrientMeasurements.energy.find(n => n.nutrientId === nutrientId);
      if (energyNutrient) {
        return energyNutrient.average?.toString() || '-';
      }
    }
    
    if (nutrientMeasurements?.macronutrients) {
      const macroNutrient = nutrientMeasurements.macronutrients.find(n => n.nutrientId === nutrientId);
      if (macroNutrient) {
        return macroNutrient.average?.toString() || '-';
      }
      
      for (const macro of nutrientMeasurements.macronutrients) {
        if (macro.components) {
          const component = macro.components.find(c => c.nutrientId === nutrientId);
          if (component) {
            return component.average?.toString() || '-';
          }
        }
      }
    }
    
    if (nutrientMeasurements?.micronutrients) {
      if (nutrientMeasurements.micronutrients.vitamins) {
        const vitamin = nutrientMeasurements.micronutrients.vitamins.find(n => n.nutrientId === nutrientId);
        if (vitamin) {
          return vitamin.average?.toString() || '-';
        }
      }
      
      if (nutrientMeasurements.micronutrients.minerals) {
        const mineral = nutrientMeasurements.micronutrients.minerals.find(n => n.nutrientId === nutrientId);
        if (mineral) {
          return mineral.average?.toString() || '-';
        }
      }
    }
    
    return '-';
  };
  
  const renderExpandableNutrient = (nutrient: NutrientMeasurementWithComponents, indentLevel: number = 0) => {
    const isExpanded = expandedNutrients[nutrient.nutrientId] || false;
    const hasComponents = nutrient.components && nutrient.components.length > 0;
    
    return (
      <React.Fragment key={`${nutrient.nutrientId}-expandable`}>
        <tr>
          <td className="nutrient-name clickable" style={{ paddingLeft: `${indentLevel * 20 + 16}px` }} onClick={() => hasComponents && toggleNutrient(nutrient.nutrientId)}>
            {hasComponents && (
              isExpanded ? <ChevronDown size={16} className="me-1" /> : <ChevronRight size={16} className="me-1" />
            )}
            {nutrient.name}
            {nutrient.dataType && (
              <span className={`data-type-badge ${nutrient.dataType}`} title={nutrient.dataType}>
                {nutrient.dataType.charAt(0)}
              </span>
            )}
          </td>
          <td className="nutrient-unit">{nutrient.measurementUnit}</td>
          
          {foodsData.map(food => (
            <td key={`${food.code}-${nutrient.nutrientId}`} className="nutrient-value">
              {getNutrientValue(food.nutrientMeasurements, nutrient.nutrientId)}
            </td>
          ))}
        </tr>
        
        {isExpanded && hasComponents && nutrient.components.map(comp => 
          renderNutrientRow(comp, indentLevel + 1, true)
        )}
      </React.Fragment>
    );
  };
  
  return (
    <div className="nutrient-comparison-table">
      <Table striped bordered hover responsive>
        <thead>
          <tr className="table-header">
            <th className="nutrient-header">Nutrientes</th>
            <th className="unit-header">Unidad</th>
            
            {foodsData.map(food => (
              <th key={food.code} className="food-header">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{getFoodName(food.commonName.es || "")}</span>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="remove-food-btn" 
                    onClick={() => onRemoveFood(food.code)}
                    aria-label={`Remove ${getFoodName(food.commonName.es || "")}`}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          <tr className="section-header">
            <td colSpan={2 + foodsData.length} className="clickable" onClick={() => toggleSection('energy')}>
              {expandedSections.energy ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Valor energético
            </td>
          </tr>
          
          {expandedSections.energy && foodsData[0]?.nutrientMeasurements?.energy?.map(nutrient => 
            renderNutrientRow(nutrient)
          )}
          <tr className="section-header">
            <td colSpan={2 + foodsData.length} className="clickable" onClick={() => toggleSection('macronutrients')}>
              {expandedSections.macronutrients ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Nutrientes principales
            </td>
          </tr>
          
          {expandedSections.macronutrients && foodsData[0]?.nutrientMeasurements?.macronutrients?.map(nutrient => 
            renderExpandableNutrient(nutrient)
          )}
          
          <tr className="section-header">
            <td colSpan={2 + foodsData.length} className="clickable" onClick={() => toggleSection('micronutrients')}>
              {expandedSections.micronutrients ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Micronutrientes
            </td>
          </tr>
          
          {expandedSections.micronutrients && (
            <>
              <tr className="subsection-header">
                <td colSpan={2 + foodsData.length} className="clickable" onClick={() => toggleSection('vitamins')}>
                  {expandedSections.vitamins ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Vitaminas
                </td>
              </tr>
              
              {expandedSections.vitamins && foodsData[0]?.nutrientMeasurements?.micronutrients?.vitamins?.map(nutrient => 
                renderNutrientRow(nutrient)
              )}
              
              <tr className="subsection-header">
                <td colSpan={2 + foodsData.length} className="clickable" onClick={() => toggleSection('minerals')}>
                  {expandedSections.minerals ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Minarales
                </td>
              </tr>
              
              {expandedSections.minerals && foodsData[0]?.nutrientMeasurements?.micronutrients?.minerals?.map(nutrient => 
                renderNutrientRow(nutrient)
              )}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
}