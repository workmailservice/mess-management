import "server-only";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "business");
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Saves an admin-uploaded image with a generated filename (never the client-supplied name) and returns its public URL. */
export async function saveUploadedImage(file: File, prefix: string): Promise<string> {
  const ext = EXTENSION_BY_TYPE[file.type];
  if (!ext) throw new Error("Only JPEG, PNG, or WebP images are allowed.");
  if (file.size > MAX_SIZE_BYTES) throw new Error("Image must be smaller than 5MB.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${prefix}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/business/${filename}`;
}

export async function deleteUploadedImage(url: string) {
  if (!url.startsWith("/uploads/business/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => {});
}
