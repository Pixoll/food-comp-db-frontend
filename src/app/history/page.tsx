"use client";

import type {JSX} from "react";
import {useTranslation} from "@/context/I18nContext";
import Footer from "@/app/components/Footer";
import styles from "./HistoryPage.module.css";

export default function HistoryPage(): JSX.Element {
    const { t } = useTranslation();
    return (
      <>
          <div className={styles.heroSection}>
              <div className={styles.overlay}></div>

              <div className={styles.contentWrapper}>
                  <header className={styles.header}>
                      <h1 className={styles.mainTitle}>
                          {t.historyPage.title || "Historia"}
                      </h1>
                  </header>

                  <div className={styles.infoBox}>
                      <h2 className={styles.infoTitle}>
                          {t.historyPage.constitutionTitle}
                      </h2>
                      <p className={styles.infoParagraph}>
                          {t.historyPage.constitutionContent}
                      </p>
                  </div>

                  <div className={styles.infoBox}>
                      <h2 className={styles.infoTitle}>
                          {t.historyPage.projectParticipationTitle}
                      </h2>
                      <p className={styles.infoParagraph}>
                          {t.historyPage.projectParticipationContent}
                      </p>
                  </div>

                  <div className={styles.infoBox}>
                      <h2 className={styles.infoTitle}>
                          {t.historyPage.nameChangeTitle}
                      </h2>
                      <p className={styles.infoParagraph}>
                          {t.historyPage.nameChangeContent}
                      </p>
                  </div>
              </div>
          </div>
          <Footer />
      </>
    );
}
