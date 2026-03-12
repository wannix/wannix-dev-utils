import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
  Upload,
  TreePine,
  FileText,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import { ToolShell } from "@/components/layout/ToolShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  evaluateJsonPath,
  searchInObject,
  resolvePathBreadcrumb,
  parseInput,
} from "./json-formatter.utils";
import {
  DEFAULT_INDENT,
  MAX_INPUT_LENGTH,
  PLACEHOLDER_JSON,
  INDENT_LABELS,
} from "./json-formatter.constants";
import type {
  IndentStyle,
  ViewMode,
  ParseMode,
  ValidationError,
  TreeNode,
  SearchMatch,
  DuplicateKeyWarning,
  JsonPathResult,
} from "./json-formatter.types";

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }): JSX.Element {
  const { copied, copyToClipboard } = useCopyToClipboard();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={
        copied
          ? "text-primary hover:text-primary gap-1.5"
          : "text-muted-foreground gap-1.5"
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

/**
 * Recursive tree node renderer for the JSON tree view.
 */
function TreeNodeView({
  node,
  onToggle,
  onSelect,
  selectedPath,
  searchQuery,
  depth,
}: {
  node: TreeNode;
  onToggle: (path: string[]) => void;
  onSelect: (path: string[]) => void;
  selectedPath: string;
  searchQuery: string;
  depth: number;
}): JSX.Element {
  const isSelected = resolvePathBreadcrumb(node.path) === selectedPath;
  const hasChildren = node.children.length > 0;
  const isExpandable = node.type === "object" || node.type === "array";
  const q = searchQuery.toLowerCase();

  const isKeyMatch = q && node.key.toLowerCase().includes(q);
  const isValueMatch =
    q &&
    !isExpandable &&
    String(node.value).toLowerCase().includes(q);

  const typeColorClass: Record<string, string> = {
    string: "text-green-600 dark:text-green-400",
    number: "text-blue-600 dark:text-blue-400",
    boolean: "text-amber-600 dark:text-amber-400",
    null: "text-red-500 dark:text-red-400",
    object: "text-muted-foreground",
    array: "text-muted-foreground",
  };

  const formatValue = (n: TreeNode): string => {
    if (n.type === "string") return `"${String(n.value)}"`;
    if (n.type === "null") return "null";
    return String(n.value);
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
        className={`flex items-center gap-1 py-0.5 px-1 rounded text-sm font-mono cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}
        onClick={() => {
          if (isExpandable) onToggle(node.path);
          onSelect(node.path);
        }}
      >
        {/* Expand/collapse arrow */}
        {isExpandable ? (
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {node.collapsed ? (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </span>
        ) : (
          <span className="w-4 h-4 shrink-0" />
        )}

        {/* Key */}
        {node.path.length > 0 && (
          <span
            className={`${isKeyMatch ? "bg-yellow-300/40 dark:bg-yellow-500/30 rounded px-0.5" : "text-foreground"}`}
          >
            {/^\d+$/.test(node.key) ? `[${node.key}]` : `"${node.key}"`}
            <span className="text-muted-foreground">: </span>
          </span>
        )}

        {/* Value or child count */}
        {isExpandable ? (
          <span className="text-muted-foreground text-xs">{childCount}</span>
        ) : (
          <span
            className={`truncate ${typeColorClass[node.type] || ""} ${isValueMatch ? "bg-yellow-300/40 dark:bg-yellow-500/30 rounded px-0.5" : ""}`}
          >
            {formatValue(node)}
          </span>
        )}
      </div>

      {/* Children */}
      {!node.collapsed && hasChildren && (
        <div>
          {node.children.map((child, idx) => (
            <TreeNodeView
              key={`${child.key}-${idx}`}
              node={child}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedPath={selectedPath}
              searchQuery={searchQuery}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function JsonFormatterTool(): JSX.Element {
  // Core state
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [duplicateKeys, setDuplicateKeys] = useState<DuplicateKeyWarning[]>([]);

  // Settings
  const [indent, setIndent] = useState<IndentStyle>(DEFAULT_INDENT);
  const [sortKeys, setSortKeys] = useState(false);
  const [parseMode, setParseMode] = useState<ParseMode>("strict");
  const [viewMode, setViewMode] = useState<ViewMode>("text");

  // Search & JSONPath
  const [searchQuery, setSearchQuery] = useState("");
  const [jsonPathQuery, setJsonPathQuery] = useState("");
  const [jsonPathResults, setJsonPathResults] = useState<JsonPathResult[]>([]);
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);

  // Tree state
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [selectedPath, setSelectedPath] = useState("");

  // Drag & drop
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Process input ──────────────────────────
  const processInput = useCallback(
    (value: string, currentIndent: IndentStyle, currentSortKeys: boolean, currentParseMode: ParseMode) => {
      if (!value.trim()) {
        setOutput("");
        setErrors([]);
        setDuplicateKeys([]);
        setTreeData(null);
        setJsonPathResults([]);
        setSearchMatches([]);
        return;
      }

      // Validate
      const validationErrors =
        currentParseMode === "json5"
          ? validateJson5(value)
          : validateJson(value);
      setErrors(validationErrors);

      // Duplicate keys
      setDuplicateKeys(detectDuplicateKeys(value));

      if (validationErrors.length > 0) {
        setOutput("");
        setTreeData(null);
        return;
      }

      // Format
      try {
        const parsed = parseInput(value, currentParseMode === "json5");
        if (parsed === undefined) return;

        // Re-serialize through standard JSON for format
        const jsonString = JSON.stringify(parsed);
        const formatted = formatJson(jsonString, currentIndent, currentSortKeys);
        setOutput(formatted);

        // Build tree
        setTreeData(buildTree(parsed));
      } catch (err) {
        if (err instanceof Error) {
          setErrors([{ message: err.message, line: 1, column: 1 }]);
        }
        setOutput("");
        setTreeData(null);
      }
    },
    [],
  );

  useEffect(() => {
    processInput(input, indent, sortKeys, parseMode);
  }, [input, indent, sortKeys, parseMode, processInput]);

  // ── Search effect ──────────────────────────
  useEffect(() => {
    if (!searchQuery || !input.trim()) {
      setSearchMatches([]);
      setSearchIndex(0);
      return;
    }
    try {
      const parsed = parseInput(input, parseMode === "json5");
      if (parsed === undefined) return;
      const matches = searchInObject(parsed, searchQuery);
      setSearchMatches(matches);
      setSearchIndex(0);
    } catch {
      setSearchMatches([]);
    }
  }, [searchQuery, input, parseMode]);

  // ── JSONPath effect ────────────────────────
  useEffect(() => {
    if (!jsonPathQuery || !input.trim()) {
      setJsonPathResults([]);
      return;
    }
    try {
      const parsed = parseInput(input, parseMode === "json5");
      if (parsed === undefined) return;
      const results = evaluateJsonPath(parsed, jsonPathQuery);
      setJsonPathResults(results);
    } catch {
      setJsonPathResults([]);
    }
  }, [jsonPathQuery, input, parseMode]);

  // ── Handlers ───────────────────────────────
  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setErrors([]);
    setDuplicateKeys([]);
    setTreeData(null);
    setSearchQuery("");
    setJsonPathQuery("");
    setJsonPathResults([]);
    setSearchMatches([]);
    setSelectedPath("");
    setSortKeys(false);
    inputRef.current?.focus();
  }, []);

  const handleAutoFix = useCallback(() => {
    if (!input.trim()) return;
    try {
      const fixed = autoFixJson(input);
      setInput(fixed);
    } catch (err) {
      // If JSON5 can't parse it either, show the error
      if (err instanceof Error) {
        setErrors([{ message: `Auto-fix failed: ${err.message}`, line: 1, column: 1 }]);
      }
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    if (!output) return;
    try {
      const minified = minifyJson(output);
      setOutput(minified);
    } catch {
      // output is already derived from valid parse, shouldn't fail
    }
  }, [output]);

  const handlePrettyPrint = useCallback(() => {
    // Re-trigger format from current input
    processInput(input, indent, sortKeys, parseMode);
  }, [input, indent, sortKeys, parseMode, processInput]);

  const handleToggleTreeNode = useCallback(
    (path: string[]) => {
      if (!treeData) return;
      const toggleNode = (node: TreeNode, targetPath: string[]): TreeNode => {
        const pathStr = JSON.stringify(node.path);
        const targetStr = JSON.stringify(targetPath);
        if (pathStr === targetStr) {
          return { ...node, collapsed: !node.collapsed };
        }
        return {
          ...node,
          children: node.children.map((child) =>
            toggleNode(child, targetPath),
          ),
        };
      };
      setTreeData(toggleNode(treeData, path));
    },
    [treeData],
  );

  const handleExpandAll = useCallback(() => {
    if (!treeData) return;
    const expandAll = (node: TreeNode): TreeNode => ({
      ...node,
      collapsed: false,
      children: node.children.map(expandAll),
    });
    setTreeData(expandAll(treeData));
  }, [treeData]);

  const handleCollapseAll = useCallback(() => {
    if (!treeData) return;
    const collapseAll = (node: TreeNode): TreeNode => ({
      ...node,
      collapsed: node.children.length > 0,
      children: node.children.map(collapseAll),
    });
    setTreeData(collapseAll(treeData));
  }, [treeData]);

  const handleSelectNode = useCallback((path: string[]) => {
    setSelectedPath(resolvePathBreadcrumb(path));
  }, []);

  const cycleSearchMatch = useCallback(
    (direction: 1 | -1) => {
      if (searchMatches.length === 0) return;
      const next =
        (searchIndex + direction + searchMatches.length) %
        searchMatches.length;
      setSearchIndex(next);
      const match = searchMatches[next];
      setSelectedPath(resolvePathBreadcrumb(match.path));
    },
    [searchMatches, searchIndex],
  );

  // ── Drag & drop ────────────────────────────
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (
          file.type === "application/json" ||
          file.name.endsWith(".json") ||
          file.name.endsWith(".json5")
        ) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const text = event.target?.result;
            if (typeof text === "string") {
              setInput(text);
            }
          };
          reader.readAsText(file);
        }
      }
    },
    [],
  );

  // ── Keyboard shortcuts ─────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        handleClear();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "f") {
        e.preventDefault();
        handlePrettyPrint();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClear, handlePrettyPrint]);

  // ── Auto-focus input ───────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Computed values ────────────────────────
  const minifiedOutput = useMemo(() => {
    if (!output) return "";
    try {
      return minifyJson(output);
    } catch {
      return "";
    }
  }, [output]);

  const lineNumbers = useMemo(() => {
    const lines = input.split("\n");
    return lines.map((_, i) => i + 1);
  }, [input]);

  const isValid = errors.length === 0 && input.trim().length > 0;

  // ── Render ─────────────────────────────────
  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, validate, search, and navigate JSON with tree view and auto-fix."
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
            Clear (Esc)
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[400px] gap-4">
        {/* ── Toolbar ─────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 bg-muted/20 p-2 rounded-lg border border-border/40">
          {/* Indent select */}
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value as IndentStyle)}
            className="h-8 rounded-md border border-border/50 bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {(Object.keys(INDENT_LABELS) as IndentStyle[]).map((key) => (
              <option key={key} value={key}>
                {INDENT_LABELS[key]}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-border/50 hidden sm:block" />

          {/* Format / Minify */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrettyPrint}
            className="gap-1.5 text-xs"
            disabled={!input.trim()}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Format
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMinify}
            className="gap-1.5 text-xs"
            disabled={!output}
          >
            <Minimize2 className="h-3.5 w-3.5" />
            Minify
          </Button>

          <div className="w-px h-6 bg-border/50 hidden sm:block" />

          {/* Sort Keys */}
          <Button
            variant={sortKeys ? "default" : "outline"}
            size="sm"
            onClick={() => setSortKeys(!sortKeys)}
            className="gap-1.5 text-xs"
          >
            <SortAsc className="h-3.5 w-3.5" />
            Sort Keys
          </Button>

          {/* Auto Fix */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoFix}
            className="gap-1.5 text-xs"
            disabled={!input.trim() || isValid}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Auto Fix
          </Button>

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-md border border-border/50 p-0.5 bg-background">
            <button
              onClick={() => setViewMode("text")}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${viewMode === "text" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <FileText className="h-3.5 w-3.5 inline-block mr-1" />
              Text
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${viewMode === "tree" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <TreePine className="h-3.5 w-3.5 inline-block mr-1" />
              Tree
            </button>
          </div>
        </div>

        {/* ── Duplicate key warning ───────── */}
        {duplicateKeys.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>
              Duplicate keys found:{" "}
              {duplicateKeys.map((d) => `"${d.key}" (lines ${d.lines.join(", ")})`).join("; ")}
            </span>
          </div>
        )}

        {/* ── Main Editor Area ────────────── */}
        <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Input Pane */}
          <Card
            ref={dropRef}
            className={`flex flex-col border-border/50 bg-card shadow-sm overflow-hidden relative ${errors.length > 0 ? "border-destructive/50" : ""} ${isDragging ? "ring-2 ring-primary border-primary" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardHeader className="py-2 px-3 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Input
              </CardTitle>
              <div className="flex items-center gap-1">
                <label
                  className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title="Upload .json file"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                  <input
                    type="file"
                    accept=".json,.json5"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const text = ev.target?.result;
                        if (typeof text === "string") {
                          setInput(text);
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <span className="text-xs text-muted-foreground/60">
                  {input.length > 0 && `${input.length.toLocaleString()} chars`}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative overflow-hidden">
              <div className="flex h-full overflow-auto scrollbar-thin">
                {/* Line numbers */}
                {input.length > 0 && (
                  <div className="flex flex-col items-end px-2 py-4 text-xs text-muted-foreground/40 font-mono select-none bg-muted/10 border-r border-border/20 shrink-0 leading-relaxed">
                    {lineNumbers.map((num) => (
                      <span
                        key={num}
                        className={
                          errors.some((e) => e.line === num)
                            ? "text-destructive font-bold"
                            : ""
                        }
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  className="flex-1 h-full font-mono text-sm resize-none border-0 focus-visible:ring-0 focus:outline-none rounded-none bg-transparent p-4 leading-relaxed"
                  placeholder={`Paste JSON here or drag & drop a .json file...\n\nExample:\n${PLACEHOLDER_JSON}`}
                  value={input}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= MAX_INPUT_LENGTH) {
                      setInput(val);
                    }
                  }}
                  spellCheck={false}
                />
              </div>

              {/* Error overlay */}
              {errors.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 border-t border-destructive/20 px-3 py-2 text-xs text-destructive space-y-0.5">
                  {errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>
                        Line {err.line}, Col {err.column}: {err.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Drag overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary/40 rounded-md z-10">
                  <div className="flex flex-col items-center gap-2 text-primary">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">
                      Drop .json file here
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Pane */}
          <Card className="flex flex-col border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="py-2 px-3 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {viewMode === "text" ? "Formatted Output" : "Tree View"}
                </CardTitle>
                {isValid && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                  >
                    Valid
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {viewMode === "tree" && treeData && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={handleExpandAll}
                      title="Expand All"
                    >
                      <ChevronsUpDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={handleCollapseAll}
                      title="Collapse All"
                    >
                      <ChevronsDownUp className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
                <CopyButton text={output} label="Formatted" />
                <CopyButton text={minifiedOutput} label="Minified" />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto bg-muted/5 scrollbar-thin">
              {viewMode === "text" ? (
                <textarea
                  className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed text-muted-foreground"
                  value={output}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                />
              ) : treeData ? (
                <div className="p-2 overflow-auto h-full scrollbar-thin">
                  <TreeNodeView
                    node={treeData}
                    onToggle={handleToggleTreeNode}
                    onSelect={handleSelectNode}
                    selectedPath={selectedPath}
                    searchQuery={searchQuery}
                    depth={0}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm italic">
                  Enter valid JSON to see tree view...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom Bar: Search + JSONPath + Breadcrumb ── */}
        <div className="flex flex-col sm:flex-row gap-2 bg-muted/20 p-2 rounded-lg border border-border/40">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys / values..."
              className="flex-1 h-7 bg-transparent border-0 text-sm focus:outline-none placeholder:text-muted-foreground/50 min-w-0"
            />
            {searchMatches.length > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {searchIndex + 1}/{searchMatches.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground"
                  onClick={() => cycleSearchMatch(-1)}
                >
                  <ChevronRight className="h-3 w-3 rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground"
                  onClick={() => cycleSearchMatch(1)}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border/50 hidden sm:block self-center" />

          {/* JSONPath */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              JSONPath
            </span>
            <input
              type="text"
              value={jsonPathQuery}
              onChange={(e) => setJsonPathQuery(e.target.value)}
              placeholder="$.store.book[*].title"
              className="flex-1 h-7 bg-transparent border-0 text-sm font-mono focus:outline-none placeholder:text-muted-foreground/50 min-w-0"
            />
            {jsonPathQuery && (
              <span className="text-xs text-muted-foreground shrink-0">
                {jsonPathResults.length} result
                {jsonPathResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="w-px h-6 bg-border/50 hidden sm:block self-center" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono truncate shrink-0 max-w-[200px] sm:max-w-[300px]">
            <span className="truncate" title={selectedPath || "$"}>
              {selectedPath || "$"}
            </span>
          </div>
        </div>

        {/* ── JSONPath Results ─────────────── */}
        {jsonPathResults.length > 0 && (
          <div className="bg-muted/20 border border-border/40 rounded-lg p-3 max-h-32 overflow-auto scrollbar-thin">
            <div className="text-xs font-semibold text-muted-foreground mb-1.5">
              JSONPath Results ({jsonPathResults.length})
            </div>
            <div className="space-y-1">
              {jsonPathResults.map((result, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs font-mono"
                >
                  <span className="text-muted-foreground shrink-0">
                    {result.path}:
                  </span>
                  <span className="text-foreground truncate">
                    {typeof result.value === "object"
                      ? JSON.stringify(result.value)
                      : String(result.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {jsonPathQuery && jsonPathResults.length === 0 && input.trim() && isValid && (
          <div className="text-xs text-muted-foreground/60 italic text-center">
            No matches found for JSONPath expression &ldquo;{jsonPathQuery}&rdquo;
          </div>
        )}
      </div>
    </ToolShell>
  );
}
