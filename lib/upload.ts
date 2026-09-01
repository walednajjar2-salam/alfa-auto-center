import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function saveUploadedImage(file: File | null) {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("ارفع ملف صورة فقط");
  if (file.size > 6 * 1024 * 1024) throw new Error("حجم الصورة يجب أن يكون أقل من 6 ميغا");
  const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
