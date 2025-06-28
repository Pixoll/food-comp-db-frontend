import api, {
    type Author,
    type City,
    type Journal,
    type JournalVolume,
    type NewArticleDto,
    type NewReferenceDto,
} from "@/api";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import type { RecursivePartial } from "./ArticleByReference";
import type { ReferenceForm } from "./GeneralData";

type PreviewNewReferenceProps = {
    data: ReferenceForm;
    cities: City[];
    authors: Author[];
    journals: Journal[];
    journalVolumes: JournalVolume[];
    forceReload: () => void;
    handleResetReferenceForm: (nextCode: number) => void;
};

const searchCityNameByID = (id: number | undefined, cities: City[]): string | undefined => {
    if (!id) return;
    return cities.find((city) => city.id === id)?.name;
};

const searchAuthorNameByID = (id: number | undefined, authors: Author[]): string | undefined => {
    if (!id) return;
    return authors.find((author) => author.id === id)?.name;
};

const searchVolumeInfoById = (
    id: number | undefined,
    journalVolumes: JournalVolume[],
    journals: Journal[],
    pageStart?: number,
    pageEnd?: number
): string => {
    if (!id) return "Sin información de volumen";

    const volume = journalVolumes.find((volume) => volume.id === id);
    if (volume) {
        const journal = journals.find((j) => j.id === volume.journalId);
        return journal
            ? `${journal.name}, Vol. ${volume.volume}(${volume.issue}), ${pageStart}-${pageEnd} - Año: ${volume.year}`
            : `Vol. ${volume.volume}(${volume.issue}), ${pageStart}-${pageEnd} - Año: ${volume.year}`;
    }

    return "Volumen no encontrado";
};

