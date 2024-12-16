import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  XCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";

type ColorVariant =
  | "Primary"
  | "Secondary"
  | "Success"
  | "Danger"
  | "Warning"
  | "Info"
  | "Light"
  | "Dark";

type position =
  | "top-start"
  | "top-center"
  | "top-end"
  | "middle-start"
  | "middle-center"
  | "middle-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

const ToastTypeConfig = {
  Success: {
    icon: CheckCircleIcon,
    color: "success",
    iconColor: "green",
  },
  Danger: {
    icon: XCircleIcon,
    color: "danger",
    iconColor: "red",
  },
  Warning: {
    icon: AlertTriangleIcon,
    color: "warning",
    iconColor: "orange",
  },
  Info: {
    icon: InfoIcon,
    color: "info",
    iconColor: "blue",
  },
  Primary: {
    icon: AlertCircleIcon,
    color: "primary",
    iconColor: "blue",
  },
  Secondary: {
    icon: AlertCircleIcon,
    color: "secondary",
    iconColor: "gray",
  },
  Light: {
    icon: AlertCircleIcon,
    color: "light",
    iconColor: "black",
  },
  Dark: {
    icon: AlertCircleIcon,
    color: "dark",
    iconColor: "black",
  },
};

export type ToastComponentProps = {
  type?: ColorVariant;
  message: string;
  title?: string;
  duration?: number;
  position?: position;
};

export const ToastComponent: React.FC<ToastComponentProps> = ({
  type = "Primary",
  message,
  title,
  duration = 5000,
  position = "middle-center",
}) => {
  const [show, setShow] = useState(true);
  const config = ToastTypeConfig[type];
  const Icon = config.icon;

  const customStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minHeight: "800px",
    maxHeight: "900px",
    minWidth: "700px", 
    maxWidth: "600px", 
    width: "90%", 
    zIndex: 9999, 
  };

  return (
    <ToastContainer position={position} style={customStyle} className="p-3">
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={duration}
        autohide
        className={`border-0 shadow-lg rounded-lg overflow-hidden`}
      >
        <Toast.Header
          closeButton={false}
          className={`bg-${config.color} text-white d-flex align-items-center py-3`}
        >
          <Icon
            size={48} // Increased icon size
            className="me-4"
            color={config.iconColor}
            strokeWidth={2.5}
          />
          <div className="d-flex flex-column">
            <strong className="fs-4 fw-bold mb-1">{title || type}</strong>
            <small className="text-white-50 fs-6">just now</small>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white ms-auto" 
            aria-label="Close"
            onClick={() => setShow(false)}
          />
        </Toast.Header>
        <Toast.Body 
          className={`p-4 fs-5 text-dark bg-${config.color} bg-opacity-10`}
          style={{ lineHeight: 1.5 }}
        >
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
