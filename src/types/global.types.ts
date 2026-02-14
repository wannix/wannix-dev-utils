export type Theme = "light" | "dark" | "system";

export interface ToolHistoryItem {
  toolId: string;
  timestamp: number;
  input?: string;
  output?: string;
}
