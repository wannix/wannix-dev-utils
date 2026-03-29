import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type DragEvent,
} from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as monacoApi from "monaco-editor";
import { useTheme } from "next-themes";
import {
  Copy,
  Trash2,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Minimize2,
  Maximize2,
  SortAsc,
  Wand2,
  Search,
  Replace,
  Upload,
  TreePine,
  FileText,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import { ToolShell } from "@/components/layout/ToolShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  formatJson,
  minifyJson,
  validateJson,
  validateJson5,
  autoFixJson,
  detectDuplicateKeys,
  buildTree,
  resolvePathBreadcrumb,
  parseInput,
} from "./json-formatter.utils";
import {
  DEFAULT_INDENT,
  MAX_INPUT_LENGTH,
  INDENT_LABELS,
} from "./json-formatter.constants";
import type {
  IndentStyle,
  ViewMode,
  ParseMode,
  ValidationError,
  TreeNode,
  DuplicateKeyWarning,
} from "./json-formatter.types";

loader.config({ monaco: monacoApi });

function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}): JSX.Element {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={
        copied
          ? "h-7 gap-1.5 px-2 text-[11px] text-primary hover:text-primary"
          : "h-7 gap-1.5 px-2 text-[11px] text-muted-foreground"
      }
      onClick={() => copyToClipboard(text)}
      disabled={!text}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : label}
    </Button>
  );
}

