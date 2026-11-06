"use client";

import api from "@/api";
import {
    Button,
    ButtonLink,
    Card,
    ErrorState,
    LoadingState,
    PageContainer,
    PageHeader,
    type SelectOption,
} from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { FetchStatus, useApi, useGroups, useNutrients, useReferences, useScientificNames } from "@/hooks";
import { apiErrorMessage } from "@/utils/apiError";
import { foodDisplayName } from "@/utils/nutrients";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type JSX, useEffect, useMemo, useState } from "react";
import {
    buildCreatePayload,
    buildUpdatePayload,
    countChanges,
    countErrors,
    emptyFormValues,
    type FoodFormMode,
    type FoodFormValues,
    filledMeasurementIds,
    formValuesFromFood,
    type MeasurementDraft,
    validateFoodForm,
} from "./formModel";
import GeneralSection from "./GeneralSection";
import MeasurementsSection from "./MeasurementsSection";
import ReferencesSection from "./ReferencesSection";

type GroupsHook = ReturnType<typeof useGroups>;
type ScientificNamesHook = ReturnType<typeof useScientificNames>;

/** Formulario para crear un alimento nuevo. */
export function NewFoodForm(): JSX.Element {
    const groups = useGroups();
    const scientificNames = useScientificNames();

    return (
        <FoodFormBody
            mode="create"
            initial={emptyFormValues()}
            groups={groups}
            scientificNames={scientificNames}
        />
    );
}

/** Carga el alimento y sus catálogos, y abre el formulario con los valores guardados. */
export function EditFoodForm({ code }: { code: string }): JSX.Element {
    const { t } = useTranslation();
    const groups = useGroups();
    const scientificNames = useScientificNames();
    const result = useApi([code], (client, foodCode) => client.getFood({ path: { code: foodCode } }));

    if (result.status === FetchStatus.Failed) {
        return (
            <PageContainer>
                <Card>
                    <ErrorState
                        title={t.foodDetail.notFound}
                        description={t.foodDetail.notFoundDescription(code)}
                        action={<ButtonLink href="/search" variant="secondary">{t.foodDetail.backToSearch}</ButtonLink>}
                    />
                </Card>
            </PageContainer>
        );
    }

    if (result.status === FetchStatus.Loading
        || groups.status === FetchStatus.Loading
        || scientificNames.status === FetchStatus.Loading
    ) {
        return (
            <PageContainer>
                <LoadingState label={t.foodForm.loading}/>
            </PageContainer>
        );
    }

    const food = result.data;
    const initial = formValuesFromFood(
        code,
        food,
        groups.codeToId.get(food.group.code),
        food.scientificName ? scientificNames.nameToId.get(food.scientificName) : undefined
    );

    return (
        <FoodFormBody
            key={code}
            mode="edit"
            initial={initial}
            title={foodDisplayName(food, code)}
            groups={groups}
            scientificNames={scientificNames}
        />
    );
}

type FoodFormBodyProps = {
    mode: FoodFormMode;
    initial: FoodFormValues;
    title?: string;
    /** Catálogos compartidos con el cargador, para no pedirlos dos veces. */
    groups: GroupsHook;
    scientificNames: ScientificNamesHook;
};

