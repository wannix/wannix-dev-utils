import yaml from "js-yaml";

/**
 * Converts Spring Boot `.properties` format to YAML.
 * Unflattens dot-separated keys into nested YAML objects.
 * @param properties - The `.properties` format string to convert
 * @returns The equivalent YAML string
 */
export function toYaml(properties: string): string {
  const lines = properties.split("\n");
  const obj: Record<string, unknown> = {};

  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#") || line.startsWith("!")) return;

    const splitIndex = line.indexOf("=");
    if (splitIndex === -1) return; // Invalid property line (or just a key without value?)

    const key = line.substring(0, splitIndex).trim();
    const value = line.substring(splitIndex + 1).trim();

    // Unflatten key (e.g., 'server.port' -> { server: { port: ... } })
    const parts = key.split(".");
    let current: Record<string, unknown> = obj;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // Leaf node
        current[part] = parseValue(value);
      } else {
        // Initialize next level if needed
        const existingValue = current[part];
        if (
          !existingValue ||
          typeof existingValue !== "object" ||
          Array.isArray(existingValue)
        ) {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
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
    const parsed = yaml.load(yamlStr);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return "";
    }

    const flattened = flatten(parsed as Record<string, unknown>);
    return Object.entries(flattened)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Invalid YAML");
  }
}

function parseValue(val: string): string | number | boolean {
  if (val === "true") return true;
  if (val === "false") return false;
  if (!isNaN(Number(val)) && val.trim() !== "") return Number(val);
  return val;
}

function flatten(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flatten(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}
