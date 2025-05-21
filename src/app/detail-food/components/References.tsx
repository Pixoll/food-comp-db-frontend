import {Reference} from "../../../core/types/SingleFoodResult";

type ReferenceProps = {
    data: Reference[];
};

export default function References({data}: ReferenceProps) {
    const formatAuthors = (authors: string[]) => {
        if (authors.length === 0) return "";
        if (authors.length === 1) return authors[0];
        if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
        return `${authors[0]} et al.`;
    };

    const formatCitation = (reference: Reference) => {
        const authors = formatAuthors(reference.authors);
        const year = reference.refYear ? `(${reference.refYear})` : "";
        const title = reference.title ? `"${reference.title}"` : "";

        switch (reference.type) {
            case "article":
                return (
                    <>
                        <span className="font-[500]">{authors}</span> {year}. {title}.
                        {reference.journalName && <span className="italic">{reference.journalName}</span>}
                        {reference.volume && <span>, {reference.volume}</span>}
                        {reference.issue && <span>({reference.issue})</span>}
                        {(reference.pageStart && reference.pageEnd) &&
                            <span>, pp. {reference.pageStart}-{reference.pageEnd}</span>}
                        {reference.other && <span>. {reference.other}</span>}
                    </>
                );

            case "book":
                return (
                    <>
                        <span className="font-[500]">{authors}</span> {year}.
                        <span className="italic">{title}</span>.
                        {reference.cityName && <span>{reference.cityName}</span>}
                        {reference.other && <span>. {reference.other}</span>}
                    </>
                );

            case "thesis":
                return (
                    <>
                        <span className="font-[500]">{authors}</span> {year}. {title}
                        <span className="italic"> [Thesis]</span>.
                        {reference.cityName && <span>{reference.cityName}</span>}
                        {reference.other && <span>. {reference.other}</span>}
                    </>
                );

            case "report":
                return (
                    <>
                        <span className="font-[500]">{authors}</span> {year}. {title}
                        <span className="italic"> [Report]</span>.
                        {reference.other && <span>{reference.other}</span>}
                    </>
                );

            case "website":
                return (
                    <>
                        <span className="font-[500]">{authors}</span> {year}. {title}.
                        <span className="italic">Retrieved from {reference.other}</span>
                    </>
                );

            default:
                return (
                    <>
                        <span className="font-[500]">{authors}</span> {year}. {title}
                        {reference.other && <span>. {reference.other}</span>}
                    </>
                );
        }
    };

    const getReferenceIcon = (type: Reference['type']) => {
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
    };

    return (
        <div className="space-y-[16px] p-[4px]">

            {data.length === 0 ? (
                <p className="text-[#64748b] italic">No tiene referencias asignadas</p>
            ) : (
                data.map((reference) => (
                    <div
                        className="p-[16px] border-l-[4px] border-[#8ad1aa] rounded-r-[8px] bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                        key={reference.code}
                    >
                        <div className="flex items-start gap-[12px]">
                            <div className="text-[24px] mt-[2px]" aria-hidden="true">
                                {getReferenceIcon(reference.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] leading-[1.6] text-[#334155]">
                                    [{reference.code}] {formatCitation(reference)}
                                </p>
                                <div className="mt-[8px] text-[13px] text-[#64748b]">
                  <span
                      className="inline-block bg-[#e2e8f0] text-[#475569] rounded-[4px] px-[8px] py-[2px] text-[11px] uppercase font-[600] mr-[8px]">
                    {reference.type}
                  </span>
                                    {reference.volumeYear && <span>Published: {reference.volumeYear}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