export default function PreviewPostReference({
    data,
    cities,
    authors,
    journals,
    journalVolumes,
    forceReload,
    handleResetReferenceForm,
}: PreviewNewReferenceProps): JSX.Element {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const formatNewArticle = (newArticle: RecursivePartial<NewArticleDto>): string => {
        const { pageStart, pageEnd, volumeId, newVolume } = newArticle;

        let articleInfo = "";

        if (newVolume) {
            const { volume, issue, year, newJournal } = newVolume;
            if (newJournal) {
                articleInfo += newJournal;
            }
            articleInfo += `Vol. ${volume}(${issue}), ${pageStart}-${pageEnd} - Año: ${year}`;
        } else if (volumeId) {
            articleInfo += searchVolumeInfoById(
                volumeId,
                journalVolumes,
                journals,
                pageStart,
                pageEnd
            );
        }

        return articleInfo;
    };

    const cityName = data.cityId
        ? searchCityNameByID(data.cityId, cities)
        : data.newCity;

    const authorNames = data.authorIds
        ? data.authorIds
            .map((id) => searchAuthorNameByID(id, authors))
            .filter((name) => name)
        : [];

    const handleSubmit = async (): Promise<void> => {
        try {
            // TODO should use NewReferenceDto, im lazy
            const payload: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(data)) {
                if (key !== "code") {
                    payload[key] = value;
                }
            }

            const result = await api.createReference({
                path: {
                    code: data.code,
                },
                body: payload as NewReferenceDto,
            });

            if (result.error) {
                console.error(result.error);
                addToast({
                    message: result.error.message,
                    title: "Fallo",
                    type: "Danger",
                    position: "middle-center",
                });
                return;
            }

            addToast({
                message: "Se creo exitosamente",
                title: "Éxito",
                type: "Success",
                position: "top-end",
            });
            forceReload();
            handleResetReferenceForm(data.code + 1);
        } catch (error) {
            console.error(error);
            addToast({
                message: (error as Error)?.message ?? "Error",
                title: "Fallo",
                type: "Danger",
                position: "middle-center",
            });
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-center mb-[24px]">
                <div className="w-full">
                    <div
                        className="rounded-[12px] border border-[#e2e8f0] shadow-md bg-[white] overflow-hidden relative"
                    >
                        <div
                            className="
                            absolute
                            top-[50%]
                            left-[50%]
                            transform
                            translate-x-[-50%]
                            translate-y-[-50%]
                            opacity-[0.03]
                            rotate-[-30deg]
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 24 24"
                                fill="currentColor" className="text-[#000000]"
                            >
                                <path
                                    // eslint-disable-next-line max-len
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>

                        <div className="h-[6px] bg-gradient-to-r from-[#b9f3be] to-[#9beea2]"></div>
                        <div className="p-[24px] relative">
                            <div className="border-b border-[#f1f5f9] pb-[16px] mb-[16px]">
                                <h2 className="text-[22px] font-[700] text-[#1e293b] mb-[8px]">{data.title}</h2>
                                <div className="flex items-center text-[#64748b]">
                                    <span
                                        className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        bg-[#33ad3d]
                                        text-[white]
                                        rounded-[4px]
                                        px-[8px]
                                        py-[4px]
                                        text-[14px]
                                        font-[600]
                                        mr-[10px]
                                        "
                                    >
                                        {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                                    </span>
                                    {data.year && (
                                        <span className="flex items-center text-[14px]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-[16px] w-[16px] mr-[4px]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    // eslint-disable-next-line max-len
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {data.year}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-[15px] text-[#334155] space-y-[12px]">
                                <div className="flex">
                                    <div className="w-[24px] mr-[8px] text-[#64748b]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <span
                                            className="font-[600] mr-[4px] text-[#475569]"
                                        >{t("PreviewPostReference.Code")}</span>
                                        <span className="font-[500]">{data.code}</span>
                                    </div>
                                </div>

                                {authorNames.length > 0 && (
                                    <div className="flex">
                                        <div className="w-[24px] mr-[8px] text-[#64748b]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    // eslint-disable-next-line max-len
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <span
                                                className="font-[600] mr-[4px] text-[#475569]"
                                            >{t("PreviewPostReference.Authors")}</span>
                                            <span className="font-[500]">{authorNames.join(" - ")}</span>
                                        </div>
                                    </div>
                                )}

                                {data.newAuthors && data.newAuthors.length > 0 && (
                                    <div className="flex">
                                        <div className="w-[24px] mr-[8px] text-[#64748b]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    // eslint-disable-next-line max-len
                                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <span
                                                className="font-[600] mr-[4px] text-[#475569]"
                                            >{t("PreviewPostReference.New_A")}:
                                            </span>
                                            <span className="font-[500]">{data.newAuthors.join(" - ")}</span>
                                        </div>
                                    </div>
                                )}

                                {data.newArticle && (
                                    <div className="flex">
                                        <div className="w-[24px] mr-[8px] text-[#64748b]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    // eslint-disable-next-line max-len
                                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <span
                                                className="font-[600] mr-[4px] text-[#475569]"
                                            >{t("PreviewPostReference.New")}</span>
                                            <span className="font-[500]">{formatNewArticle(data.newArticle)}</span>
                                        </div>
                                    </div>
                                )}

                                {cityName && (
                                    <div className="flex">
                                        <div className="w-[24px] mr-[8px] text-[#64748b]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    // eslint-disable-next-line max-len
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <span
                                                className="font-[600] mr-[4px] text-[#475569]"
                                            >{t("PreviewPostReference.City")}</span>
                                            <span className="font-[500]">{cityName}</span>
                                        </div>
                                    </div>
                                )}

                                {data.other && (
                                    <div className="flex">
                                        <div className="w-[24px] mr-[8px] text-[#64748b]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <span
                                                className="font-[600] mr-[4px] text-[#475569]"
                                            >{t("PreviewPostReference.Other")}</span>
                                            <span className="font-[500]">{data.other}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            className="
                            bg-[#f8fafc]
                            border-t
                            border-[#e2e8f0]
                            px-[24px]
                            py-[12px]
                            text-[14px]
                            text-[#64748b]
                            flex
                            items-center
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px] mr-[6px]" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    // eslint-disable-next-line max-len
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            {data.type.charAt(0).toUpperCase() + data.type.slice(1)} - {data.code}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-[8px]">
                <button
                    onClick={handleSubmit}
                    className="
                    px-[28px]
                    py-[12px]
                    border-none
                    bg-gradient-to-r
                    from-[#a1caaf]
                    to-[#a1caaf]
                    text-[white]
                    rounded-[8px]
                    hover:from-[#95b9a1]
                    hover:to-[#95b9a1]
                    transition-all
                    duration-300
                    font-[600]
                    text-[16px]
                    shadow-md
                    flex
                    items-center
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] mr-[8px]" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            // eslint-disable-next-line max-len
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                    </svg>
                    {t("PreviewPostReference.button")}
                </button>
            </div>
        </div>
    );
};
