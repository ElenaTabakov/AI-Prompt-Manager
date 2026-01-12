// Category color styles for tags
export const categoryStyles: Record<string, { bg: string; bgActive: string; text: string; textActive: string }> = {
  all: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    bgActive: 'bg-gray-900 dark:bg-white',
    text: 'text-gray-600 dark:text-gray-400',
    textActive: 'text-white dark:text-gray-900',
  },
  Coding: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    bgActive: 'bg-blue-600 dark:bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    textActive: 'text-white',
  },
  Writing: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    bgActive: 'bg-emerald-600 dark:bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    textActive: 'text-white',
  },
  Marketing: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    bgActive: 'bg-purple-600 dark:bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    textActive: 'text-white',
  },
  Other: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    bgActive: 'bg-orange-600 dark:bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    textActive: 'text-white',
  },
};

