'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="panel overflow-hidden">
          <button
            onClick={() => toggleItem(index)}
            className="w-full text-left p-4 flex justify-between items-center hover:bg-[#111A2E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00E18D] focus:ring-inset"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="font-medium text-[#E8EEF5] pr-4">{item.question}</span>
            <span
              className={`text-[#00E18D] text-xl transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            >
              ↓
            </span>
          </button>
          {openIndex === index && (
            <div
              id={`faq-answer-${index}`}
              className="px-4 pb-4 text-sm text-[#A9B4C0] leading-relaxed"
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

