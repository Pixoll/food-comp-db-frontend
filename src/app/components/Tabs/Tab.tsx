import { Children, cloneElement, isValidElement, type ReactElement, useEffect, useRef, useState } from "react";
import styles from "./Tab.module.css";
import TabItem, { type TabItemProps } from "./TabItem";

type TabProps = {
    children: Array<ReactElement<TabItemProps>>;
    defaultTab?: number;
    accentColor?: string;
    onChange?: (index: number) => void;
    className?: string;
};

export default function Tab({
    children,
    defaultTab = 0,
    accentColor = "#7cbb75",
    onChange,
    className = "",
}: TabProps): JSX.Element | null {
    const tabItems = Children.toArray(children)
        .filter((child): child is ReactElement<TabItemProps> =>
            isValidElement(child)
            && (child.type === TabItem || Object.prototype.hasOwnProperty.call(child.props, "label"))
        );

    const [activeTab, setActiveTab] = useState<number>(
        defaultTab >= 0 && defaultTab < tabItems.length ? defaultTab : 0
    );

    const [showLeftShadow, setShowLeftShadow] = useState(false);
    const [showRightShadow, setShowRightShadow] = useState(false);
    const [canScroll, setCanScroll] = useState(false);
    const tabsListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (onChange) {
            onChange(activeTab);
        }
    }, [activeTab, onChange]);

    useEffect(() => {
        const checkScroll = (): void => {
            const element = tabsListRef.current;
            if (!element) return;

            const canScrollHorizontally = element.scrollWidth > element.clientWidth;
            setCanScroll(canScrollHorizontally);

            if (canScrollHorizontally) {
                const isAtStart = element.scrollLeft <= 5;
                const isAtEnd = element.scrollLeft >= element.scrollWidth - element.clientWidth - 5;

                setShowLeftShadow(!isAtStart);
                setShowRightShadow(!isAtEnd);
            } else {
                setShowLeftShadow(false);
                setShowRightShadow(false);
            }
        };

        checkScroll();
        window.addEventListener("resize", checkScroll);

        return () => window.removeEventListener("resize", checkScroll);
    }, [tabItems]);

    const handleScroll = (): void => {
        const element = tabsListRef.current;
        if (!element) return;

        const isAtStart = element.scrollLeft <= 5;
        const isAtEnd = element.scrollLeft >= element.scrollWidth - element.clientWidth - 5;

        setShowLeftShadow(!isAtStart);
        setShowRightShadow(!isAtEnd);
    };

    if (tabItems.length === 0) {
        return null;
    }

    const handleTabClick = (index: number): void => {
        if (!tabItems[index]?.props.disabled) {
            setActiveTab(index);
            const element = tabsListRef.current;
            const activeButton = element?.children[index] as HTMLElement;

            if (element && activeButton && canScroll) {
                const elementRect = element.getBoundingClientRect();
                const buttonRect = activeButton.getBoundingClientRect();
                if (buttonRect.left < elementRect.left || buttonRect.right > elementRect.right) {
                    activeButton.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                    });
                }
            }
        }
    };

    return (
        <div className={`${styles.tabContainer} ${className}`}>
            <div
                className={`
                ${styles.tabsWrapper} 
                ${showLeftShadow ? styles.showLeftShadow : ""} 
                ${showRightShadow ? styles.showRightShadow : ""}
            `}
            >
                <div
                    ref={tabsListRef}
                    className={styles.tabsList}
                    onScroll={handleScroll}
                    role="tablist"
                >
                    {tabItems.map((tab, index) => {
                        const isActive = activeTab === index;
                        const isDisabled = tab.props.disabled;

                        return (
                            <button
                                key={`tab-${index}`}
                                onClick={() => handleTabClick(index)}
                                disabled={isDisabled}
                                className={`
                                    ${styles.tabButton}
                                    ${isActive ? styles.tabButtonActive : ""}
                                    ${isDisabled ? styles.tabButtonDisabled : ""}
                                `}
                                style={{
                                    borderBottomColor: isActive ? accentColor : "#9bb698",
                                }}
                                aria-selected={isActive}
                                role="tab"
                                tabIndex={isActive ? 0 : -1}
                            >
                                {tab.props.label}
                            </button>
                        );
                    })}
                </div>
                {canScroll && (
                    <div className={styles.scrollHint}>
                        ← →
                    </div>
                )}
            </div>

            <div className={styles.tabContent}>
                {tabItems.map((tab, index) => (
                    <div
                        key={`tabcontent-${index}`}
                        role="tabpanel"
                        aria-hidden={activeTab !== index}
                        className={`
                            ${styles.tabPanel}
                            ${activeTab === index ? styles.tabPanelVisible : styles.tabPanelHidden}
                        `}
                    >
                        {activeTab === index && (
                            <div className={styles.tabPanelContent}>
                                {cloneElement(tab)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
