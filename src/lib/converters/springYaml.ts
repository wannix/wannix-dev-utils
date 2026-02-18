export function propsToYaml(props: string): string {
  if (!props.trim()) return "";
  
  const lines = props.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const result: Record<string, unknown> = {};
  
  for (const line of lines) {
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    
    const key = line.substring(0, eqIndex).trim();
    const value = line.substring(eqIndex + 1).trim();
    
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      // Handle array notation like [0]
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const [, name, index] = arrayMatch;
        if (!current[name]) current[name] = [];
        const arr = current[name] as unknown[];
        const idx = parseInt(index);
        if (!arr[idx]) arr[idx] = {};
        current = arr[idx] as Record<string, unknown>;
      } else {
        if (!current[part]) current[part] = {};
        current = current[part] as Record<string, unknown>;
      }
    }
    
    const lastPart = parts[parts.length - 1];
    const lastArrayMatch = lastPart.match(/^(.+)\[(\d+)\]$/);
    
    if (lastArrayMatch) {
      const [, name, index] = lastArrayMatch;
      if (!current[name]) current[name] = [];
      (current[name] as unknown[])[parseInt(index)] = parseValue(value);
    } else {
      current[lastPart] = parseValue(value);
    }
  }
  
  return objectToYaml(result, 0);
}

function parseValue(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+$/.test(value)) return parseInt(value);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}

function objectToYaml(obj: Record<string, unknown>, indent: number): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';
  
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const itemYaml = objectToYaml(item as Record<string, unknown>, 0);
          const lines = itemYaml.split('\n').filter(l => l);
          yaml += `${spaces}  - ${lines[0].trim()}\n`;
          for (let i = 1; i < lines.length; i++) {
            yaml += `${spaces}    ${lines[i].trim()}\n`;
          }
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      yaml += `${spaces}${key}:\n`;
      yaml += objectToYaml(value as Record<string, unknown>, indent + 1);
    } else {
      yaml += `${spaces}${key}: ${formatYamlValue(value)}\n`;
    }
  }
  
  return yaml;
}

function formatYamlValue(value: unknown): string {
  if (typeof value === 'string') {
    if (value.includes(':') || value.includes('#') || value.includes("'") || value.includes('"')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  return String(value);
}

export function yamlToProps(yaml: string): string {
  if (!yaml.trim()) return "";
  
  const lines = yaml.split('\n');
  const result: string[] = [];
  const stack: { indent: number; key: string }[] = [];
  let arrayIndex: Record<string, number> = {};
  
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    
    const indent = line.search(/\S/);
    const content = line.trim();
    
    // Pop stack for lower indentation
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const isArrayItem = content.startsWith('- ');
    
    if (isArrayItem) {
      const value = content.substring(2).trim();
      const parentKey = stack.map(s => s.key).join('.');
      
      if (!arrayIndex[parentKey]) arrayIndex[parentKey] = 0;
      const idx = arrayIndex[parentKey]++;
      
      if (value.includes(':')) {
        const [k, v] = value.split(':').map(s => s.trim());
        result.push(`${parentKey}[${idx}].${k}=${v}`);
        stack.push({ indent: indent + 2, key: `${parentKey}[${idx}]` });
      } else {
        result.push(`${parentKey}[${idx}]=${value}`);
      }
    } else if (content.includes(':')) {
      const colonIndex = content.indexOf(':');
      const key = content.substring(0, colonIndex).trim();
      const value = content.substring(colonIndex + 1).trim();
      
      if (value) {
        const fullKey = [...stack.map(s => s.key), key].join('.');
        result.push(`${fullKey}=${value.replace(/^["']|["']$/g, '')}`);
      } else {
        stack.push({ indent, key });
        arrayIndex[stack.map(s => s.key).join('.')] = 0;
      }
    }
  }
  
  return result.join('\n');
}
