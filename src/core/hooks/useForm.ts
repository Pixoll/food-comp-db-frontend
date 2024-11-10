import { useState, ChangeEvent } from "react";

type FormState<T> = {
    [K in keyof T]: T[K];
};

export const useForm = <T extends object>(initialForm: FormState<T>) => {
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
};
export default useForm;