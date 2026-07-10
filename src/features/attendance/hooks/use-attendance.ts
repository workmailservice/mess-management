"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAttendanceForMonthAction, setAttendanceAction } from "@/features/attendance/actions";
import type { SetAttendanceInput } from "@/features/attendance/schemas/attendance-schema";

export function useAttendanceForMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["attendance", year, month],
    queryFn: () => getAttendanceForMonthAction(year, month),
  });
}

export function useSetAttendance(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SetAttendanceInput) => setAttendanceAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      queryClient.invalidateQueries({ queryKey: ["attendance", year, month] });
    },
  });
}
