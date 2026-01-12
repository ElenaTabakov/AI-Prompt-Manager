// Extract variables from template like "Write about {topic} in {tone} style"
export const extractVariables = (template: string): string[] => {
  const regex = /\{\s*([^}]+?)\s*\}/g;
  const variables: string[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = regex.exec(template)) !== null) {
    const variable = match[1].trim();
    // Handle duplicates - only add once
    if (variable && !seen.has(variable)) {
      variables.push(variable);
      seen.add(variable);
    }
  }

  return variables;
};

// Replace variables with values
export const fillTemplate = (
  template: string,
  values: Record<string, string>
): string => {
  let result = template;

  Object.entries(values).forEach(([key, value]) => {
    // Replace all occurrences with flexible spacing
    const regex = new RegExp(`\\{\\s*${key}\\s*\\}`, 'g');
    result = result.replace(regex, value || `{${key}}`);
  });

  return result;
};

// Validate if all variables are filled
export const hasEmptyVariables = (
  template: string,
  values: Record<string, string>
): boolean => {
  const variables = extractVariables(template);
  return variables.some(v => !values[v] || values[v].trim() === '');
};
