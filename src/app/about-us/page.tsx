'use client';

import type {JSX} from "react";
import Footer from "@/app/components/Footer";
import MembersComponent from "@/app/about-us/Components/MembersComponent";
import styles from "./AboutUsPage.module.css";
import {t} from "i18next";
import {useTranslation} from "@/context/I18nContext";

const members = [
  {
    name: "Lilia Masson",
    institution: "Universidad de Chile",
    position: "Profesora Emeritus",
    email: "masson_lilia@yahoo.es",
  },
  {
    name: "José Miguel Bastías Montes",
    institution: "Departamento de Ingeniería de Alimentos, Universidad del Bío-Bio",
    position: "Académico Investigador",
    email: "jobastias@ubiobio.cl",
  },
  {
    name: "Nalda Romero Palacios",
    institution: "Departamento Ciencia de los Alimentos y Tecnología Química, Facultad de Ciencias Químicas y Farmacéuticas; Universidad de Chile",
    position: "Académico Investigador",
    email: "nromero@udechile.cl",
  },
  {
    name: "Cristian Rogel Castillo",
    institution: "Departamento de Ciencia y Tecnología de los Alimentos, Facultad de Farmacia; Universidad de Concepción",
    position: "Académico Investigador",
    email: "jrogel@udec.cl.cl",
  },
  {
    name: "Marcela Torres Vergara",
    institution: "EUROFINS",
    position: "Química",
    email: "marcelatorres@eurofins.com",
  },
];

export default function AboutUsPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.mainTitle}>{t.aboutUsPage.mainTitle}</h1>
          </div>

          <div className={styles.topRow}>
            <div className={styles.membersContainer}>
              <MembersComponent members={members} />
            </div>
            <div className={styles.infoBox}>
              <h2 className={styles.infoTitle}>CapChiCal</h2>
              <p className={styles.infoParagraph}>
                {t.aboutUsPage.paragraph1}
              </p>
            </div>
          </div>

          <div className={styles.bottomRow}>
            <h2 className={styles.sectionTitle}>{t.aboutUsPage.capchicalTitle}</h2>

            <p className={styles.paragraph}>
              {t.aboutUsPage.paragraph2}
            </p>
            <p className={styles.paragraph}>
              {t.aboutUsPage.paragraph3}
            </p>
            <p className={styles.paragraph}>
              {t.aboutUsPage.paragraph4}
            </p>
            <ul>
              <li>
                <p className={styles.paragraph}>
                  {t.aboutUsPage.paragraph5}
                </p>
              </li>
              <li>
                <p className={styles.paragraph}>
                  {t.aboutUsPage.paragraph6}
                </p>
              </li>
              <li>
                <p className={styles.paragraph}>
                  {t.aboutUsPage.paragraph7}
                </p>
              </li>
              <li>
                <p className={styles.paragraph}>
                  {t.aboutUsPage.paragraph8}
                </p>
              </li>
              <li>
                <p className={styles.paragraph}>
                  {t.aboutUsPage.paragraph9}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}