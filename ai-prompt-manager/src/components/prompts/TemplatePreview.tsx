import { useState, useMemo, useRef } from 'react';
import { extractVariables, fillTemplate } from '../../utils/templateParser';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { CopyButton } from '../ui/CopyButton';

interface TemplatePreviewProps {
  template: string;
  onCopy?: (filledTemplate: string) => void;
}

export const TemplatePreview = ({ template, onCopy }: TemplatePreviewProps) => {
  // Use key pattern: wrap content in inner component that resets when template changes
  return (
    <TemplatePreviewContent
      key={template}
      template={template}
      onCopy={onCopy}
    />
  );
};

// Inner component that initializes state from template (resets when key/template changes)
const TemplatePreviewContent = ({ template, onCopy }: TemplatePreviewProps) => {
  const variables = useMemo(() => extractVariables(template), [template]);
  const { copied, copy } = useCopyToClipboard();
  
  // Initialize empty values for all variables (runs once when component mounts)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    extractVariables(template).forEach((v) => {
      initial[v] = '';
    });
    return initial;
  });

  const filledTemplate = useMemo(
    () => fillTemplate(template, values),
    [template, values]
  );

  const handleChange = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handleCopy = async () => {
    const success = await copy(filledTemplate);
    if (success) {
      onCopy?.(filledTemplate);
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
  const [isFocused, setIsFocused] = useState(false);

  // Compute width directly (no useEffect needed)
  const width = useMemo(() => {
    const minWidth = Math.max(variable.length * 9, 70);
    const contentWidth = value ? value.length * 9 + 24 : minWidth;
    return Math.max(minWidth, Math.min(contentWidth, 280));
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
              ? 'bg-[#5faeb6]/20 text-[#3f6184] dark:text-[#6fc4cc] ring-1 ring-[#5faeb6]/50'
              : isFocused
                ? 'bg-white dark:bg-gray-700 text-primary ring-2 ring-[#5faeb6]'
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

