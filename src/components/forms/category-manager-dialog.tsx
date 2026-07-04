"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  categories: { id: string; name: string }[];
  isPending: boolean;
  onCreate: (name: string) => void;
}

export function CategoryManagerDialog({ open, onOpenChange, title, categories, isPending, onCreate }: CategoryManagerDialogProps) {
  const [name, setName] = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Add new categories here. Existing ones can&apos;t be removed once in use.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button type="button" size="icon" aria-label="Add category" onClick={handleAdd} disabled={isPending || !name.trim()}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          </Button>
        </div>

        <ScrollArea className="h-48 rounded-md border">
          <div className="divide-y">
            {categories.map((category) => (
              <div key={category.id} className="px-3 py-2 text-sm">
                {category.name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
