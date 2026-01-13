import { categoryStyles } from './categoryStyles';

interface CategoryTagProps {
  category: string;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryTag = ({ category, label, count, isActive, onClick }: CategoryTagProps) => {
  const styles = categoryStyles[category] || categoryStyles.Other;

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        text-sm font-medium rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5faeb6]
        ${isActive
          ? `${styles.bgActive} ${styles.textActive} shadow-sm`
          : `${styles.bg} ${styles.text} hover:opacity-80`
        }
      `}
      aria-pressed={isActive}
    >
      {label}
      <span
        className={`
          text-xs px-1.5 py-0.5 rounded-full
          ${isActive
            ? 'bg-white/20'
            : 'bg-black/5 dark:bg-white/10'
          }
        `}
      >
        {count}
      </span>
    </button>
  );
};

