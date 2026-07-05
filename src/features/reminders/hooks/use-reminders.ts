"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOutstandingRemindersAction, logReminderSentAction } from "@/features/reminders/actions";
import type { LogReminderInput } from "@/features/reminders/schemas/reminder-schema";

export function useOutstandingReminders() {
  return useQuery({ queryKey: ["reminders"], queryFn: getOutstandingRemindersAction });
}

export function useLogReminderSent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LogReminderInput) => logReminderSentAction(input),
    onSuccess: (result) => {
      if (result.success) queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}
