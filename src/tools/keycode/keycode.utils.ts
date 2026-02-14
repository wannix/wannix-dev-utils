import type {
  KeyInfo,
  MouseInfo,
  WheelInfo,
  TouchInfo,
  KeyProperty,
  EventHistoryItem,
} from "./keycode.types";

const LOCATION_MAP: Record<number, string> = {
  0: "General",
  1: "Left",
  2: "Right",
  3: "Numpad",
};

const BUTTON_MAP: Record<number, string> = {
  0: "Left",
  1: "Middle",
  2: "Right",
  3: "Back",
  4: "Forward",
};

const DELTA_MODE_MAP: Record<number, string> = {
  0: "Pixel",
  1: "Line",
  2: "Page",
};

// ─── Keyboard ───

/** Captures key event properties from a KeyboardEvent into a serializable KeyInfo object. */
export function captureKeyInfo(e: KeyboardEvent): KeyInfo {
  return {
    key: e.key,
    code: e.code,
    keyCode: e.keyCode,
    which: e.which,
    location: e.location,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    repeat: e.repeat,
  };
}

/** Returns a human-readable display label for a captured key event (e.g. 'Space', 'Enter'). */
export function getKeyLabel(info: KeyInfo): string {
  if (info.key === " ") return "Space";
  if (info.key === "Enter") return "↵ Enter";
  if (info.key === "Tab") return "⇥ Tab";
  if (info.key === "Backspace") return "⌫ Backspace";
  if (info.key === "Delete") return "⌦ Delete";
  if (info.key === "Escape") return "Esc";
  if (info.key === "ArrowUp") return "↑";
  if (info.key === "ArrowDown") return "↓";
  if (info.key === "ArrowLeft") return "←";
  if (info.key === "ArrowRight") return "→";
  if (info.key === "Shift") return "⇧ Shift";
  if (info.key === "Control") return "⌃ Ctrl";
  if (info.key === "Alt") return "⌥ Alt";
  if (info.key === "Meta") return "⌘ Cmd";
  if (info.key === "CapsLock") return "⇪ Caps";
  return info.key.length === 1 ? info.key.toUpperCase() : info.key;
}

/** Extracts keyboard event properties as label/value pairs for display in the UI. */
export function getKeyProperties(info: KeyInfo): KeyProperty[] {
  return [
    {
      label: "event.key",
      value: info.key === " " ? '" "' : `"${info.key}"`,
      description: "The value of the key pressed",
    },
    {
      label: "event.code",
      value: `"${info.code}"`,
      description: "Physical key on the keyboard",
    },
    {
      label: "event.keyCode",
      value: String(info.keyCode),
      description: "Numeric code (deprecated)",
    },
    {
      label: "event.which",
      value: String(info.which),
      description: "Numeric code (deprecated)",
    },
    {
      label: "event.location",
      value: `${info.location} (${LOCATION_MAP[info.location] ?? "Unknown"})`,
      description: "Key location on keyboard",
    },
    {
      label: "event.altKey",
      value: String(info.altKey),
      description: "Alt/Option key held",
    },
    {
      label: "event.ctrlKey",
      value: String(info.ctrlKey),
      description: "Control key held",
    },
    {
      label: "event.metaKey",
      value: String(info.metaKey),
      description: "Meta/Cmd key held",
    },
    {
      label: "event.shiftKey",
      value: String(info.shiftKey),
      description: "Shift key held",
    },
    {
      label: "event.repeat",
      value: String(info.repeat),
      description: "Key is being held down",
    },
  ];
}

// ─── Mouse ───

/** Captures mouse event properties from a MouseEvent into a serializable MouseInfo object. */
export function captureMouseInfo(e: MouseEvent): MouseInfo {
  return {
    type: e.type,
    button: e.button,
    buttons: e.buttons,
    clientX: Math.round(e.clientX),
    clientY: Math.round(e.clientY),
    screenX: Math.round(e.screenX),
    screenY: Math.round(e.screenY),
    offsetX: Math.round(e.offsetX),
    offsetY: Math.round(e.offsetY),
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
  };
}

/** Returns a human-readable label for a mouse event (e.g. 'Left Click', 'Right Click'). */
export function getMouseLabel(info: MouseInfo): string {
  const btn = BUTTON_MAP[info.button] ?? `Button ${info.button}`;
  if (info.type === "dblclick") return `🖱 Double ${btn}`;
  if (info.type === "contextmenu") return "🖱 Right Click";
  return `🖱 ${btn} Click`;
}

