interface CopyButtonProps {
  onClick: () => void;
  disabled?: boolean;
  copied?: boolean;
  disabledText?: string;
  copyText?: string;
  copiedText?: string;
}

export const CopyButton = ({
  onClick,
  disabled = false,
  copied = false,
  disabledText = 'Fill all blanks first',
  copyText = 'Copy to clipboard',
  copiedText = 'Copied!',
}: CopyButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center gap-2 px-4 py-2
      text-sm font-medium rounded-lg
      transition-all duration-200
      ${copied
        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
        : disabled
          ? 'bg-gray-100 dark:bg-gray-800 text-muted cursor-not-allowed'
          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
      }
    `}
  >
    {copied ? (
      <>
        <CheckIcon />
        {copiedText}
      </>
    ) : disabled ? (
      disabledText
    ) : (
      <>
        <CopyIcon />
        {copyText}
      </>
    )}
  </button>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

