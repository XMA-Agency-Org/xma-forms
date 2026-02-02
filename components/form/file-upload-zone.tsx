"use client";

import { useState, useCallback, useRef } from "react";
import { useFormContext, Controller, get } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FileUploadZoneProps {
  name: string;
  label: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  description?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function isAcceptedType(file: File, accept?: string): boolean {
  if (!accept) return true;
  const acceptedTypes = accept.split(",").map((t) => t.trim());
  return acceptedTypes.some((type) => {
    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.replace("/*", "/"));
    }
    return file.type === type;
  });
}

export function FileUploadZone({
  name,
  label,
  required,
  accept,
  maxSizeMB = 10,
  multiple = false,
  description,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  const fieldError = get(errors, name);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const validFiles: File[] = [];
      for (const file of files) {
        if (!isAcceptedType(file, accept)) {
          setError(name, {
            type: "manual",
            message: `"${file.name}" is not an accepted file type`,
          });
          return validFiles;
        }
        if (file.size > maxSizeBytes) {
          setError(name, {
            type: "manual",
            message: `"${file.name}" exceeds the ${maxSizeMB}MB size limit`,
          });
          return validFiles;
        }
        validFiles.push(file);
      }
      clearErrors(name);
      return validFiles;
    },
    [accept, maxSizeBytes, maxSizeMB, name, setError, clearErrors]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    []
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: `${label} is required` } : undefined}
      render={({ field: { onChange, value } }) => {
        const files: File[] = multiple
          ? (value ?? [])
          : value instanceof File
            ? [value]
            : [];

        const processFiles = (incoming: File[]) => {
          const validated = validateFiles(incoming);
          if (validated.length === 0) return;
          if (multiple) {
            onChange([...files, ...validated]);
          } else {
            onChange(validated[0]);
          }
        };

        const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(false);
          const droppedFiles = Array.from(event.dataTransfer.files);
          processFiles(droppedFiles);
        };

        const handleInputChange = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const selectedFiles = Array.from(event.target.files ?? []);
          processFiles(selectedFiles);
          if (inputRef.current) inputRef.current.value = "";
        };

        const removeFile = (index: number) => {
          if (multiple) {
            const updated = files.filter((_, i) => i !== index);
            onChange(updated.length > 0 ? updated : undefined);
          } else {
            onChange(undefined);
          }
        };

        return (
          <div className="space-y-1.5">
            <Label htmlFor={name} required={required}>
              {label}
            </Label>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <div
              role="button"
              tabIndex={0}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className={cn(
                "border-2 border-dashed border-input-border rounded-[var(--radius-lg)] p-6 cursor-pointer transition-colors text-center",
                isDragging && "border-primary-500 bg-primary-50",
                fieldError && "border-error-500"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleInputChange}
                className="hidden"
                id={name}
              />
              {files.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="size-8" />
                  <p className="text-sm">
                    Drag & drop or click to select{" "}
                    {multiple ? "files" : "a file"}
                  </p>
                  <p className="text-xs">
                    Max size: {maxSizeMB}MB
                    {accept && ` | Accepted: ${accept}`}
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-2"
                  onClick={(e) => e.stopPropagation()}
                  role="list"
                >
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-2"
                      role="listitem"
                    >
                      {isImageFile(file) && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="size-10 rounded-[var(--radius-sm)] object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {fieldError && (
              <p className="text-sm text-error-500 mt-1">
                {fieldError.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
