"use client";

import { ButtonLink, Card, EmptyState, LoadingState, PageContainer } from "@/app/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/I18nContext";
import { Lock } from "lucide-react";
import type { JSX, ReactNode } from "react";

/**
 * Muestra el contenido solo a administradores con sesión iniciada.
 * El backend igual valida la sesión en cada petición; esto solo evita mostrar formularios inútiles.
 */
export default function RequireAdmin({ children }: { children: ReactNode }): JSX.Element {
    const { t } = useTranslation();
    const { state } = useAuth();

    if (!state.checked) {
        return (
            <PageContainer>
                <LoadingState label={t.common.loading}/>
            </PageContainer>
        );
    }

    if (!state.isAuthenticated) {
        return (
            <PageContainer width="md">
                <Card>
                    <EmptyState
                        icon={<Lock size={20}/>}
                        title={t.common.signInRequired}
                        action={<ButtonLink href="/login">{t.common.signIn}</ButtonLink>}
                    />
                </Card>
            </PageContainer>
        );
    }

    return <>{children}</>;
}
