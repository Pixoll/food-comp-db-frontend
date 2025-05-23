'use client'
import { ChangeEvent, useState } from "react";

type FormState<T> = {
  [K in keyof T]: T[K];
};
function setNestedValue(obj: any, path: string, value: any): any {
  if (!path) return value;

  const result = Array.isArray(obj) ? [...obj] : { ...obj };

  const pathParts = path.split('.');
  let current = result;

  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];

    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);

    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;

      if (!current[arrayName]) {
        current[arrayName] = [];
      }

      if (!current[arrayName][+(index)]) {
        current[arrayName][+(index)] = {};
      }

      current = current[arrayName][+(index)];
    } else {
      if (!current[part]) {
        current[part] = {};
      }

      current = current[part];
    }
  }

  const lastPart = pathParts[pathParts.length - 1];
  const arrayMatch = lastPart.match(/^(.+)\[(\d+)\]$/);

  if (arrayMatch) {
    const [, arrayName, index] = arrayMatch;
    if (!current[arrayName]) {
      current[arrayName] = [];
    }
    current[arrayName][+(index)] = value;
  } else {
    current[lastPart] = value;
  }

  return result;
}
export function useForm<T extends object>(initialForm: FormState<T>) {
  const [formState, setFormState] = useState<FormState<T>>(initialForm);

  const onInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    console.log(target);
    const { name, value } = target;
    setFormState((prevState: any) => setNestedValue(prevState, name, value));
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    setFormState,
    onInputChange,
    onResetForm,
  };
}
