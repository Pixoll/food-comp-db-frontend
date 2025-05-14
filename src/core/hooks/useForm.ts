'use client'
import { ChangeEvent, useState } from "react";

type FormState<T> = {
  [K in keyof T]: T[K];
};

export function useForm<T extends object>(initialForm: FormState<T>) {
  const [formState, setFormState] = useState<FormState<T>>(initialForm);

  const onInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
  };
}
