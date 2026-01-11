import * as React from "react";
import { useFileDrop } from "@/shared/hooks/use-file-drop.hook";
import { cn } from "@/shared/lib/utils";
import { Upload, X } from "lucide-react";
import Button from "@/shared/ui/button/button";

export interface FileDropZoneProps {
  value?: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string[];
  maxSize?: number;
  label?: string;
  placeholder?: string;
  className?: string;
  variant?: "default" | "compact" | "large";
  showPreview?: boolean;
  orientation?: "vertical" | "horizontal";
  previewComponent?: (file: File) => React.ReactNode;
}

export function FileDropZone({
  value,
  onFileChange,
  accept = [],
  maxSize,
  label,
  placeholder = "Drag and drop a file here or click to select",
  className,
  variant = "default",
  orientation = "vertical",
  showPreview = true,
  previewComponent,
}: FileDropZoneProps) {
  const {
    isDragging,
    error,
    dragHandlers,
    fileInputHandlers,
    openFileDialog,
    fileInputRef,
  } = useFileDrop({
    onDrop: (file) => onFileChange(file),
    accept,
    maxSize,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getFileIcon = () => {
    if (value?.type.startsWith("video/")) {
      return "🎥";
    }
    if (value?.type.startsWith("image/")) {
      return "🖼️";
    }
    return "📄";
  };

  const variantClasses = {
    default: orientation === "horizontal" ? "min-h-[120px]" : "min-h-[200px]",
    compact:
      orientation === "horizontal"
        ? "min-h-[80px]"
        : "min-h-[120px] max-w-[200px]",
    large: orientation === "horizontal" ? "min-h-[200px]" : "min-h-[400px]",
  };

  const orientationClasses = {
    vertical: "flex-col",
    horizontal: "flex-row",
  };

  const paddingClasses = {
    vertical: "p-8",
    horizontal: variant === "compact" ? "p-4" : "p-6",
  };

  return (
    <div className={cn("relative", className)}>
      <div
        {...dragHandlers}
        onClick={openFileDialog}
        className={cn(
          "w-full border-2 border-dashed rounded-lg transition-all cursor-pointer",
          "flex items-center justify-center gap-4",
          orientationClasses[orientation],
          paddingClasses[orientation],
          variantClasses[variant],
          isDragging
            ? "bg-primary/10 border-primary border-solid scale-[1.02]"
            : "bg-muted/30 hover:bg-muted/50 border-muted-foreground/25",
          error && "border-destructive",
          value && "border-primary/50 bg-primary/5"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          className="hidden"
          {...fileInputHandlers}
        />

        {value ? (
          <div
            className={cn(
              "flex items-center gap-4 w-full",
              orientation === "horizontal" ? "flex-row" : "flex-col"
            )}
          >
            {showPreview && (
              <div
                className={cn(
                  "flex items-center justify-center",
                  orientation === "horizontal" ? "shrink-0" : ""
                )}
              >
                {previewComponent ? (
                  previewComponent(value)
                ) : (
                  <div
                    className={cn(
                      orientation === "horizontal"
                        ? "text-3xl"
                        : variant === "large"
                        ? "text-6xl"
                        : "text-4xl"
                    )}
                  >
                    {getFileIcon()}
                  </div>
                )}
              </div>
            )}
            <div
              className={cn(
                "flex flex-col gap-2",
                orientation === "horizontal" ? "flex-1 min-w-0" : "items-center"
              )}
            >
              <div
                className={cn(
                  "text-center",
                  orientation === "horizontal" && "text-left"
                )}
              >
                <p className="font-medium text-sm truncate">{value.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(value.size)}
                </p>
              </div>
              <div
                className={cn(
                  "flex gap-2",
                  orientation === "horizontal" && "justify-start"
                )}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                >
                  Change file
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileChange(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Upload
              className={cn(
                "transition-transform shrink-0",
                isDragging && "scale-110",
                variant === "large"
                  ? orientation === "horizontal"
                    ? "w-12 h-12"
                    : "w-16 h-16"
                  : variant === "compact"
                  ? orientation === "horizontal"
                    ? "w-6 h-6"
                    : "w-8 h-8"
                  : orientation === "horizontal"
                  ? "w-8 h-8"
                  : "w-12 h-12"
              )}
            />
            <div
              className={cn(
                "text-center",
                orientation === "horizontal" && "text-left flex-1"
              )}
            >
              <p className="font-medium text-sm">
                {isDragging ? "Drop your file here" : placeholder}
              </p>
              {label && (
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              )}
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-destructive text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
