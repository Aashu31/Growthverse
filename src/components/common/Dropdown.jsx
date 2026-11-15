import React from "react";
import { LuMenu, LuX, LuArrowRight } from "lucide-react";

export function Dropdown({
  trigger,
  children,
  position = "bottom-right",
  className = "",
}) {
  // Simple dropdown - in a real app this would use floating UI
  return React.cloneElement(trigger, {
    onClick: (e) => {
      e.stopPropagation();
      if (trigger.props.onClick) trigger.props.onClick(e);
    },
    className: trigger.props.className || "",
  });
}

export function Accordion({
  items,
  className = "",
  allowMultiple = false,
}) {
  const [openItems, setOpenItems] = React.useState([]);

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  const isOpen = (id) => openItems.includes(id);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => {
        const id = item.id || index;
        const isItemOpen = isOpen(id);
        return (
          <div key={id} className="border border-border rounded-xl overflow-hidden transition-all">
            <button
              onClick={() => toggleItem(id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              aria-expanded={isItemOpen}
              aria-controls={`accordion-panel-${id}`}
            >
              <span className="text-primary-text dark:text-white font-medium">
                {item.title}
              </span>
              <svg
                className={`w-5 h-5 text-secondary-text transition-transform duration-300 ${
                  isItemOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isItemOpen && (
              <div
                id={`accordion-panel-${id}`}
                className="px-6 pb-4 border-t border-border dark:border-gray-700"
              >
                <div className="text-secondary-text dark:text-gray-300 text-sm leading-relaxed">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Tabs({
  items,
  activeTab,
  onTabChange,
  className = "",
}) {
  return (
    <div className={className}>
      <div className="flex gap-8 mb-8 border-b border-border dark:border-gray-700">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 dark:text-electric-blue"
                : "border-transparent text-secondary-text hover:text-primary-text dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">
        {items.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

export default { Dropdown, Accordion, Tabs };
