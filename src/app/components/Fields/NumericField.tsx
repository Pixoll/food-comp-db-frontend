import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import TextField from "./TextField";

type NumericFieldProps = {
    label?: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    allowDecimals?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
    fullWidth?: boolean;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    icon?: ReactNode;
    className?: string;
};

export default function NumericField({
    label,
    value,
    onChange,
    allowDecimals = true,
    min = 0,
    max,
    required = false,
    fullWidth = false,
    error = false,
    errorMessage,
    helperText,
    disabled = false,
    id,
    name,
    icon,
    className,
    ...rest
}: NumericFieldProps): JSX.Element {
    const [inputValue, setInputValue] = useState(value?.toString() || "");

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value;

        if (newValue === "") {
            setInputValue("");
            onChange(undefined);
            return;
        }

        if (allowDecimals && newValue === ".") {
            setInputValue(".");
            return;
        }

        const pattern = allowDecimals ? /^-?(\d*\.?\d*|\.\d*)$/ : /^-?\d+$/;
        if (!pattern.test(newValue)) {
            return;
        }

        setInputValue(newValue);

        if (newValue === "."
            || newValue === "-"
            || (allowDecimals && newValue.endsWith("."))
        ) {
            return;
        }

        const parsedValue = allowDecimals ? parseFloat(newValue) : parseInt(newValue);
        if (isNaN(parsedValue)) {
            return;
        }

        if (min !== undefined && parsedValue < min) {
            return;
        }
        if (max !== undefined && parsedValue > max) {
            return;
        }

        onChange(parsedValue);
    };

    useEffect(() => {
        if (value === undefined && inputValue !== "") {
            setInputValue("");
        } else if (value !== undefined && value.toString() !== inputValue) {
            setInputValue(value.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <TextField
            label={label}
            value={inputValue}
            onChange={handleChange}
            type="text"
            inputMode={allowDecimals ? "decimal" : "numeric"}
            required={required}
            fullWidth={fullWidth}
            error={error}
            errorMessage={errorMessage}
            helperText={helperText}
            disabled={disabled}
            id={id}
            name={name}
            icon={icon}
            className={className}
            {...rest}
        />
    );
}