/** Extracts mouse event properties as label/value pairs for display in the UI. */
export function getMouseProperties(info: MouseInfo): KeyProperty[] {
  return [
    {
      label: "event.type",
      value: `"${info.type}"`,
      description: "Mouse event type",
    },
    {
      label: "event.button",
      value: `${info.button} (${BUTTON_MAP[info.button] ?? "Unknown"})`,
      description: "Button that triggered the event",
    },
    {
      label: "event.buttons",
      value: String(info.buttons),
      description: "Bitmask of currently pressed buttons",
    },
    {
      label: "event.clientX",
      value: String(info.clientX),
      description: "X coordinate in viewport",
    },
    {
      label: "event.clientY",
      value: String(info.clientY),
      description: "Y coordinate in viewport",
    },
    {
      label: "event.screenX",
      value: String(info.screenX),
      description: "X coordinate on screen",
    },
    {
      label: "event.screenY",
      value: String(info.screenY),
      description: "Y coordinate on screen",
    },
    {
      label: "event.offsetX",
      value: String(info.offsetX),
      description: "X offset within target element",
    },
    {
      label: "event.offsetY",
      value: String(info.offsetY),
      description: "Y offset within target element",
    },
    {
      label: "event.altKey",
      value: String(info.altKey),
      description: "Alt/Option key held",
    },
    {
      label: "event.ctrlKey",
      value: String(info.ctrlKey),
      description: "Control key held",
    },
    {
      label: "event.metaKey",
      value: String(info.metaKey),
      description: "Meta/Cmd key held",
    },
    {
      label: "event.shiftKey",
      value: String(info.shiftKey),
      description: "Shift key held",
    },
  ];
}

// ─── Wheel ───

/** Captures wheel event properties from a WheelEvent into a serializable WheelInfo object. */
export function captureWheelInfo(e: WheelEvent): WheelInfo {
  return {
    deltaX: Math.round(e.deltaX * 100) / 100,
    deltaY: Math.round(e.deltaY * 100) / 100,
    deltaZ: Math.round(e.deltaZ * 100) / 100,
    deltaMode: e.deltaMode,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
  };
}

/** Extracts wheel event properties as label/value pairs for display in the UI. */
export function getWheelProperties(info: WheelInfo): KeyProperty[] {
  return [
    {
      label: "event.deltaX",
      value: String(info.deltaX),
      description: "Horizontal scroll amount",
    },
    {
      label: "event.deltaY",
      value: String(info.deltaY),
      description: "Vertical scroll amount",
    },
    {
      label: "event.deltaZ",
      value: String(info.deltaZ),
      description: "Z-axis scroll amount",
    },
    {
      label: "event.deltaMode",
      value: `${info.deltaMode} (${DELTA_MODE_MAP[info.deltaMode] ?? "Unknown"})`,
      description: "Unit of delta values",
    },
    {
      label: "event.altKey",
      value: String(info.altKey),
      description: "Alt/Option key held",
    },
    {
      label: "event.ctrlKey",
      value: String(info.ctrlKey),
      description: "Control key held",
    },
    {
      label: "event.metaKey",
      value: String(info.metaKey),
      description: "Meta/Cmd key held",
    },
    {
      label: "event.shiftKey",
      value: String(info.shiftKey),
      description: "Shift key held",
    },
  ];
}

// ─── Touch ───

/** Captures touch event properties from a TouchEvent into a serializable TouchInfo object. */
export function captureTouchInfo(e: TouchEvent): TouchInfo {
  return {
    type: e.type,
    touches: e.touches.length,
    changedTouches: e.changedTouches.length,
    targetTouches: e.targetTouches.length,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
  };
}

/** Returns a human-readable label for a touch event (e.g. 'Touch (2 points)'). */
export function getTouchLabel(info: TouchInfo): string {
  return `👆 ${info.type} (${info.touches})`;
}

/** Extracts touch event properties as label/value pairs for display in the UI. */
export function getTouchProperties(info: TouchInfo): KeyProperty[] {
  return [
    {
      label: "event.type",
      value: `"${info.type}"`,
      description: "Touch event type",
    },
    {
      label: "event.touches",
      value: String(info.touches),
      description: "Number of touch points",
    },
    {
      label: "event.changedTouches",
      value: String(info.changedTouches),
      description: "Changed touch points",
    },
    {
      label: "event.targetTouches",
      value: String(info.targetTouches),
      description: "Target element touch points",
    },
    {
      label: "event.altKey",
      value: String(info.altKey),
      description: "Alt/Option key held",
    },
    {
      label: "event.ctrlKey",
      value: String(info.ctrlKey),
      description: "Control key held",
    },
    {
      label: "event.metaKey",
      value: String(info.metaKey),
      description: "Meta/Cmd key held",
    },
    {
      label: "event.shiftKey",
      value: String(info.shiftKey),
      description: "Shift key held",
    },
  ];
}

// ─── History helpers ───

export function keyToHistoryItem(info: KeyInfo): EventHistoryItem {
  return {
    type: "keyboard",
    label: getKeyLabel(info),
    detail: info.code,
    timestamp: Date.now(),
  };
}

export function mouseToHistoryItem(info: MouseInfo): EventHistoryItem {
  return {
    type: "mouse",
    label: getMouseLabel(info),
    detail: `(${info.clientX}, ${info.clientY})`,
    timestamp: Date.now(),
  };
}

export function wheelToHistoryItem(info: WheelInfo): EventHistoryItem {
  return {
    type: "wheel",
    label: "🖲 Scroll",
    detail: `Δ(${info.deltaX}, ${info.deltaY})`,
    timestamp: Date.now(),
  };
}

export function touchToHistoryItem(info: TouchInfo): EventHistoryItem {
  return {
    type: "touch",
    label: getTouchLabel(info),
    detail: info.type,
    timestamp: Date.now(),
  };
}
