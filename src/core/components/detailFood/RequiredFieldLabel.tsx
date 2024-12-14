import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { HelpCircleIcon } from "lucide-react";

interface RequiredFieldLabelProps {
  label?: string;
  tooltipMessage: string;
}

const RequiredFieldLabel: React.FC<RequiredFieldLabelProps> = ({
  label,
  tooltipMessage,
}) => {
  return (
    <div className="d-inline-flex align-items-center gap-2">
      {label && <span className="text-dark">{label}</span>}
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-${label || 'required'}`}>
            {tooltipMessage}
          </Tooltip>
        }
      >
        <span 
          className="text-danger d-inline-flex align-items-center" 
          style={{ 
            cursor: "help", 
            userSelect: "none" 
          }}
        >
          <HelpCircleIcon 
            color="red"
            size={16} 
            className="text-muted ms-1" 
            strokeWidth={2}
          />
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default RequiredFieldLabel;