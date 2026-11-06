"use client";

import api from "@/api";
import { Button, Field, Input } from "@/app/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/I18nContext";
import { useForm } from "@/hooks";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, type JSX, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Icon from "../../../public/icon.png";

type LoginForm = {
    username: string;
    password: string;
};

export default function LoginPage(): JSX.Element {
    const { t } = useTranslation();
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { formState, onInputChange, onResetForm } = useForm<LoginForm>({
        username: "",
        password: "",
    });

    const onLogin = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const result = await api.login({
            body: {
                username: formState.username,
                password: formState.password,
            },
        }).catch(err => ({ error: err as unknown }));

        setSubmitting(false);

        if (result.error) {
            const status = (result.error as { statusCode?: number }).statusCode;
            setError(status === 401 || status === 400
                ? t.loginPage.invalid
                : (result.error as { message?: string }).message ?? t.common.unknownError);
            return;
        }

        login();
        onResetForm();
        router.push("/admin-page");
    };

    return (
        <div className="flex w-full max-w-[400px] flex-col rounded-panel border border-fog bg-paper p-8 shadow-panel">
            <Image
                src={Icon}
                alt="CapChiCAL"
                width={48}
                height={48}
                className="mb-5 size-12 rounded-full border border-fog object-contain p-0.5"
            />
            <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-carbon">{t.loginPage.title}</h1>
            <p className="mt-1 text-[14px] text-graphite">{t.loginPage.subtitle}</p>

            <form onSubmit={e => void onLogin(e)} className="mt-6 flex flex-col gap-4">
                <Field label={t.loginPage.username} htmlFor="login-username">
                    <Input
                        id="login-username"
                        name="username"
                        autoComplete="username"
                        value={formState.username}
                        onChange={onInputChange}
                        required
                    />
                </Field>
                <Field label={t.loginPage.password} htmlFor="login-password">
                    <Input
                        id="login-password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={formState.password}
                        onChange={onInputChange}
                        required
                    />
                </Field>
                {error && (
                    <p role="alert" className="rounded-input bg-danger-wash px-3 py-2 text-[13px] text-danger">
                        {error}
                    </p>
                )}
                <Button type="submit" disabled={submitting} icon={<LogIn size={16}/>} className="mt-2 w-full">
                    {submitting ? t.loginPage.submitting : t.loginPage.title}
                </Button>
            </form>
        </div>
    );
}
