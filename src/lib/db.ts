import fs from "fs";
import path from "path";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[] | string;
  is_system: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface LocalDatabase {
  Roles: Role[];
  Users: User[];
  News: NewsArticle[];
}

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "local_db.json");

// Default initial data jika file lokal dibuat pertama kali
const DEFAULT_INITIAL_DATA: LocalDatabase = {
  Roles: [
    {
      id: "role-admin-01",
      name: "admin",
      description: "Administrator sistem dengan hak akses penuh",
      permissions: ["all"],
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user-02",
      name: "user",
      description: "Pengguna standar / klien untuk akses portal",
      permissions: ["read", "profile"],
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-001",
      name: "Super Administrator",
      email: "admin@gmail.com",
      // Bcrypt hash untuk "123456"
      password_hash: "$2a$10$EbtHgYU.q3zSIe5S3i7eTONxT22jeLH0cpPwPoJRMQkKUnIwBXbb6",
      role_id: "role-admin-01",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "1",
      title: "Tren Serangan Web Defacement dan API Vulnerabilities Terkini",
      slug: "tren-serangan-web-defacement-api-vulnerabilities",
      excerpt:
        "Kajian mendalam cara mencegah kebocoran API end-point modern akibat broken object level authorization (BOLA) dan miskonfigurasi gateway cloud.",
      content:
        "Dalam lanskap ancaman siber modern, kerentanan API telah menjadi vektor serangan utama. Pengujian penetrasi berkala (WAPT) dan validasi skema input adalah perlindungan lini pertama yang esensial untuk mencegah pengambilalihan data oleh penyerang asing.",
      thumbnail_path: "/images/soc-center.png",
      status: "published",
      author_id: "Super Administrator",
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Strategi Mengamankan Aplikasi Web Menyambut Regulasi PDP",
      slug: "strategi-mengamankan-web-finansial-uu-pdp",
      excerpt:
        "Langkah wajib tim engineering dalam mengadopsi pseudonymization, enkripsi at-rest, dan protokol pelaporan insiden keamanan 3x24 jam.",
      content:
        "Kepatuhan terhadap UU Perlindungan Data Pribadi (UU PDP No. 27/2022) mengharuskan setiap platform yang mengelola data sensitif memiliki sistem audit jejak akses, enkripsi data at-rest dan in-transit, serta disaster recovery yang teruji.",
      thumbnail_path: "/images/team-collaboration.png",
      status: "published",
      author_id: "Super Administrator",
      created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Mengapa WAF Tradisional Tidak Cukup Menghalau Serangan Bot Cerdas",
      slug: "mengapa-waf-tradisional-tidak-cukup-halau-ai-bots",
      excerpt:
        "Eksplorasi taktik bot bertenaga AI yang meniru perilaku navigasi manusia murni dan metode mitigasi berbasis behavioral fingerprinting real-time.",
      content:
        "Bot modern mampu memecahkan CAPTCHA statis dan merotasi IP secara dinamis. Solusi yang kami terapkan adalah machine learning heuristic filtering langsung di edge cloud untuk menganalisis anomali pola klik dan headers secara instan.",
      thumbnail_path: "/images/soc-center.png",
      status: "published",
      author_id: "Super Administrator",
      created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

function readLocalDb(): LocalDatabase {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(DEFAULT_INITIAL_DATA, null, 2));
      return DEFAULT_INITIAL_DATA;
    }
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(raw) as LocalDatabase;
  } catch (err) {
    console.error("Gagal membaca local DB:", err);
    return DEFAULT_INITIAL_DATA;
  }
}

function writeLocalDb(data: LocalDatabase): void {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Gagal menulis ke local DB:", err);
  }
}

/**
 * Panggil Apps Script jika URL & Secret tersedia, jika tidak gunakan local database
 */
async function callAppsScript(payload: any): Promise<any> {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;

  if (!url || !secret || url.includes("your-deployment-id")) {
    return null; // Fallback ke local database
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret }),
      cache: "no-store",
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn("Apps Script call error, falling back to local DB:", err);
    return null;
  }
}

/**
 * Query data dari tabel
 */
export async function queryTable<T>(
  table: keyof LocalDatabase,
  filter?: { key: string; value: any }
): Promise<T[]> {
  const remote = await callAppsScript({
    action: "query",
    table,
    filter,
  });

  if (remote && remote.success && Array.isArray(remote.data)) {
    return remote.data as T[];
  }

  // Fallback Local
  const db = readLocalDb();
  let rows = (db[table] || []) as any[];

  if (filter) {
    rows = rows.filter(
      (r) => String(r[filter.key]).toLowerCase() === String(filter.value).toLowerCase()
    );
  }

  return rows as T[];
}

/**
 * Insert record baru ke tabel
 */
export async function insertRecord<T>(
  table: keyof LocalDatabase,
  record: any
): Promise<T> {
  const remote = await callAppsScript({
    action: "insert",
    table,
    data: record,
  });

  if (remote && remote.success && remote.data) {
    return remote.data as T;
  }

  // Fallback Local
  const db = readLocalDb();
  const now = new Date().toISOString();

  let assignedId = record.id;
  if (!assignedId) {
    if (table === "News") {
      const list = (db.News || []);
      const maxId = list.reduce((max, item) => {
        const num = parseInt(String(item.id), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 0);
      assignedId = String(maxId + 1);
    } else {
      assignedId = `${table.toLowerCase()}-${Date.now().toString(36)}`;
    }
  }

  const newRow = {
    ...record,
    id: assignedId,
    created_at: record.created_at || now,
    updated_at: record.updated_at || now,
  };

  if (!db[table]) {
    db[table] = [] as any;
  }
  (db[table] as any[]).unshift(newRow);
  writeLocalDb(db);

  return newRow as T;
}

/**
 * Update record berdasarkan ID
 */
export async function updateRecord<T>(
  table: keyof LocalDatabase,
  id: string,
  updateData: any
): Promise<T | null> {
  const remote = await callAppsScript({
    action: "update",
    table,
    id,
    data: updateData,
  });

  if (remote && remote.success && remote.data) {
    return remote.data as T;
  }

  // Fallback Local
  const db = readLocalDb();
  const list = (db[table] || []) as any[];
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updateData,
    updated_at: new Date().toISOString(),
  };

  writeLocalDb(db);
  return list[index] as T;
}

/**
 * Delete record berdasarkan ID
 */
export async function deleteRecord(
  table: keyof LocalDatabase,
  id: string
): Promise<boolean> {
  const remote = await callAppsScript({
    action: "delete",
    table,
    id,
  });

  if (remote && remote.success) {
    return true;
  }

  // Fallback Local
  const db = readLocalDb();
  const list = (db[table] || []) as any[];
  const item = list.find((r) => r.id === id);

  if (!item) return false;
  if (item.is_system) {
    throw new Error("Data sistem bawaan tidak boleh dihapus.");
  }

  db[table] = list.filter((r) => r.id !== id) as any;
  writeLocalDb(db);
  return true;
}

