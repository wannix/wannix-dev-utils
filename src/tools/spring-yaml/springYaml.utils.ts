import yaml from "js-yaml";

/**
 * Converts Spring Boot `.properties` format to YAML.
 * Unflattens dot-separated keys into nested YAML objects.
 * @param properties - The `.properties` format string to convert
 * @returns The equivalent YAML string
 */
export function toYaml(properties: string): string {
  const lines = properties.split("\n");
  const obj: Record<string, any> = {};

  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#") || line.startsWith("!")) return;

    const splitIndex = line.indexOf("=");
    if (splitIndex === -1) return; // Invalid property line (or just a key without value?)

    const key = line.substring(0, splitIndex).trim();
    const value = line.substring(splitIndex + 1).trim();

    // Unflatten key (e.g., 'server.port' -> { server: { port: ... } })
    const parts = key.split(".");
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // Leaf node
        current[part] = parseValue(value);
      } else {
        // Initialize next level if needed
        if (!current[part] || typeof current[part] !== "object") {
          current[part] = {};
        }
        current = current[part];
      }
    }
  });

  return yaml.dump(obj, { indent: 2 });
}

/**
 * Converts YAML to Spring Boot `.properties` format.
 * Flattens nested YAML objects into dot-separated key=value pairs.
 * @param yamlStr - The YAML string to convert
 * @returns The equivalent `.properties` format string
 * @throws Error if the input is not valid YAML
 */
export function toProperties(yamlStr: string): string {
  try {
    const obj = yaml.load(yamlStr);
    if (!obj || typeof obj !== "object") return "";

    const flattened = flatten(obj);
    return Object.entries(flattened)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
  } catch (e: any) {
    throw new Error(e.message || "Invalid YAML");
  }
}

function parseValue(val: string): any {
  if (val === "true") return true;
  if (val === "false") return false;
  if (!isNaN(Number(val)) && val.trim() !== "") return Number(val);
  return val;
}

function flatten(obj: any, prefix = ""): Record<string, any> {
  let result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const deep = flatten(value, newKey);
        result = { ...result, ...deep };
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}
