import TextField from "./TextField";
import { useState, useEffect } from "react";

type NumericFieldProps = {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    allowDecimals?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
    fullWidth?: boolean;
    error?: boolean;
    errorMessage?: string;
};

export default function NumericField({
                                         label,
                                         value,
                                         onChange,
                                         allowDecimals = true,
                                         min = 0,
                                         max,
                                         ...props
                                     }: NumericFieldProps) {
    const [inputValue, setInputValue] = useState(value?.toString() || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (newValue === '') {
            setInputValue('');
            onChange(undefined);
            return;
        }

        if (allowDecimals && newValue === '.') {
            setInputValue('.');
            return;
        }

        const pattern = allowDecimals ? /^(\d*\.?\d*|\.\d*)$/ : /^\d+$/;

        if (!pattern.test(newValue)) {
            return;
        }

        setInputValue(newValue);

        if (newValue === '.' || (allowDecimals && newValue.endsWith('.'))) {
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
        setInputValue(value?.toString() || '');
    }, [value]);

    return (
        <TextField
            label={label}
            value={inputValue}
            onChange={e => handleChange(e)}
            type="text"
            inputMode={allowDecimals ? "decimal" : "numeric"}
            {...props}
        />
    );
}
