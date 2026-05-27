import * as React from "react";

const SINGLE_LINE_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "span", "label"]);

export interface EditableTextProps {
    value: string;
    configKey: string;
    tag?: string;
    style?: React.CSSProperties;
    className?: string;
    placeholder?: string;
}

export function EditableText({
    value,
    configKey,
    tag = "span",
    style,
    className,
    placeholder,
}: EditableTextProps) {
    const ref = React.useRef<HTMLElement>(null);
    const [isEditor, setIsEditor] = React.useState(false);
    const componentIdRef = React.useRef("");
    const isSingleLine = SINGLE_LINE_TAGS.has(tag);

    React.useEffect(() => {
        if (!ref.current) return;
        const editorEl = ref.current.closest("[data-treyza-editor-mode]");
        if (!editorEl) return;
        setIsEditor(true);
        const compEl = ref.current.closest("[data-marketplace-component-id]");
        componentIdRef.current = compEl?.getAttribute("data-marketplace-component-id") || "";
    }, []);

    React.useEffect(() => {
        if (!ref.current || !isEditor) return;
        if (ref.current !== document.activeElement) {
            ref.current.textContent = value || "";
        }
    }, [value, isEditor]);

    const handleBlur = React.useCallback(() => {
        if (!ref.current || !isEditor) return;
        const text = isSingleLine
            ? (ref.current.textContent || "")
            : (ref.current.innerText || "");
        if (text !== value) {
            window.parent.postMessage(
                {
                    source: "treyza-preview",
                    type: "INLINE_EDIT",
                    componentId: componentIdRef.current,
                    payload: { field: configKey, value: text },
                },
                "*",
            );
        }
    }, [value, configKey, isEditor, isSingleLine]);

    const handlePaste = React.useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
    }, []);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && isSingleLine) {
                e.preventDefault();
                (e.target as HTMLElement).blur();
            }
        },
        [isSingleLine],
    );

    const Tag = tag as React.ElementType;
    const isEmpty = !value || value.trim() === "";

    const editorStyle: React.CSSProperties | undefined = isEditor
        ? {
              ...style,
              cursor: "text",
              outline: "none",
              minWidth: isEmpty ? 80 : undefined,
              minHeight: isEmpty ? "1em" : undefined,
          }
        : style;

    return (
        <Tag
            ref={ref as React.Ref<never>}
            contentEditable={isEditor ? true : undefined}
            suppressContentEditableWarning={isEditor || undefined}
            onBlur={isEditor ? handleBlur : undefined}
            onPaste={isEditor ? handlePaste : undefined}
            onKeyDown={isEditor ? handleKeyDown : undefined}
            style={editorStyle}
            className={className}
            data-config-key={configKey}
            data-placeholder={isEditor && isEmpty ? (placeholder || "Metin ekleyin...") : undefined}
        >
            {isEditor ? undefined : (value || "")}
        </Tag>
    );
}
