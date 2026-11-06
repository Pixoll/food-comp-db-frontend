"use client";

import { useTranslation } from "@/context/I18nContext";
import { useGroups } from "@/hooks";
import { ArrowDown, BookOpen, ChevronDown, GitCompareArrows, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type JSX, useMemo, useState } from "react";
// @ts-expect-error: imágenes estáticas
import calafate from "../../public/calafate.jpg";
// @ts-expect-error: imágenes estáticas
import chile from "../../public/chili.jpg";
// @ts-expect-error: imágenes estáticas
import potatoSweet from "../../public/sweet-potato.jpg";
import styles from "./HomePage.module.css";

const developers = [
    "Felipe Ruskin",
    "Benjamín González",
    "Ignacio Padilla",
];

export default function HomePage(): JSX.Element {
    const { t } = useTranslation();
    const router = useRouter();
    const [foodName, setFoodName] = useState("");
    const [showCredits, setShowCredits] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const { idToObject } = useGroups();

    const groups = useMemo(
        () => [...idToObject.values()].sort((a, b) => a.name.localeCompare(b.name)),
        [idToObject]
    );

    const toSearchPage = (): void => {
        const params = new URLSearchParams();
        const name = foodName.trim();

        if (name) {
            params.append("foodName", name);
        }

        if (selectedGroups.length > 0) {
            params.append("groups", selectedGroups.join(","));
        }

        router.push(`/search?${params.toString()}`);
    };

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        toSearchPage();
    };

    const toggleGroup = (id: number): void => {
        setSelectedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };

    const scrollToSearch = (): void => {
        document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
    };

    const features = [
        { icon: <Search size={20}/>, ...t.homepage.features.search, href: "/search" },
        { icon: <GitCompareArrows size={20}/>, ...t.homepage.features.compare, href: "/compare" },
        { icon: <BookOpen size={20}/>, ...t.homepage.features.references, href: "/search" },
    ];

    return (
        <div className={styles.pageWrapper}>
            <section className={styles.heroSection}>
                <div className={styles.heroImageGrid}>
                    <div className={styles.heroImage}>
                        <Image src={calafate} alt="Calafate" fill className={styles.image} priority/>
                    </div>
                    <div className={styles.heroImage}>
                        <Image src={chile} alt="Ají" fill className={styles.image} priority/>
                    </div>
                </div>
                <div className={styles.heroOverlay}/>
                <div className={styles.heroContent}>
                    <span className={styles.chip}>
                        <span className={styles.chipTag}>CapChiCAL</span>
                        Universidad de Concepción
                    </span>
                    <h1 className={styles.title}>{t.homepage.title}</h1>
                    <p className={styles.subtitle}>{t.homepage.subtitle}</p>

                    <div className={styles.heroActions}>
                        <button type="button" onClick={scrollToSearch} className={styles.primaryButton}>
                            <ArrowDown size={18}/>
                            {t.homepage.scrollToSearch}
                        </button>
                        <div className={styles.dropdownWrapper}>
                            <button
                                type="button"
                                onClick={() => setShowCredits(!showCredits)}
                                className={styles.ghostButton}
                                aria-expanded={showCredits}
                            >
                                {t.homepage.developedBy}
                                <ChevronDown size={16} className={showCredits ? styles.arrowOpen : styles.arrow}/>
                            </button>
                            {showCredits && (
                                <ul className={styles.dropdownMenu}>
                                    {developers.map(dev => <li key={dev}>{dev}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section id="search-section" className={styles.searchSection}>
                <div className={styles.searchImageWrapper}>
                    <Image src={potatoSweet} alt="Camote" fill className={styles.image}/>
                </div>
                <div className={styles.searchOverlay}/>
                <div className={styles.searchCard}>
                    <form onSubmit={handleSubmit} className={styles.searchForm} role="search">
                        <Search size={20} className={styles.searchIcon}/>
                        <input
                            type="text"
                            placeholder={t.search.placeholder}
                            value={foodName}
                            onChange={e => setFoodName(e.target.value)}
                            className={styles.searchInput}
                            aria-label={t.search.placeholder}
                        />
                        <button type="submit" className={styles.searchButton}>
                            {t.search.button}
                        </button>
                    </form>

                    <div className={styles.groupHeader}>
                        <span className={styles.groupLabel}>{t.homepage.browseByGroup}</span>
                        {selectedGroups.length > 0 && (
                            <button type="button" onClick={() => setSelectedGroups([])} className={styles.clearButton}>
                                <X size={14}/>
                                {t.homepage.clearGroups}
                            </button>
                        )}
                    </div>
                    <div className={styles.groupChips}>
                        {groups.map(group => {
                            const selected = selectedGroups.includes(group.id);
                            return (
                                <button
                                    key={group.id}
                                    type="button"
                                    onClick={() => toggleGroup(group.id)}
                                    aria-pressed={selected}
                                    className={selected
                                        ? `${styles.groupChip} ${styles.groupChipSelected}`
                                        : styles.groupChip}
                                >
                                    {group.name}
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles.searchFooter}>
                        <Link href="/search" className={styles.advancedLink}>
                            {t.search.advancedSearch}
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.featuresSection}>
                <div className={styles.featuresGrid}>
                    {features.map(feature => (
                        <Link key={feature.title} href={feature.href} className={styles.featureCard}>
                            <span className={styles.featureIcon}>{feature.icon}</span>
                            <h2 className={styles.featureTitle}>{feature.title}</h2>
                            <p className={styles.featureText}>{feature.description}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
