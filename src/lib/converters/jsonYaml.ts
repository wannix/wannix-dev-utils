import yaml from 'js-yaml';

export interface ConversionResult {
  success: boolean;
  result?: string;
  error?: string;
}

export function jsonToYaml(json: string): ConversionResult {
  if (!json.trim()) {
    return { success: true, result: "" };
  }
  
  try {
    const parsed = JSON.parse(json);
    const result = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });
    return { success: true, result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Invalid JSON" 
    };
  }
}

export function yamlToJson(yamlStr: string): ConversionResult {
  if (!yamlStr.trim()) {
    return { success: true, result: "" };
  }
  
  try {
    const parsed = yaml.load(yamlStr);
    const result = JSON.stringify(parsed, null, 2);
    return { success: true, result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Invalid YAML" 
    };
  }
}
