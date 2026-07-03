"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, formatDisplayDate, parseDateOnly, formatDateOnly, todayDateString } from "@/lib/date";

interface DateNavigatorProps {
  date: string;
  onChange: (date: string) => void;
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const [open, setOpen] = useState(false);
  const isToday = date === todayDateString();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onChange(addDays(date, -1))} aria-label="Previous day">
        <ChevronLeft className="size-4" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="outline" />}>
          <CalendarIcon className="size-4" />
          {formatDisplayDate(date)}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parseDateOnly(date)}
            onSelect={(selected) => {
              if (!selected) return;
              onChange(formatDateOnly(selected));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={() => onChange(addDays(date, 1))} aria-label="Next day">
        <ChevronRight className="size-4" />
      </Button>

      {!isToday && (
        <Button variant="ghost" size="sm" onClick={() => onChange(todayDateString())}>
          Today
        </Button>
      )}
    </div>
  );
}
