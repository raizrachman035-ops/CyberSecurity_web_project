import fs from "fs";
import path from "path";

export interface StorageResult {
  success: boolean;
  path?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan folder uploads tersedia
function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Menyimpan file media ke folder lokal public/uploads/
 * Di Step 4, fungsi ini dapat dialihkan ke penyedia Cloud (Vercel Blob, Cloudinary, dll.)
 */
export async function saveFile(
  file: File | { name: string; type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<StorageResult> {
  try {
    if (!file) {
      return { success: false, error: "Tidak ada file yang diunggah." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap unggah gambar JPG, PNG, atau WebP.",
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "Ukuran gambar terlalu besar. Maksimal 5MB.",
      };
    }

    ensureUploadDir();

    const rawExt = path.extname(file.name).toLowerCase() || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(rawExt) ? rawExt : ".png";
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 9);
    const fileName = `media_${timestamp}_${randomHex}${safeExt}`;
    const destinationPath = path.join(UPLOAD_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(destinationPath, buffer);

    return {
      success: true,
      path: `/uploads/${fileName}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Gagal menyimpan file: ${err.message || String(err)}`,
    };
  }
}

/**
 * Menghapus file media dari folder lokal public/uploads/
 */
export async function deleteFile(publicPath: string): Promise<boolean> {
  try {
    if (!publicPath || !publicPath.startsWith("/uploads/")) {
      return false;
    }

    const fileName = path.basename(publicPath);
    const fullPath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Gagal menghapus file:", err);
    return false;
  }
}

