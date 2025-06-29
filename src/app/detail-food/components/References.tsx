import { type I18nObject, useTranslation } from "@/context/I18nContext";
import type { Reference } from "@/types/SingleFoodResult";
import type { JSX } from "react";

type ReferenceProps = {
    data: Reference[];
};

export default function References({ data }: ReferenceProps): JSX.Element {
    const { t } = useTranslation();

    return (
        <div className="space-y-[16px] p-[4px]">
            {data.length === 0 ? (
                <p className="text-[#64748b] italic">{t.foodDetail.references.none}</p>
            ) : (data.map((reference) => (
                <div
                    key={reference.code}
                    className="
                    p-[16px]
                    border-l-[4px]
                    border-[#8ad1aa]
                    rounded-r-[8px]
                    bg-[#f8fafc]
                    hover:bg-[#f1f5f9]
                    transition-colors
                    duration-[200ms]
                    shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                    "
                >
                    <div className="flex items-start gap-[12px]">
                        <div className="text-[24px] mt-[2px]" aria-hidden="true">
                            {getReferenceIcon(reference.type)}
                        </div>
                        <div className="flex-1">
                            <p className="text-[15px] leading-[1.6] text-[#334155]">
                                [{reference.code}] {formatCitation(reference, t)}
                            </p>
                            <div className="mt-[8px] text-[13px] text-[#64748b]">
                                {reference.volumeYear && (
                                    <span>{t.foodDetail.references.published} {reference.volumeYear}</span>
                                )}
                                <span
                                    className="
                                    inline-block
                                    bg-[#e2e8f0]
                                    text-[#475569]
                                    rounded-[4px]
                                    px-[8px]
                                    py-[2px]
                                    text-[11px]
                                    uppercase
                                    font-[600]
                                    mr-[8px]
                                    "
                                >
                                    {t.foodDetail.references[reference.type]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )))}
        </div>
    );
}

function getReferenceIcon(type: Reference["type"]): string {
    switch (type) {
        case "article":
            return "📄";
        case "book":
            return "📚";
        case "thesis":
            return "🎓";
        case "report":
            return "📊";
        case "website":
            return "🌐";
        default:
            return "📝";
    }
}

function formatAuthors(authors: string[]): string {
    if (authors.length === 0) return "";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} et al.`;
}

function formatCitation(reference: Reference, t: I18nObject): JSX.Element {
    const authors = formatAuthors(reference.authors);
    const year = reference.refYear ? `(${reference.refYear})` : "";
    const title = reference.title ? `"${reference.title}"` : "";

    switch (reference.type) {
        case "article":
            return <>
                <span className="font-[500]">{authors}</span> {year}. {title}.
                {reference.journalName && <span className="italic">{reference.journalName}</span>}
                {reference.volume && <span>, {reference.volume}</span>}
                {reference.issue && <span>({reference.issue})</span>}
                {(reference.pageStart && reference.pageEnd)
                    && <span>, pp. {reference.pageStart}-{reference.pageEnd}</span>}
                {reference.other && <span>. {reference.other}</span>}
            </>;

        case "book":
            return <>
                <span className="font-[500]">{authors}</span> {year}.
                <span className="italic">{title}</span>.
                {reference.cityName && <span>{reference.cityName}</span>}
                {reference.other && <span>. {reference.other}</span>}
            </>;

        case "thesis":
            return <>
                <span className="font-[500]">{authors}</span> {year}. {title}
                <span className="italic"> [{t.foodDetail.references.thesis}]</span>.
                {reference.cityName && <span>{reference.cityName}</span>}
                {reference.other && <span>. {reference.other}</span>}
            </>;

        case "report":
            return <>
                <span className="font-[500]">{authors}</span> {year}. {title}
                <span className="italic"> [{t.foodDetail.references.report}]</span>.
                {reference.other && <span>{reference.other}</span>}
            </>;

        case "website":
            return <>
                <span className="font-[500]">{authors}</span> {year}. {title}.{" "}
                <span className="italic">{t.foodDetail.references.retrievedFrom} {reference.other}</span>
            </>;

        default:
            return <>
                <span className="font-[500]">{authors}</span> {year}. {title}
                {reference.other && <span>. {reference.other}</span>}
            </>;
    }
}
