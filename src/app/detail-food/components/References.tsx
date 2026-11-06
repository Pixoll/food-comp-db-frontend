import type { Reference } from "@/api";
import { EmptyState } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { BookOpen } from "lucide-react";
import type { JSX } from "react";

type ReferencesProps = {
    references: Reference[];
    /** Cantidad de mediciones que citan cada referencia. */
    usage: Map<number, number>;
};

export default function References({ references, usage }: ReferencesProps): JSX.Element {
    const { t } = useTranslation();

    if (references.length === 0) {
        return (
            <EmptyState
                icon={<BookOpen size={20}/>}
                title={t.foodDetail.references.none}
                className="rounded-card border border-fog bg-paper"
            />
        );
    }

    return (
        <ol className="divide-y divide-fog overflow-hidden rounded-card border border-fog bg-paper">
            {references.map(reference => (
                <li key={reference.code} className="flex gap-4 p-5">
                    <span
                        className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-mist px-2
                        text-[12px] font-semibold tabular-nums text-graphite"
                    >
                        {reference.code}
                    </span>
                    <div className="min-w-0">
                        <p className="text-[14px] leading-relaxed text-carbon">{reference.text}</p>
                        {(usage.get(reference.code) ?? 0) > 0 && (
                            <p className="mt-1.5 text-[12px] text-ash">
                                {t.foodDetail.references.usedIn(usage.get(reference.code) ?? 0)}
                            </p>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}
