"use client";

import {ChangeEvent, InputHTMLAttributes} from "react";

type TextFieldProps = {
    value: string;
    label?: string;
    required?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "required" | "disabled" | "id" | "name">;

export default function TextField({
                                      value,
                                      label,
                                      required = false,
                                      helperText,
                                      fullWidth = false,
                                      error = false,
                                      errorMessage,
                                      disabled = false,
                                      id,
                                      name,
                                      onChange,
                                      className,
                                      ...rest
                                  }: TextFieldProps) {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        onChange && onChange(e);
    }

    const inputId = id || name || `text-field-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'} mb-[20px]`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`text-[14px] font-[500] mb-[4px] ${error ? 'text-[#dc2626]' : 'text-[#374151]'}`}
                >
                    {label}
                    {required && (<span className="text-[#dc2626] ml-[4px]">*</span>)}
                </label>
            )}

            <input
                id={inputId}
                name={name || inputId}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                aria-required={required}
                aria-invalid={error}
                className={`
          px-[12px] py-[8px] rounded-[6px] border
          ${error ? 'border-[#ef4444] bg-[#fef2f2]' : 'border-[#d1d5db]'} 
          ${disabled ? 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed' : 'bg-[white]'} 
          focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-[#ef4444] focus:border-[#ef4444]' : 'focus:ring-[#3b82f6] focus:border-[#3b82f6]'} 
          transition-colors 
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${className || ''}
        `}
                {...rest}
            />

            {(error && errorMessage) && (
                <p className="mt-[4px] text-[14px] text-[#dc2626]">{errorMessage}</p>
            )}

            {helperText && !error && (
                <p className="mt-[4px] text-[14px] text-[#dc2626]">{helperText}</p>
            )}
        </div>
    );
}
