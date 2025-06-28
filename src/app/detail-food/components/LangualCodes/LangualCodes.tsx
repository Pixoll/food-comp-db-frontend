import type { LangualCode } from "@/types/SingleFoodResult";
import { useTranslation } from "react-i18next";
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
                            {t("LangualCode.code")}
                        </th>
                        <th className={`${styles.headerCell} ${styles.descriptionColumn}`}>
                            {t("LangualCode.description")}
                        </th>
                        <th className={`${styles.headerCell} ${styles.classificationColumn}`}>
                            {t("LangualCode.description_main")}
                        </th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {data && data.length > 0 && (
                        data.flatMap(lcode => {
                            const mainRow = (
                                <tr
                                    className={styles.mainRow}
                                    key={`main-${lcode.id}`}
                                >
                                    <td className={`${styles.cell} ${styles.codeColumn}`}>
                                        {lcode.code}
                                    </td>
                                    <td className={`${styles.cell} ${styles.cellBold} ${styles.descriptionColumn}`}>
                                        {lcode.descriptor}
                                    </td>
                                    <td className={`${styles.cell} ${styles.classificationColumn}`}>
                                        {lcode.children.length > 0
                                            ? lcode.children[0].code + ", " + lcode.children[0].descriptor
                                            : ""
                                        }
                                    </td>
                                </tr>
                            );
                            const childRows = lcode.children.length > 1
                                ? lcode.children.slice(1).map((lchild, index) => (
                                    <tr
                                        className={styles.childRow}
                                        key={`child-${lcode.id}-${index}`}
                                    >
                                        <td className={`${styles.childCell} ${styles.codeColumn}`}>
                                            {""}
                                        </td>
                                        <td className={`${styles.childCell} ${styles.descriptionColumn}`}>
                                            {""}
                                        </td>
                                        <td
                                            className={`
                                            ${styles.childCell}
                                            ${styles.childCellIndented}
                                            ${styles.classificationColumn}
                                            `}
                                        >
                                            <span>
                                                <span className={styles.childCode}>
                                                    {lchild.code}
                                                </span>, {lchild.descriptor}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                                : [];
                            return [mainRow, ...childRows];
                        })
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderCards = (): JSX.Element => (
        <div className={styles.cardsContainer}>
            {data && data.length > 0 && (
                data.map(lcode => (
                    <div key={`card-${lcode.id}`}>
                        <div className={styles.card}>
                            <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>Código:</div>
                                <div className={styles.cardValue}>{lcode.code}</div>
                            </div>
                            <div className={styles.cardRow}>
                                <div className={styles.cardLabel}>Descripción:</div>
                                <div className={`${styles.cardValue} ${styles.cardValueBold}`}>{lcode.descriptor}</div>
                            </div>
                            {lcode.children.length > 0 && (
                                <div className={styles.cardRow}>
                                    <div className={styles.cardLabel}>Clasificación:</div>
                                    <div className={styles.cardValue}>
                                        {lcode.children.map((child, index) => (
                                            <div
                                                key={`child-card-${child.code}-${index}`}
                                                className={index > 0 ? styles.childCard : ""}
                                            >
                                                <span className={styles.childCode}>
                                                    {child.code}
                                                </span>, {child.descriptor}
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
            Desliza horizontalmente para ver toda la tabla
        </div>
    </>;
}
