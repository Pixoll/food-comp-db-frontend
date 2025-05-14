import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type AccordionProps = {
    header: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
};

export default function Accordion({ header, children, defaultOpen = false }: AccordionProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-gray-200 rounded-md mb-2 overflow-hidden">
            <button
                className="w-full px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                onClick={toggleAccordion}
                aria-expanded={isOpen}
            >
                <span className="font-medium text-gray-800">{header}</span>
                <ChevronDown
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    size={20}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 py-3 px-4' : 'max-h-0'}`}
            >
                {children}
            </div>
        </div>
    );
}
