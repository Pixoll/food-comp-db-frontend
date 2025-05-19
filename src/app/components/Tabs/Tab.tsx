import React, {useState, useEffect, ReactElement, cloneElement, Children, isValidElement} from 'react';
import TabItem, {TabItemProps} from './TabItem';

type TabProps = {
    children: ReactElement<TabItemProps>[];
    defaultTab?: number;
    accentColor?: string;
    onChange?: (index: number) => void;
    className?: string;
}

export default function Tab({children, defaultTab = 0, accentColor = "#7cbb75", onChange, className = ""}: TabProps){
    const tabItems = Children.toArray(children)
        .filter((child): child is ReactElement<TabItemProps> =>
            isValidElement(child) && (child.type === TabItem || child.props.hasOwnProperty('label'))
        );

    const [activeTab, setActiveTab] = useState<number>(
        defaultTab >= 0 && defaultTab < tabItems.length ? defaultTab : 0
    );

    useEffect(() => {
        if (onChange) {
            onChange(activeTab);
        }
    }, [activeTab, onChange]);

    if (tabItems.length === 0) return null;

    const tabWidth = 100 / tabItems.length;

    const handleTabClick = (index: number) => {
        if (!tabItems[index]?.props.disabled) {
            setActiveTab(index);
        }
    };

    return (
        <div className={`flex flex-col w-full ${className}`}>
            <div className="flex w-full">
                {tabItems.map((tab, index) => {
                    const isActive = activeTab === index;
                    const isDisabled = tab.props.disabled;

                    return (
                        <button
                            key={`tab-${index}`}
                            onClick={() => handleTabClick(index)}
                            disabled={isDisabled}
                            className={`
                            bg-[#d7dbd6]
                            transition-all duration-300 ease-in-out 
                            text-center text-[18px] font-[300] py-[26px]
                            cursor-pointer border-b-[0px] border-x-[0px] border-solid
                            ${isDisabled ? 'opacity-[0.5] cursor-not-allowed' : 'hover:border-[#9bb698] hover:bg-[#d7dbd6] hover:border-b-[4px] hover:border-x-[4px]'}
                            ${isActive ? 'font-[500]' : 'font-[300]'}
                          `}
                            style={{
                                width: `${tabWidth}%`,
                                borderBottomWidth: isActive ? '4px' : '2px',
                                borderBottomColor: isActive
                                    ? accentColor
                                    : '#9bb698',
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
            <div className="w-full">
                {tabItems.map((tab, index) => (
                    <div
                        key={`tabcontent-${index}`}
                        role="tabpanel"
                        aria-hidden={activeTab !== index}
                        className={`transition-all duration-300 ease-in-out w-full bg-[#d7dbd6]${
                            activeTab === index ? 'block opacity-[1]' : 'hidden opacity-0'
                        }`}
                    >
                        {activeTab === index && (
                            <div className="p-[26px]">
                                {cloneElement(tab)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