function TreeNodeView({
  node,
  onToggle,
  onSelect,
  selectedPath,
  depth,
}: {
  node: TreeNode;
  onToggle: (path: string[]) => void;
  onSelect: (path: string[]) => void;
  selectedPath: string;
  depth: number;
}): JSX.Element {
  const isSelected = resolvePathBreadcrumb(node.path) === selectedPath;
  const hasChildren = node.children.length > 0;
  const isExpandable = node.type === "object" || node.type === "array";

  const typeColorClass: Record<string, string> = {
    string: "text-green-600 dark:text-green-400",
    number: "text-blue-600 dark:text-blue-400",
    boolean: "text-amber-600 dark:text-amber-400",
    null: "text-red-500 dark:text-red-400",
    object: "text-muted-foreground",
    array: "text-muted-foreground",
  };

  const formatValue = (currentNode: TreeNode): string => {
    if (currentNode.type === "string") {
      return `"${String(currentNode.value)}"`;
    }
    if (currentNode.type === "null") {
      return "null";
    }
    return String(currentNode.value);
  };

  const childCount =
    node.type === "object"
      ? `{${node.children.length}}`
      : node.type === "array"
        ? `[${node.children.length}]`
        : "";

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 font-mono text-sm transition-colors hover:bg-muted/50 ${
          isSelected ? "bg-primary/10 ring-1 ring-primary/30" : ""
        }`}
        onClick={() => {
          if (isExpandable) {
            onToggle(node.path);
          }
          onSelect(node.path);
        }}
      >
        {isExpandable ? (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            {node.collapsed ? (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </span>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}

        {node.path.length > 0 && (
          <span className="text-foreground">
            {/^\d+$/.test(node.key) ? `[${node.key}]` : `"${node.key}"`}
            <span className="text-muted-foreground">: </span>
          </span>
        )}

        {isExpandable ? (
          <span className="text-xs text-muted-foreground">{childCount}</span>
        ) : (
          <span className={`truncate ${typeColorClass[node.type] ?? ""}`}>
            {formatValue(node)}
          </span>
        )}
      </div>

      {!node.collapsed && hasChildren && (
        <div>
          {node.children.map((child, index) => (
            <TreeNodeView
              key={`${child.key}-${index}`}
              node={child}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedPath={selectedPath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function buildMarkers(
  errors: ValidationError[],
): monacoApi.editor.IMarkerData[] {
  return errors.map((error) => ({
    severity: monacoApi.MarkerSeverity.Error,
    message: error.message,
    startLineNumber: Math.max(error.line, 1),
    startColumn: Math.max(error.column, 1),
    endLineNumber: Math.max(error.line, 1),
    endColumn: Math.max(error.column + 1, 2),
  }));
}

function duplicateKeyMessage(warnings: DuplicateKeyWarning[]): string {
  return warnings
    .map((warning) => `"${warning.key}" (lines ${warning.lines.join(", ")})`)
    .join("; ");
}

interface FindControllerContribution {
  closeFindWidget: () => void;
}

function getFindController(
  editor: monacoApi.editor.IStandaloneCodeEditor,
): FindControllerContribution | null {
  const contribution = editor.getContribution("editor.contrib.findController");

  if (!contribution || typeof contribution !== "object") {
    return null;
  }

  const candidate = contribution as { closeFindWidget?: unknown };
  if (typeof candidate.closeFindWidget !== "function") {
    return null;
  }

  return contribution as FindControllerContribution;
}

export default function JsonFormatterTool(): JSX.Element {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<monacoApi.editor.IStandaloneCodeEditor | null>(null);
  const sortRestoreRef = useRef<string | null>(null);
  const findWidgetObserverRef = useRef<MutationObserver | null>(null);

  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<IndentStyle>(DEFAULT_INDENT);
  const [sortKeys, setSortKeys] = useState(false);
  const [parseMode, setParseMode] = useState<ParseMode>("strict");
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [isFindWidgetOpen, setIsFindWidgetOpen] = useState(false);
  const [isReplaceWidgetOpen, setIsReplaceWidgetOpen] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({
    lineNumber: 1,
    column: 1,
  });

  const isJson5Mode = parseMode === "json5";
  const editorLanguage = isJson5Mode ? "javascript" : "json";
  const editorTheme = resolvedTheme === "dark" ? "vs-dark" : "vs";

  const errors = useMemo(
    () => (isJson5Mode ? validateJson5(input) : validateJson(input)),
    [input, isJson5Mode],
  );

  const duplicateKeys = useMemo(() => detectDuplicateKeys(input), [input]);

  const parsedValue = useMemo(() => {
    if (!input.trim() || errors.length > 0) {
      return undefined;
    }

    try {
      return parseInput(input, isJson5Mode);
    } catch {
      return undefined;
    }
  }, [errors.length, input, isJson5Mode]);

  const isValid = errors.length === 0 && input.trim().length > 0;

  const minifiedContent = useMemo(() => {
    if (!isValid) {
      return "";
    }

    try {
      return minifyJson(input, isJson5Mode);
    } catch {
      return "";
    }
  }, [input, isJson5Mode, isValid]);

  const formattedContent = useMemo(() => {
    if (!isValid) {
      return "";
    }

    try {
      return formatJson(input, indent, sortKeys, isJson5Mode);
    } catch {
      return "";
    }
  }, [indent, input, isJson5Mode, isValid, sortKeys]);

  const lineCount = useMemo(
    () => (input.length > 0 ? input.split("\n").length : 1),
    [input],
  );

  const canFormat =
    viewMode === "text" &&
    isValid &&
    formattedContent.length > 0 &&
    input !== formattedContent;

  const canMinify =
    viewMode === "text" &&
    isValid &&
    minifiedContent.length > 0 &&
    input !== minifiedContent;

  const canToggleSort = sortKeys || isValid;

  const editorOptions =
    useMemo<monacoApi.editor.IStandaloneEditorConstructionOptions>(
      () => ({
        automaticLayout: true,
        minimap: { enabled: false },
        fontFamily:
          '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: 13,
        lineHeight: 21,
        padding: { top: 12, bottom: 12 },
        renderWhitespace: "selection",
        scrollBeyondLastLine: false,
        roundedSelection: false,
        wordWrap: "off",
        tabSize: indent === "4-spaces" ? 4 : 2,
        insertSpaces: indent !== "tabs",
        bracketPairColorization: { enabled: true },
        guides: {
          indentation: true,
          bracketPairs: true,
        },
        stickyScroll: { enabled: false },
        glyphMargin: false,
        folding: true,
        lineNumbersMinChars: 3,
        contextmenu: true,
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        occurrencesHighlight: "off",
        selectionHighlight: false,
        renderLineHighlight: "all",
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        unicodeHighlight: {
          ambiguousCharacters: false,
        },
      }),
      [indent],
    );

  const applyEditorValue = useCallback((nextValue: string) => {
    const editor = editorRef.current;
    const model = editor?.getModel();

    if (editor && model) {
      editor.pushUndoStop();
      editor.executeEdits("json-formatter", [
        {
          range: model.getFullModelRange(),
          text: nextValue,
          forceMoveMarkers: true,
        },
      ]);
      editor.pushUndoStop();
      editor.focus();
    }

    setInput(nextValue);
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    const nextValue = value ?? "";

    if (nextValue.length > MAX_INPUT_LENGTH) {
      return;
    }

    setInput(nextValue);
  }, []);

  const handleEditorMount = useCallback(
    (editor: monacoApi.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      setCursorPosition(editor.getPosition() ?? { lineNumber: 1, column: 1 });
      editor.onDidChangeCursorPosition((event) => {
        setCursorPosition({
          lineNumber: event.position.lineNumber,
          column: event.position.column,
        });
      });

      const syncFindWidgetState = () => {
        const editorDomNode = editor.getDomNode();
        const findWidget = editorDomNode?.querySelector(
          ".find-widget",
        ) as HTMLElement | null;

        // Monaco adds native title tooltips to find-widget action buttons.
        // Strip them to keep the widget visually quiet.
        if (findWidget) {
          const tooltipTargets = findWidget.querySelectorAll<HTMLElement>(
            "[title]",
          );
          tooltipTargets.forEach((target) => {
            target.removeAttribute("title");
          });
        }

        const isVisible = Boolean(findWidget?.classList.contains("visible"));
        const isReplaceVisible =
          isVisible &&
          Boolean(findWidget?.classList.contains("replaceToggled"));

        setIsFindWidgetOpen(isVisible);
        setIsReplaceWidgetOpen(isReplaceVisible);
      };

      findWidgetObserverRef.current?.disconnect();
      const editorDomNode = editor.getDomNode();
      if (editorDomNode) {
        const observer = new MutationObserver(() => {
          syncFindWidgetState();
        });
        observer.observe(editorDomNode, {
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "style"],
        });
        findWidgetObserverRef.current = observer;
      }

      editor.onDidDispose(() => {
        findWidgetObserverRef.current?.disconnect();
        findWidgetObserverRef.current = null;
      });

      syncFindWidgetState();
      editor.focus();
    },
    [],
  );

  const closeSearchWidgets = useCallback(() => {
    const editor = editorRef.current;

    if (editor) {
      const findController = getFindController(editor);
      findController?.closeFindWidget();
    }

    requestAnimationFrame(() => {
      const editorDomNode = editorRef.current?.getDomNode();
      const findWidget = editorDomNode?.querySelector(
        ".find-widget",
      ) as HTMLElement | null;

      const isVisible = Boolean(findWidget?.classList.contains("visible"));
      const isReplaceVisible =
        isVisible && Boolean(findWidget?.classList.contains("replaceToggled"));

      setIsFindWidgetOpen(isVisible);
      setIsReplaceWidgetOpen(isReplaceVisible);
    });
  }, []);

  const handleIndentChange = useCallback(
    (nextIndent: IndentStyle) => {
      setIndent(nextIndent);

      if (!input.trim() || !isValid) {
        return;
      }

      try {
        const nextFormattedValue = formatJson(
          input,
          nextIndent,
          sortKeys,
          isJson5Mode,
        );

        if (nextFormattedValue !== input) {
          applyEditorValue(nextFormattedValue);
        }
      } catch {
        // Validation already drives the editor markers and status UI.
      }
    },
    [applyEditorValue, input, isJson5Mode, isValid, sortKeys],
  );

  const handleClear = useCallback(() => {
    sortRestoreRef.current = null;
    closeSearchWidgets();
    applyEditorValue("");
    setSortKeys(false);
    setSelectedPath("");
  }, [applyEditorValue, closeSearchWidgets]);

  const handleFormat = useCallback(() => {
    if (!canFormat) {
      return;
    }

    try {
      applyEditorValue(formattedContent);
    } catch {
      // Validation already drives the editor markers and status UI.
    }
  }, [applyEditorValue, canFormat, formattedContent]);

  const handleMinify = useCallback(() => {
    if (!canMinify) {
      return;
    }

    try {
      applyEditorValue(minifiedContent);
    } catch {
      // Validation already drives the editor markers and status UI.
    }
  }, [applyEditorValue, canMinify, minifiedContent]);

  const handleAutoFix = useCallback(() => {
    if (!input.trim()) {
      return;
    }

    try {
      const fixed = autoFixJson(input);
      applyEditorValue(formatJson(fixed, indent, sortKeys));
    } catch {
      // Auto-fix stays silent when JSON5 repair also fails.
    }
  }, [applyEditorValue, indent, input, sortKeys]);

  const handleToggleSortKeys = useCallback(() => {
    if (sortKeys) {
      const restoreValue = sortRestoreRef.current;
      sortRestoreRef.current = null;
      setSortKeys(false);

      if (restoreValue !== null) {
        applyEditorValue(restoreValue);
      }

      return;
    }

    if (!isValid || !input.trim()) {
      return;
    }

    try {
      const sortedValue = formatJson(input, indent, true, isJson5Mode);
      sortRestoreRef.current = input;
      setSortKeys(true);

      if (sortedValue !== input) {
        applyEditorValue(sortedValue);
      }
    } catch {
      sortRestoreRef.current = null;
    }
  }, [applyEditorValue, indent, input, isJson5Mode, isValid, sortKeys]);

  const handleToggleTreeNode = useCallback((path: string[]) => {
    setTreeData((currentTree) => {
      if (!currentTree) {
        return currentTree;
      }

      const toggleNode = (node: TreeNode): TreeNode => {
        if (JSON.stringify(node.path) === JSON.stringify(path)) {
          return { ...node, collapsed: !node.collapsed };
        }

        return {
          ...node,
          children: node.children.map(toggleNode),
        };
      };

      return toggleNode(currentTree);
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    setTreeData((currentTree) => {
      if (!currentTree) {
        return currentTree;
      }

      const expandNode = (node: TreeNode): TreeNode => ({
        ...node,
        collapsed: false,
        children: node.children.map(expandNode),
      });

      return expandNode(currentTree);
    });
  }, []);

  const handleCollapseAll = useCallback(() => {
    setTreeData((currentTree) => {
      if (!currentTree) {
        return currentTree;
      }

      const collapseNode = (node: TreeNode): TreeNode => ({
        ...node,
        collapsed: node.children.length > 0,
        children: node.children.map(collapseNode),
      });

      return collapseNode(currentTree);
    });
  }, []);

  const handleSelectNode = useCallback((path: string[]) => {
    setSelectedPath(resolvePathBreadcrumb(path));
  }, []);

  const handleToggleFindWidget = useCallback(() => {
    if (viewMode !== "text") {
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();

    if (isReplaceWidgetOpen) {
      getFindController(editor)?.closeFindWidget();
      void editor.getAction("actions.find")?.run();
      setIsFindWidgetOpen(true);
      setIsReplaceWidgetOpen(false);
      return;
    }

    if (isFindWidgetOpen) {
      closeSearchWidgets();
      return;
    }

    void editor.getAction("actions.find")?.run();
    setIsFindWidgetOpen(true);
    setIsReplaceWidgetOpen(false);
  }, [closeSearchWidgets, isFindWidgetOpen, isReplaceWidgetOpen, viewMode]);

  const handleToggleReplaceWidget = useCallback(() => {
    if (viewMode !== "text") {
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();

    if (isReplaceWidgetOpen) {
      closeSearchWidgets();
      return;
    }

    void editor.getAction("editor.action.startFindReplaceAction")?.run();
    setIsFindWidgetOpen(true);
    setIsReplaceWidgetOpen(true);
  }, [closeSearchWidgets, isReplaceWidgetOpen, viewMode]);

  const handleFileImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string" && text.length <= MAX_INPUT_LENGTH) {
          sortRestoreRef.current = null;
          setSortKeys(false);
          applyEditorValue(text);
        }
      };
      reader.readAsText(file);
    },
    [applyEditorValue],
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];
      if (
        file &&
        (file.type === "application/json" ||
          file.name.endsWith(".json") ||
          file.name.endsWith(".json5"))
      ) {
        handleFileImport(file);
      }
    },
    [handleFileImport],
  );

  useEffect(() => {
    setTreeData(parsedValue === undefined ? null : buildTree(parsedValue));
    if (parsedValue === undefined) {
      setSelectedPath("");
    }
  }, [parsedValue]);

  useEffect(() => {
    const model = editorRef.current?.getModel();
    if (!model) {
      return;
    }

    monacoApi.editor.setModelMarkers(
      model,
      "json-formatter-validation",
      isJson5Mode ? buildMarkers(errors) : [],
    );

    return () => {
      monacoApi.editor.setModelMarkers(model, "json-formatter-validation", []);
    };
  }, [errors, isJson5Mode]);

  useEffect(() => {
    if (viewMode !== "text") {
      closeSearchWidgets();
      return;
    }

    editorRef.current?.focus();
  }, [closeSearchWidgets, viewMode]);

  const statusText =
    input.trim().length === 0
      ? "Ready"
      : isValid
        ? "Valid"
        : `${errors.length} error${errors.length === 1 ? "" : "s"}`;
  const firstError = errors[0];
  const compactToolbarButtonClass = "h-7 gap-1.5 px-2 text-[11px]";
  const compactMetaClass = "px-1.5 text-[11px] text-muted-foreground/70";

  return (
    <ToolShell
      title="JSON Formatter"
      description="Edit, validate, search, and format JSON in a VS Code-style editor with an alternate tree view."
      headerClassName="px-4 py-3.5 sm:px-5 sm:py-3.5"
      contentClassName="p-3 pt-3 sm:p-4 sm:pt-4"
      headerContent={
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
          <CardTitle className="shrink-0 text-lg font-bold tracking-tight text-card-foreground">
            JSON Formatter
          </CardTitle>
          <CardDescription className="min-w-0 truncate text-sm text-muted-foreground">
            Edit, validate, search, and format JSON in a VS Code-style editor with an alternate tree view.
          </CardDescription>
        </div>
      }
      headerActions={
        <div className="flex items-center gap-2">
          <Badge
            variant={parseMode === "json5" ? "default" : "secondary"}
            className="cursor-pointer select-none"
            onClick={() =>
              setParseMode(parseMode === "strict" ? "json5" : "strict")
            }
          >
            {parseMode === "json5" ? "JSON5" : "Strict"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      }
    >
      <div className="flex h-[calc(100vh-12rem)] min-h-[540px] flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/40 bg-muted/20 p-1.5">
          <select
            value={indent}
            onChange={(event) =>
              handleIndentChange(event.target.value as IndentStyle)
            }
            className="h-7 rounded-md border border-border/50 bg-background px-2 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {(Object.keys(INDENT_LABELS) as IndentStyle[]).map((key) => (
              <option key={key} value={key}>
                {INDENT_LABELS[key]}
              </option>
            ))}
          </select>

          <div className="hidden h-5 w-px bg-border/50 lg:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleFormat}
            className={compactToolbarButtonClass}
            disabled={!canFormat}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Format
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMinify}
            className={compactToolbarButtonClass}
            disabled={!canMinify}
          >
            <Minimize2 className="h-3.5 w-3.5" />
            Minify
          </Button>
          <Button
            variant={sortKeys ? "default" : "outline"}
            size="sm"
            onClick={handleToggleSortKeys}
            className={compactToolbarButtonClass}
            disabled={!canToggleSort}
          >
            <SortAsc className="h-3.5 w-3.5" />
            Sort Keys
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoFix}
            className={compactToolbarButtonClass}
            disabled={!input.trim() || isValid}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Auto Fix
          </Button>

          <div className="hidden h-5 w-px bg-border/50 lg:block" />

          <Button
            variant={
              isFindWidgetOpen && !isReplaceWidgetOpen ? "default" : "outline"
            }
            size="sm"
            onClick={handleToggleFindWidget}
            className={compactToolbarButtonClass}
            disabled={viewMode !== "text"}
          >
            <Search className="h-3.5 w-3.5" />
            Find
          </Button>
          <Button
            variant={isReplaceWidgetOpen ? "default" : "outline"}
            size="sm"
            onClick={handleToggleReplaceWidget}
            className={compactToolbarButtonClass}
            disabled={viewMode !== "text"}
          >
            <Replace className="h-3.5 w-3.5" />
            Replace
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-1 rounded-md border border-border/50 bg-background p-0.5">
            <button
              onClick={() => setViewMode("text")}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                viewMode === "text"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="mr-1 inline-block h-3.5 w-3.5" />
              Text
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                viewMode === "tree"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TreePine className="mr-1 inline-block h-3.5 w-3.5" />
              Tree
            </button>
          </div>
        </div>

        {duplicateKeys.length > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Duplicate keys found: {duplicateKeyMessage(duplicateKeys)}
            </span>
          </div>
        )}

        {firstError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-[11px] text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Line {firstError.line}, Col {firstError.column}:{" "}
              {firstError.message}
              {errors.length > 1 ? ` (+${errors.length - 1} more)` : ""}
            </span>
          </div>
        )}

        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border/50 bg-card shadow-sm">
          <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-border/40 bg-muted/20 px-2.5 py-1.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {viewMode === "text" ? "Editor" : "Tree View"}
              </CardTitle>
              {viewMode === "text" && (
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    isValid
                      ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                      : "border-border/50"
                  }`}
                >
                  {statusText}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {viewMode === "text" ? (
                <label
                  className="flex cursor-pointer items-center gap-1.5 px-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  title="Upload .json or .json5 file"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                  <input
                    type="file"
                    accept=".json,.json5"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleFileImport(file);
                      }
                      event.target.value = "";
                    }}
                  />
                </label>
              ) : treeData ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={handleExpandAll}
                    title="Expand all"
                  >
                    <ChevronsUpDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={handleCollapseAll}
                    title="Collapse all"
                  >
                    <ChevronsDownUp className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : null}

              <span className={compactMetaClass}>
                {lineCount.toLocaleString()} lines
              </span>
              <span className={compactMetaClass}>
                {input.length.toLocaleString()} chars
              </span>
              <CopyButton text={input} label="Copy" />
              <CopyButton text={minifiedContent} label="Copy Minified" />
            </div>
          </CardHeader>

          <CardContent className="relative flex min-h-0 flex-1 p-0">
            {viewMode === "text" ? (
              <div
                className={`relative h-full w-full min-h-0 ${
                  isDragging ? "ring-2 ring-primary" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Editor
                  height="100%"
                  path="json-formatter-buffer"
                  language={editorLanguage}
                  theme={editorTheme}
                  value={input}
                  onChange={handleEditorChange}
                  onMount={handleEditorMount}
                  options={editorOptions}
                  loading={
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Loading editor...
                    </div>
                  }
                />

                {isDragging && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-primary/40 bg-primary/5 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-primary">
                      <Upload className="h-8 w-8" />
                      <span className="text-sm font-medium">
                        Drop .json file here
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : treeData ? (
              <div className="h-full w-full overflow-auto p-1.5 scrollbar-thin">
                <TreeNodeView
                  node={treeData}
                  onToggle={handleToggleTreeNode}
                  onSelect={handleSelectNode}
                  selectedPath={selectedPath}
                  depth={0}
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm italic text-muted-foreground/50">
                {input.trim().length === 0
                  ? "Enter JSON to inspect the tree."
                  : "Resolve validation errors to inspect the tree."}
              </div>
            )}
          </CardContent>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 bg-muted/20 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{parseMode === "json5" ? "JSON5" : "JSON"}</span>
              <span>{statusText}</span>
              <span>
                {viewMode === "text" ? "Find: Cmd/Ctrl+F" : selectedPath || "$"}
              </span>
            </div>
            {viewMode === "text" ? (
              <div className="flex items-center gap-3">
                <span>Ln {cursorPosition.lineNumber}</span>
                <span>Col {cursorPosition.column}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>{lineCount.toLocaleString()} lines</span>
                <span>{input.length.toLocaleString()} chars</span>
                <span>Tree</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ToolShell>
  );
}
