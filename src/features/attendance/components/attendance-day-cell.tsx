"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AttendanceDayCellProps {
  /** Running total for the month through this day — what's shown when not editing. */
  cumulative: number;
  /** Tiffins added on this specific day — what's edited. */
  rawValue: number;
  disabled: boolean;
  /** Future date — not editable yet. */
  locked: boolean;
  onSave: (value: number) => void;
}

export function AttendanceDayCell({ cumulative, rawValue, disabled, locked, onSave }: AttendanceDayCellProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(rawValue));

  function commit() {
    setEditing(false);
    const parsed = Math.max(0, Math.trunc(Number(value)));
    if (Number.isFinite(parsed) && parsed !== rawValue) onSave(parsed);
  }

  if (editing) {
    return (
      <Input
        type="number"
        min={0}
        autoFocus
        className="h-7 w-16 px-1.5 text-center"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(String(rawValue));
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || locked}
      title={locked ? "Future date — not editable yet" : undefined}
      className={cn(
        "h-7 min-w-10 rounded-md px-2 text-sm tabular-nums disabled:opacity-50",
        locked ? "cursor-not-allowed" : "hover:bg-muted",
        cumulative === 0 && "text-muted-foreground",
      )}
      onClick={() => {
        setValue(String(rawValue));
        setEditing(true);
      }}
    >
      {cumulative}
    </button>
  );
}