function FoodFormBody({ mode, initial, title, groups, scientificNames }: FoodFormBodyProps): JSX.Element {
    const { t } = useTranslation();
    const f = t.foodForm;
    const router = useRouter();
    const { addToast } = useToast();
    const nutrients = useNutrients();
    const references = useReferences();

    const [values, setValues] = useState<FoodFormValues>(initial);
    const [original] = useState<FoodFormValues | null>(mode === "edit" ? initial : null);
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [codeTaken, setCodeTaken] = useState(false);

    const errors = useMemo(() => validateFoodForm(values, mode, original, t), [values, mode, original, t]);
    const errorCount = countErrors(errors) + (codeTaken ? 1 : 0);
    const changes = original ? countChanges(values, original) : null;
    const filledIds = filledMeasurementIds(values);
    const dirty = original ? (changes ?? 0) > 0 : JSON.stringify(values) !== JSON.stringify(initial);

    useEffect(() => {
        if (!dirty || saving) return;
        const onBeforeUnload = (event: BeforeUnloadEvent): void => event.preventDefault();
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [dirty, saving]);

    const groupOptions: Array<SelectOption<number>> = useMemo(() => [...groups.idToObject.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(g => ({ value: g.id, label: g.name, description: g.code })), [groups.idToObject]);

    const scientificNameOptions: Array<SelectOption<number>> = useMemo(() => [...scientificNames.idToObject.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(s => ({ value: s.id, label: s.name })), [scientificNames.idToObject]);

    const referenceOptions: Array<SelectOption<number>> = useMemo(() => references.references
        .map(r => ({
            value: r.code,
            label: r.text ?? `${r.code}`,
            description: `${t.referencesAdmin.code} ${r.code}`,
        })),
    [references.references, t]);

    const update = (patch: Partial<FoodFormValues>): void => {
        if (patch.code !== undefined) setCodeTaken(false);
        setValues(prev => ({ ...prev, ...patch }));
    };

    const updateMeasurement = (nutrientId: number, draft: MeasurementDraft): void => {
        setValues(prev => ({ ...prev, measurements: { ...prev.measurements, [nutrientId]: draft } }));
    };

    const checkCode = async (): Promise<void> => {
        const code = values.code.trim();
        if (mode !== "create" || errors.code || !code) return;
        const result = await api.getFood({ path: { code } }).catch(() => null);
        setCodeTaken(!!result?.data);
    };

    const applyReferencesToAll = (): void => {
        setValues(prev => {
            const measurements = { ...prev.measurements };
            for (const id of filledMeasurementIds(prev)) {
                const draft = measurements[id];
                measurements[id] = {
                    ...draft,
                    referenceCodes: [...new Set([...draft.referenceCodes, ...prev.foodReferences])],
                };
            }
            return { ...prev, measurements };
        });
        addToast({
            type: "Success",
            message: f.applied(filledIds.length),
            position: "top-end",
            duration: 3000,
        });
    };

    const onReferenceCreated = (code: number): void => {
        references.forceReload();
        setValues(prev => ({ ...prev, foodReferences: [...prev.foodReferences, code] }));
        addToast({ type: "Success", message: t.referencesAdmin.created(code), position: "top-end", duration: 3000 });
    };

    const onScientificNameCreated = async (name: string): Promise<number | undefined> => {
        scientificNames.forceReload();
        const result = await api.getScientificNames().catch(() => null);
        const created = result?.data?.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (created) {
            addToast({
                type: "Success",
                message: t.addScientificName.created(created.name),
                position: "top-end",
                duration: 3000,
            });
        }
        return created?.id;
    };

    const showError = (message: string, title = f.errorTitle): void => {
        addToast({ type: "Danger", title, message, position: "top-end", duration: 6000 });
    };

    const submit = async (): Promise<void> => {
        setSubmitted(true);

        if (errorCount > 0) {
            showError(f.reviewErrors);
            return;
        }

        const code = (mode === "create" ? values.code : initial.code).trim().toUpperCase();

        if (mode === "edit" && original) {
            const body = buildUpdatePayload(values, original);
            if (Object.keys(body).length === 0) {
                addToast({ type: "Info", message: f.noChanges, position: "top-end", duration: 3000 });
                return;
            }

            setSaving(true);
            const result = await api.updateFood({ path: { code }, body }).catch(error => ({ error }));
            setSaving(false);

            if (result.error) {
                showError(apiErrorMessage(result.error, t.common.unknownError));
                return;
            }

            addToast({ type: "Success", message: f.updated, position: "top-end", duration: 4000 });
            router.push(`/detail-food/${code}`);
            return;
        }

        setSaving(true);
        const result = await api.createFood({ path: { code }, body: buildCreatePayload(values) })
            .catch(error => ({ error }));
        setSaving(false);

        if (result.error) {
            const message = apiErrorMessage(result.error, t.common.unknownError);
            if (/already exists/i.test(message)) setCodeTaken(true);
            showError(message);
            return;
        }

        addToast({ type: "Success", message: f.created, position: "top-end", duration: 4000 });
        router.push(`/detail-food/${code}`);
    };

    const loadingCatalogs = nutrients.status === FetchStatus.Loading;

    return (
        <PageContainer width="lg" className="pb-32">
            <PageHeader
                eyebrow={(
                    <>
                        <Link href="/admin-page" className="hover:text-carbon">{t.adminPage.title}</Link>
                        <ChevronRight size={14}/>
                        <span>{mode === "create" ? f.newTitle : initial.code}</span>
                    </>
                )}
                title={mode === "create" ? f.newTitle : title ?? f.editTitle}
                description={mode === "create" ? f.newDescription : `${f.editTitle} · ${f.editDescription}`}
                actions={mode === "edit" && (
                    <ButtonLink
                        href={`/detail-food/${initial.code}`}
                        variant="secondary"
                        icon={<ExternalLink size={16}/>}
                    >
                        {f.viewFood}
                    </ButtonLink>
                )}
            />

            <form
                className="space-y-6"
                noValidate
                onSubmit={e => {
                    e.preventDefault();
                    void submit();
                }}
            >
                <GeneralSection
                    mode={mode}
                    values={values}
                    errors={errors}
                    showErrors={submitted}
                    codeTaken={codeTaken}
                    onChange={update}
                    onCodeBlur={() => void checkCode()}
                    groupOptions={groupOptions}
                    scientificNameOptions={scientificNameOptions}
                    onScientificNameCreated={onScientificNameCreated}
                />

                <ReferencesSection
                    selected={values.foodReferences}
                    onChange={foodReferences => update({ foodReferences })}
                    options={referenceOptions}
                    nextCode={references.nextCode}
                    filledCount={filledIds.length}
                    onApplyToAll={applyReferencesToAll}
                    onReferenceCreated={onReferenceCreated}
                />

                {loadingCatalogs ? (
                    <Card><LoadingState label={t.common.loading}/></Card>
                ) : (
                    <MeasurementsSection
                        mode={mode}
                        catalog={nutrients.list}
                        measurements={values.measurements}
                        saved={original?.measurements ?? {}}
                        errors={errors}
                        showErrors={submitted}
                        referenceOptions={referenceOptions}
                        onChange={updateMeasurement}
                    />
                )}

                <div className="fixed inset-x-0 bottom-0 z-20 border-t border-fog bg-paper/95 backdrop-blur">
                    <div
                        className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4
                        py-3 sm:px-6"
                    >
                        <p className="text-[13px] text-graphite">
                            {submitted && errorCount > 0
                                ? <span className="text-danger">{f.reviewErrors}</span>
                                : changes !== null
                                    ? f.unsavedChanges(changes)
                                    : f.filled(filledIds.length, nutrients.list.length)}
                        </p>
                        <div className="flex gap-2">
                            {mode === "edit" && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setValues(initial);
                                        setSubmitted(false);
                                    }}
                                    disabled={!dirty || saving}
                                >
                                    {f.discard}
                                </Button>
                            )}
                            <Button type="submit" disabled={saving || (mode === "edit" && !dirty)}>
                                {saving ? f.saving : mode === "create" ? f.save : f.saveChanges}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </PageContainer>
    );
}
