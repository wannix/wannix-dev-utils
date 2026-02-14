import yaml from 'js-yaml'

export function toJson(yamlStr: string): string {
    if (!yamlStr.trim()) return ''
    try {
        const obj = yaml.load(yamlStr)
        return JSON.stringify(obj, null, 2)
    } catch (e: any) {
        throw new Error(e.message || 'Invalid YAML')
    }
}

export function toYaml(jsonStr: string): string {
    if (!jsonStr.trim()) return ''
    try {
        const obj = JSON.parse(jsonStr)
        return yaml.dump(obj, { indent: 2 })
    } catch (e: any) {
        throw new Error(e.message || 'Invalid JSON')
    }
}
