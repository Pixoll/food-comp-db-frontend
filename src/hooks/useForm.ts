"use client";

import { type ChangeEvent, useState } from "react";

export type FormState<T> = {
    [K in keyof T]: T[K];
};

type AnyValue<T> = FormState<T>[keyof FormState<T>];

export function setNestedValue<T>(obj: FormState<T>, path: string, value: unknown): FormState<T> {
    if (!path) {
        // TODO was value, check if something broke
        return obj;
    }

    const result = (Array.isArray(obj) ? [...obj] : { ...obj }) as FormState<T>;

    const pathParts = path.split(".");
    let current = result;

    for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];

        const arrayMatch = part.match(/^(.+)\[(\d+)]$/);

        if (arrayMatch) {
            const arrayName = arrayMatch[1] as keyof FormState<T>;
            const index = +arrayMatch[2];

            if (!current[arrayName]) {
                current[arrayName] = [] as AnyValue<T>;
            }

            const array = current[arrayName] as unknown[];

            if (!array[index]) {
                array[index] = {};
            }

            current = array[index] as FormState<T>;
        } else {
            const key = part as keyof FormState<T>;
            if (!current[key]) {
                current[key] = {} as AnyValue<T>;
            }

            current = current[key] as FormState<T>;
        }
    }

    const lastPart = pathParts[pathParts.length - 1];
    const arrayMatch = lastPart.match(/^(.+)\[(\d+)]$/);

    if (arrayMatch) {
        const arrayName = arrayMatch[1] as keyof FormState<T>;
        const index = +arrayMatch[2];

        if (!current[arrayName]) {
            current[arrayName] = [] as AnyValue<T>;
        }

        const array = current[arrayName] as unknown[];
        array[index] = value;
    } else {
        current[lastPart as keyof FormState<T>] = value as AnyValue<T>;
    }

    return result;
}

type UseForm<T extends object> = FormState<T> & {
    formState: FormState<T>;
    setFormState: (newFormState: FormState<T> | ((prev: FormState<T>) => FormState<T>)) => void;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onResetForm: () => void;
};

export function useForm<T extends object>(initialForm: FormState<T>): UseForm<T> {
    const [formState, setFormState] = useState<FormState<T>>(initialForm);

    const onInputChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = target;
        setFormState((prevState: FormState<T>) => setNestedValue(prevState, name, value));
    };

    const onResetForm = (): void => {
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
