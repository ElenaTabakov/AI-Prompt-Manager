// Category color styles for tags - colorful but cohesive
export const categoryStyles: Record<string, { bg: string; bgActive: string; text: string; textActive: string }> = {
  all: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    bgActive: 'bg-[#323a45] dark:bg-[#f6f7f9]',
    text: 'text-gray-600 dark:text-gray-400',
    textActive: 'text-white dark:text-[#323a45]',
  },
  Coding: {
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    bgActive: 'bg-sky-600 dark:bg-sky-500',
    text: 'text-sky-600 dark:text-sky-400',
    textActive: 'text-white',
  },
  Writing: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    bgActive: 'bg-teal-600 dark:bg-teal-500',
    text: 'text-teal-600 dark:text-teal-400',
    textActive: 'text-white',
  },
  Marketing: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    bgActive: 'bg-rose-500 dark:bg-rose-500',
    text: 'text-rose-500 dark:text-rose-400',
    textActive: 'text-white',
  },
  Other: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    bgActive: 'bg-amber-500 dark:bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    textActive: 'text-white',
  },
};
