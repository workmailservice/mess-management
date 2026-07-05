"use server";

import * as reminderService from "@/features/reminders/services/reminder-service";
import { logReminderSchema } from "@/features/reminders/schemas/reminder-schema";
import type { LogReminderInput } from "@/features/reminders/schemas/reminder-schema";

export async function getOutstandingRemindersAction() {
  return reminderService.listOutstanding();
}

export async function logReminderSentAction(input: LogReminderInput) {
  const parsed = logReminderSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await reminderService.logReminderSent(parsed.data);
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}
