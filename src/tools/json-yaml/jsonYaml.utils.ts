import yaml from "js-yaml";

/**
 * Converts a YAML string to a formatted JSON string.
 * @param yamlStr - The YAML input to convert
 * @returns The equivalent JSON string, pretty-printed with 2-space indentation
 * @throws Error if the input is not valid YAML
 */
export function toJson(yamlStr: string): string {
  if (!yamlStr.trim()) return "";
  try {
    const obj = yaml.load(yamlStr);
    return JSON.stringify(obj, null, 2);
  } catch (e: any) {
    throw new Error(e.message || "Invalid YAML");
  }
}

/**
 * Converts a JSON string to a formatted YAML string.
 * @param jsonStr - The JSON input to convert
 * @returns The equivalent YAML string with 2-space indentation
 * @throws Error if the input is not valid JSON
 */
export function toYaml(jsonStr: string): string {
  if (!jsonStr.trim()) return "";
  try {
    const obj = JSON.parse(jsonStr);
    return yaml.dump(obj, { indent: 2 });
  } catch (e: any) {
    throw new Error(e.message || "Invalid JSON");
  }
}
