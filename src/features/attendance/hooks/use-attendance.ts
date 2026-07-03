"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAttendanceForDateAction, setAttendanceAction } from "@/features/attendance/actions";
import type { SetAttendanceInput } from "@/features/attendance/schemas/attendance-schema";

export function useAttendanceForDate(date: string) {
  return useQuery({
    queryKey: ["attendance", date],
    queryFn: () => getAttendanceForDateAction(date),
  });
}

export function useSetAttendance(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetAttendanceInput) => setAttendanceAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      queryClient.invalidateQueries({ queryKey: ["attendance", date] });
    },
  });
}
