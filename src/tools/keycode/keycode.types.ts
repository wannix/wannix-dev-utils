export interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  repeat: boolean;
}

export interface MouseInfo {
  type: string;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  offsetX: number;
  offsetY: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface WheelInfo {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  deltaMode: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface TouchInfo {
  type: string;
  touches: number;
  changedTouches: number;
  targetTouches: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export type EventType = "keyboard" | "mouse" | "wheel" | "touch";

export interface KeyProperty {
  label: string;
  value: string;
  description: string;
}

export interface EventHistoryItem {
  type: EventType;
  label: string;
  detail: string;
  timestamp: number;
}
