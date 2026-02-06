"use client";

import { useTranslation } from "@/context/I18nContext";
import { useRouter } from "next/navigation";
import {type FormEvent, type JSX, useState, useMemo} from "react";
import Footer from "./components/Footer";
import Image from "next/image";
// @ts-ignore
import calafate from "../../public/calafate.jpg";
// @ts-ignore
import chile from "../../public/chili.jpg";
// @ts-ignore
import potatoSweet from "../../public/sweet-potato.jpg";
import styles from "./HomePage.module.css";
import {useGroups} from "@/hooks";

export default function HomePage(): JSX.Element {
    const { t } = useTranslation();
    const router = useRouter();
    const [foodName, setFoodName] = useState("");
    const [showCredits, setShowCredits] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<number | "">("");
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const { idToObject, idToName } = useGroups();

    const developers = [
        "Felipe Ruskin",
        "Benjamín González",
        "Ignacio Padilla"
    ];

    const groupsArray = useMemo(() => {
        const groups = [];
        for (const [id, group] of idToObject.entries()) {
            groups.push(group);
        }
        return groups.sort((a, b) => a.name.localeCompare(b.name));
    }, [idToObject]);

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        if (foodName || selectedGroups.length > 0) {
            toSearchPage();
        }
    };

    const toSearchPage = (): void => {
        const params = new URLSearchParams();
        if (foodName) {
            params.append('foodName', foodName);
        }

        if (selectedGroups.length > 0) {
            params.append('groups', selectedGroups.map(g => g.toString()).join(','));
        }
        router.push(`/search?${params.toString()}`);
    };

    const handleAddGroup = (): void => {
        if (selectedGroup !== "" && !selectedGroups.includes(selectedGroup)) {
            setSelectedGroups([...selectedGroups, selectedGroup]);
            setSelectedGroup("");
        }
    };

    const handleRemoveGroup = (groupToRemove: number): void => {
        setSelectedGroups(selectedGroups.filter(group => group !== groupToRemove));
    };

    const scrollToSearch = (): void => {
        const searchSection = document.getElementById('search-section');
        searchSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <div className={styles.pageWrapper}>
          <section className={styles.heroSection}>
              <div className={styles.heroImageGrid}>
                  <div className={styles.heroImageLeft}>
                      <Image
                        src={calafate}
                        alt="Calafate"
                        fill
                        className={styles.image}
                        priority
                      />
                  </div>
                  <div className={styles.heroImageRight}>
                      <Image
                        src={chile}
                        alt="Chile"
                        fill
                        className={styles.image}
                        priority
                      />
                  </div>
              </div>
              <div className={styles.heroOverlay}></div>
              <div className={styles.heroContent}>
                  <h1 className={styles.title}>
                      {t.homepage.title}
                  </h1>
                  <div className={styles.subtitleContainer}>
                      <p className={styles.subtitle}>
                          {t.homepage.subtitle}
                      </p>
                      <div className={styles.dropdownWrapper}>
                          <button
                            onClick={() => setShowCredits(!showCredits)}
                            className={styles.creditsButton}
                            aria-label={t.homepage.developedBy}
                          >
                              <span>{t.homepage.developedBy}</span>
                              <svg
                                className={`${styles.arrow} ${showCredits ? styles.arrowOpen : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                          </button>
                          {showCredits && (
                            <div className={styles.dropdownMenu}>
                                <ul className={styles.developerList}>
                                    {developers.map((dev, index) => (
                                      <li key={index} className={styles.developerItem}>
                                          {dev}
                                      </li>
                                    ))}
                                </ul>
                            </div>
                          )}
                      </div>
                  </div>

                  <button
                    onClick={scrollToSearch}
                    className={styles.scrollButton}
                    aria-label={t.homepage.scrollToSearch}
                  >
                      <svg
                        className={styles.scrollIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                      </svg>
                      <span>{t.homepage.scrollToSearch}</span>
                  </button>
              </div>
          </section>

          <section id="search-section" className={styles.searchSection}>
              <div className={styles.searchImageWrapper}>
                  <Image
                    src={potatoSweet}
                    alt="Sweet Potato"
                    fill
                    className={styles.image}
                    priority
                  />
              </div>
              <div className={styles.searchOverlay}></div>
              <div className={styles.searchContent}>
                  <div className={styles.searchContainer}>
                      <form onSubmit={handleSubmit} className={styles.searchForm}>
                          <div className={styles.searchWrapper}>
                              <input
                                type="text"
                                placeholder={t.search.placeholder}
                                value={foodName}
                                onChange={(e) => setFoodName(e.target.value.trim())}
                                className={styles.searchInput}
                                aria-label={t.search.placeholder}
                              />
                              <button type="submit" className={styles.searchButton}>
                                  {t.search.button}
                              </button>
                          </div>
                      </form>

                      <div className={styles.groupSelector}>
                          <label className={styles.groupSelectorLabel}>
                              {t.homepage.foodGroups}
                          </label>
                          <div className={styles.groupSelectWrapper}>
                              <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value ? Number(e.target.value) : "")}
                                className={styles.groupSelect}
                                aria-label={t.homepage.foodGroups}
                              >
                                  <option value="">{t.homepage.selectGroup}</option>
                                  {groupsArray.map((group) => (
                                    <option
                                      key={group.id}
                                      value={group.id}
                                      disabled={selectedGroups.includes(group.id)}
                                    >
                                        {group.name}
                                    </option>
                                  ))}
                              </select>
                              <button
                                type="button"
                                onClick={handleAddGroup}
                                disabled={selectedGroup === ""}
                                className={styles.addGroupButton}
                                aria-label={t.homepage.addButton}
                              >
                                  {t.homepage.addButton}
                              </button>
                          </div>
                      </div>

                      <div className={styles.selectedGroupsContainer}>
                          {selectedGroups.length === 0 ? (
                            <p className={styles.emptyGroupsMessage}>
                                {t.homepage.noGroupsSelected}
                            </p>
                          ) : (
                            selectedGroups.map((groupId) => {
                                const groupName = idToName.get(groupId.toString());
                                return groupName ? (
                                  <div key={groupId} className={styles.groupTag}>
                                      <span>{groupName}</span>
                                      <button
                                        onClick={() => handleRemoveGroup(groupId)}
                                        className={styles.removeGroupButton}
                                        aria-label={`${t.homepage.removeGroup} ${groupName}`}
                                      >
                                          <svg className={styles.removeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                      </button>
                                  </div>
                                ) : null;
                            })
                          )}
                      </div>

                      <div className={styles.advancedSearchContainer}>
                          <button
                            className={styles.advancedSearchButton}
                            onClick={() => router.push("/search")}
                          >
                              {t.search.advancedSearch}
                          </button>
                      </div>
                  </div>
              </div>
          </section>
          <Footer/>
      </div>
    );
}
