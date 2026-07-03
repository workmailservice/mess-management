"use server";

import { revalidatePath } from "next/cache";
import * as userService from "@/features/users/services/user-service";
import { createUserSchema, updateUserSchema, resetPasswordSchema } from "@/features/users/schemas/user-schema";
import type { CreateUserInput, UpdateUserInput, ResetPasswordInput } from "@/features/users/schemas/user-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getUsersAction() {
  return userService.listUsers();
}

export async function createUserAction(input: CreateUserInput) {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await userService.createUser(parsed.data);
    revalidatePath("/users");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function updateUserAction(id: string, input: UpdateUserInput) {
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await userService.updateUser(id, parsed.data);
    revalidatePath("/users");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function resetUserPasswordAction(id: string, input: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await userService.resetUserPassword(id, parsed.data.password);
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
