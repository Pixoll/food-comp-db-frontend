import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const RequiredFieldLabel: React.FC<{ label: string; tooltipMessage: string }> = ({
  label,
  tooltipMessage,
}) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span>{label}</span>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${label}`}>{tooltipMessage}</Tooltip>}
      >
        <span style={{ color: "red", cursor: "pointer" }}>*</span>
      </OverlayTrigger>
    </div>
  );
};

export default RequiredFieldLabel;
