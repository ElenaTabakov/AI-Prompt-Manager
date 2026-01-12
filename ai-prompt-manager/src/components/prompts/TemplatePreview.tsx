import { useState, useEffect, useMemo, useRef } from 'react';
import { extractVariables, fillTemplate } from '../../utils/templateParser';

interface TemplatePreviewProps {
  template: string;
  onCopy?: (filledTemplate: string) => void;
}

export const TemplatePreview = ({ template, onCopy }: TemplatePreviewProps) => {
  const variables = useMemo(() => extractVariables(template), [template]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Reset values when variables change
  useEffect(() => {
    setValues((prev) => {
      const newValues: Record<string, string> = {};
      variables.forEach((v) => {
        newValues[v] = prev[v] || '';
      });
      return newValues;
    });
  }, [variables]);

  const filledTemplate = useMemo(
    () => fillTemplate(template, values),
    [template, values]
  );

  const handleChange = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filledTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(filledTemplate);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const allFilled = variables.every((v) => values[v]?.trim());

  // If no variables, just show the template
  if (variables.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-sm text-primary leading-relaxed font-mono">
          {template || <span className="text-muted italic">No template content</span>}
        </div>
        
        {template && (
          <CopyButton onClick={handleCopy} disabled={false} copied={copied} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inline template with fill-in-the-blank inputs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Fill in the blanks
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-secondary">
            {variables.length}
          </span>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-sm leading-loose font-mono">
          <InlineTemplate
            template={template}
            values={values}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Final preview (only show if at least one variable is filled) */}
      {Object.values(values).some(v => v.trim()) && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Result
            </span>
            {allFilled && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                Ready
              </span>
            )}
          </div>
          <div
            className={`
              rounded-xl p-5 text-sm font-mono
              whitespace-pre-wrap break-words leading-relaxed
              transition-all duration-300
              ${allFilled 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-200 dark:ring-emerald-800' 
                : 'bg-gray-50 dark:bg-gray-800/50 text-primary'
              }
            `}
          >
            {filledTemplate}
          </div>
        </div>
      )}

      {/* Copy button */}
      <CopyButton onClick={handleCopy} disabled={!allFilled} copied={copied} />
    </div>
  );
};

// ============ Inline Template Component ============

interface InlineTemplateProps {
  template: string;
  values: Record<string, string>;
  onChange: (variable: string, value: string) => void;
}

const InlineTemplate = ({ template, values, onChange }: InlineTemplateProps) => {
  // Split template into parts (text and variables)
  const parts = useMemo(() => {
    const regex = /\{\s*([^}]+?)\s*\}/g;
    const result: Array<{ type: 'text' | 'variable'; content: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(template)) !== null) {
      // Add text before this match
      if (match.index > lastIndex) {
        result.push({
          type: 'text',
          content: template.slice(lastIndex, match.index),
        });
      }

      // Add the variable
      result.push({
        type: 'variable',
        content: match[1].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < template.length) {
      result.push({
        type: 'text',
        content: template.slice(lastIndex),
      });
    }

    return result;
  }, [template]);

  return (
    <span className="text-primary">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <span key={index} className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
              {part.content}
            </span>
          );
        }

        return (
          <InlineInput
            key={`${part.content}-${index}`}
            variable={part.content}
            value={values[part.content] || ''}
            onChange={(value) => onChange(part.content, value)}
          />
        );
      })}
    </span>
  );
};

// ============ Inline Input Component ============

interface InlineInputProps {
  variable: string;
  value: string;
  onChange: (value: string) => void;
}

const InlineInput = ({ variable, value, onChange }: InlineInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(80);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize input based on content
  useEffect(() => {
    const minWidth = Math.max(variable.length * 9, 70);
    const contentWidth = value ? value.length * 9 + 24 : minWidth;
    setWidth(Math.max(minWidth, Math.min(contentWidth, 280)));
  }, [value, variable]);

  const hasValue = value.trim().length > 0;

  return (
    <span className="inline-flex items-baseline">
      <span className="relative inline-flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={variable}
          style={{ width: `${width}px` }}
          className={`
            inline-block px-3 py-1 mx-1 my-0.5
            text-sm font-medium rounded-lg
            transition-all duration-200
            focus:outline-none
            ${hasValue
              ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-700'
              : isFocused
                ? 'bg-white dark:bg-gray-700 text-primary ring-2 ring-violet-400 dark:ring-violet-500'
                : 'bg-white/60 dark:bg-gray-700/60 text-muted ring-1 ring-gray-300 dark:ring-gray-600'
            }
          `}
          aria-label={`Enter value for ${variable}`}
        />
        {!hasValue && !isFocused && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </span>
        )}
      </span>
    </span>
  );
};

// ============ Copy Button Component ============

interface CopyButtonProps {
  onClick: () => void;
  disabled: boolean;
  copied: boolean;
}

const CopyButton = ({ onClick, disabled, copied }: CopyButtonProps) => (
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Copied!
      </>
    ) : (
      <>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {disabled ? 'Fill all blanks first' : 'Copy to clipboard'}
      </>
    )}
  </button>
);
