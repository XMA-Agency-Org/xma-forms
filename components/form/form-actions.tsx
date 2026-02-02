"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  submitLabel?: string;
  isSubmitting: boolean;
  onReset?: () => void;
}

export function FormActions({
  submitLabel = "Submit",
  isSubmitting,
  onReset,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      {onReset && (
        <Button type="reset" variant="outline" onClick={onReset}>
          Reset
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
