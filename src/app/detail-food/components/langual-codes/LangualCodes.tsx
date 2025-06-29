import { useTranslation } from "@/context/I18nContext";
import type { LangualCode } from "@/types/SingleFoodResult";
import type { JSX } from "react";
import styles from "./LangualCodes.module.css";

type LangualCodesProps = {
    data: LangualCode[];
};

export default function LangualCodes({ data }: LangualCodesProps): JSX.Element {
    const { t } = useTranslation();
    const renderTable = (): JSX.Element => (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr className={styles.headerRow}>
                        <th className={`${styles.headerCell} ${styles.codeColumn}`}>
                            {t.langualCodes.code}
                        </th>
                        <th className={`${styles.headerCell} ${styles.descriptionColumn}`}>
                            {t.langualCodes.description}
                        </th>
                        <th className={`${styles.headerCell} ${styles.classificationColumn}`}>
                            {t.langualCodes.mainDescription}
                        </th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {data.flatMap(code => <>
                        <tr className={styles.mainRow} key={`main-${code.id}`}>
                            <td className={`${styles.cell} ${styles.codeColumn}`}>
                                {code.code}
                            </td>
                            <td className={`${styles.cell} ${styles.cellBold} ${styles.descriptionColumn}`}>
                                {code.descriptor}
                            </td>
                            <td className={`${styles.cell} ${styles.classificationColumn}`}>
                                {code.children.length > 0
                                    ? code.children[0].code + ", " + code.children[0].descriptor
                                    : ""
                                }
                            </td>
                        </tr>
                        {code.children.slice(1).map((child, index) => (
                            <tr className={styles.childRow} key={`child-${code.id}-${index}`}>
                                <td className={`${styles.childCell} ${styles.codeColumn}`}/>
                                <td className={`${styles.childCell} ${styles.descriptionColumn}`}/>
                                <td
                                    className={`
                                    ${styles.childCell}
                                    ${styles.childCellIndented}
                                    ${styles.classificationColumn}
                                    `}
                                >
                                    <span>
                                        <span className={styles.childCode}>
                                            {child.code}
                                        </span>
                                        , {child.descriptor}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </>)}
                </tbody>
            </table>
        </div>
    );

    const renderCards = (): JSX.Element => (
        <div className={styles.cardsContainer}>
            {data && data.length > 0 && (
                data.map(code => (
                    <div key={`card-${code.id}`}>
                        <div className={styles.card}>
                            <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>{t.langualCodes.code}:</div>
                                <div className={styles.cardValue}>{code.code}</div>
                            </div>
                            <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>{t.langualCodes.description}:</div>
                                <div className={`${styles.cardValue} ${styles.cardValueBold}`}>{code.descriptor}</div>
                            </div>
                            {code.children.length > 0 && (
                                <div className={styles.cardRow}>
                                    <div className={styles.cardLabel}>{t.langualCodes.classification}:</div>
                                    <div className={styles.cardValue}>
                                        {code.children.map((child, index) => (
                                            <div
                                                key={`child-card-${child.code}-${index}`}
                                                className={index > 0 ? styles.childCard : ""}
                                            >
                                                <span className={styles.childCode}>
                                                    {child.code}
                                                </span>
                                                , {child.descriptor}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return <>
        {renderTable()}
        {renderCards()}
        <div className={styles.scrollIndicator}>
            {t.langualCodes.scrollHorizontally}
        </div>
    </>;
}
