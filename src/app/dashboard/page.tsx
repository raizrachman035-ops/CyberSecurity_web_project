"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string[] | string;
  is_system: boolean;
  created_at: string;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "roles" | "news" | "security">("overview");

  // Current session user
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // Data states
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // User search & filter
  const [userSearch, setUserSearch] = useState("");

  // Role form state
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [roleFormLoading, setRoleFormLoading] = useState(false);

  // News form / modal state
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail_path: "/images/soc-center.png",
    status: "published" as "draft" | "published",
  });
  const [newsFormLoading, setNewsFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewNews, setPreviewNews] = useState<NewsItem | null>(null);

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "user" | "role" | "news";
    id: string;
    title: string;
  } | null>(null);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Initial load
  useEffect(() => {
    fetchSession();
    fetchDashboardData();
  }, []);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setCurrentUser(data.user);
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resUsers, resRoles, resNews] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
        fetch("/api/admin/news"),
      ]);

      const [dataUsers, dataRoles, dataNews] = await Promise.all([
        resUsers.json(),
        resRoles.json(),
        resNews.json(),
      ]);

      if (dataUsers.success) setUsers(dataUsers.users);
      if (dataRoles.success) setRoles(dataRoles.roles);
      if (dataNews.success) setNews(dataNews.news);
    } catch (err) {
      showFeedback("error", "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  // User Actions
  const handleToggleUserStatus = async (user: UserItem) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
        showFeedback("success", `Status user ${user.name} berhasil diubah.`);
      } else {
        showFeedback("error", data.error || "Gagal mengubah status.");
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan koneksi.");
    }
  };

  const handleChangeUserRole = async (userId: string, newRoleId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });
      const data = await res.json();
      if (data.success) {
        const roleObj = roles.find((r) => r.id === newRoleId);
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, role_id: newRoleId, role_name: roleObj?.name || "user" } : u
          )
        );
        showFeedback("success", "Role user berhasil diperbarui.");
      } else {
        showFeedback("error", data.error || "Gagal mengubah role.");
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan.");
    }
  };

  // Role Actions
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name) return;
    setRoleFormLoading(true);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roleForm.name,
          description: roleForm.description,
          permissions: ["read", "portal"],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRoles([...roles, data.role]);
        setRoleForm({ name: "", description: "" });
        showFeedback("success", `Role '${data.role.name}' berhasil ditambahkan.`);
      } else {
        showFeedback("error", data.error || "Gagal menambahkan role.");
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan.");
    } finally {
      setRoleFormLoading(false);
    }
  };

  // Image Upload Action
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setNewsForm({ ...newsForm, thumbnail_path: data.path });
        showFeedback("success", "Gambar thumbnail berhasil diunggah.");
      } else {
        showFeedback("error", data.error || "Gagal mengunggah gambar.");
      }
    } catch {
      showFeedback("error", "Gagal mengunggah gambar.");
    } finally {
      setUploadingImage(false);
    }
  };

  // News Actions (Create & Edit)
  const handleOpenNewsModal = (item?: NewsItem) => {
    if (item) {
      setEditingNewsId(item.id);
      setNewsForm({
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        thumbnail_path: item.thumbnail_path,
        status: item.status,
      });
    } else {
      setEditingNewsId(null);
      setNewsForm({
        title: "",
        excerpt: "",
        content: "",
        thumbnail_path: "/images/soc-center.png",
        status: "published",
      });
    }
    setNewsFormLoading(false);
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      showFeedback("error", "Judul dan konten berita wajib diisi.");
      return;
    }

    // Cegah double submit — jika sudah loading, abaikan klik berikutnya
    if (newsFormLoading) return;
    setNewsFormLoading(true);

    try {
      if (editingNewsId) {
        // Update
        const res = await fetch("/api/admin/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingNewsId, ...newsForm }),
        });
        const data = await res.json();
        if (data.success) {
          setNews(news.map((n) => (n.id === editingNewsId ? data.article : n)));
          showFeedback("success", "Artikel berita berhasil diperbarui.");
          setNewsModalOpen(false);
        } else {
          showFeedback("error", data.error || "Gagal memperbarui berita.");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsForm),
        });
        const data = await res.json();
        if (data.success) {
          setNews([data.article, ...news]);
          showFeedback("success", "Artikel berita baru berhasil diterbitkan.");
          setNewsModalOpen(false);
        } else {
          showFeedback("error", data.error || "Gagal membuat berita.");
        }
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan koneksi.");
    } finally {
      setNewsFormLoading(false);
    }
  };

  // Generic Delete Execution
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    try {
      let endpoint = "";
      if (type === "user") endpoint = `/api/admin/users?id=${id}`;
      else if (type === "role") endpoint = `/api/admin/roles?id=${id}`;
      else if (type === "news") endpoint = `/api/admin/news?id=${id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        if (type === "user") setUsers(users.filter((u) => u.id !== id));
        else if (type === "role") setRoles(roles.filter((r) => r.id !== id));
        else if (type === "news") setNews(news.filter((n) => n.id !== id));
        showFeedback("success", "Data berhasil dihapus.");
      } else {
        showFeedback("error", data.error || "Gagal menghapus data.");
      }
    } catch {
      showFeedback("error", "Terjadi kesalahan koneksi.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Password Change Action
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("error", "Konfirmasi password baru tidak cocok.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showFeedback("error", "Password baru minimal 6 karakter.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", "Password berhasil diubah. Harap ingat password baru Anda.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showFeedback("error", data.error || "Gagal mengubah password.");
      }
    } catch {
      showFeedback("error", "Terjadi gangguan koneksi.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-surface-container-low border-b border-outline-variant/30 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-container-high p-1 border border-primary/20">
              <Image
                src={siteConfig.logo.path}
                alt={siteConfig.logo.alt}
                width={32}
                height={32}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="font-headline font-bold text-base text-primary">
              {siteConfig.shortName} <span className="text-secondary text-xs font-telemetry font-normal">// ADMIN CONSOLE</span>
            </span>
          </Link>
          <span className="hidden md:inline-block font-telemetry text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
            SYSTEM ONLINE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container text-xs text-on-surface hover:text-primary transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Lihat Website
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-outline-variant/30 text-xs">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center font-headline text-xs">
              {currentUser?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-primary">{currentUser?.name || "Admin"}</span>
              <span className="text-[10px] text-on-surface-variant font-telemetry uppercase">
                {currentUser?.role || "admin"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant/30 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-headline font-semibold transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Ringkasan Sistem
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-headline font-semibold transition-all whitespace-nowrap ${
              activeTab === "users"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            Manajemen User ({users.length})
          </button>

          <button
            onClick={() => setActiveTab("roles")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-headline font-semibold transition-all whitespace-nowrap ${
              activeTab === "roles"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            Manajemen Role ({roles.length})
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-headline font-semibold transition-all whitespace-nowrap ${
              activeTab === "news"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">feed</span>
            CRUD Berita ({news.length})
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-headline font-semibold transition-all whitespace-nowrap ${
              activeTab === "security"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            Keamanan & Sandi
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* Feedback Banner */}
          {feedbackMsg && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs border animate-in fade-in ${
                feedbackMsg.type === "success"
                  ? "bg-secondary/10 border-secondary/30 text-secondary"
                  : "bg-error/10 border-error/30 text-error"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {feedbackMsg.type === "success" ? "check_circle" : "error"}
              </span>
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-headline text-2xl font-bold text-primary">
                  Ringkasan Sistem & Status Database
                </h2>
                <p className="text-xs text-on-surface-variant font-telemetry mt-1">
                  KONTROL OPERASIONAL TERPADU // OBSERVASI REAL-TIME
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-2">
                  <span className="text-xs text-on-surface-variant font-telemetry">TOTAL USER TERDAFTAR</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline text-3xl font-bold text-primary">{users.length}</span>
                    <span className="text-secondary text-xs">Aktif: {users.filter((u) => u.status === "active").length}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-2">
                  <span className="text-xs text-on-surface-variant font-telemetry">TOTAL ROLE SISTEM</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline text-3xl font-bold text-secondary">{roles.length}</span>
                    <span className="text-on-surface-variant text-xs">Bawaan: 2</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-2">
                  <span className="text-xs text-on-surface-variant font-telemetry">ARTIKEL BERITA / RISET</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline text-3xl font-bold text-primary-container">{news.length}</span>
                    <span className="text-secondary text-xs">Live: {news.filter((n) => n.status === "published").length}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-2">
                  <span className="text-xs text-on-surface-variant font-telemetry">STATUS DATABASE</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline text-lg font-bold text-secondary">
                      {process.env.NEXT_PUBLIC_DB_MODE === "apps-script" ? "Apps Script Live" : "Active & Synced"}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Quick Guide / Security Alert */}
              <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-headline font-bold text-base">
                  <span className="material-symbols-outlined text-[22px]">shield</span>
                  Panduan Pengelolaan & Integrasi Google Spreadsheet
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Semua transaksi user dan berita dikelola secara otomatis. Jika Anda ingin menghubungkan spreadsheet Google Anda sendiri, cukup buka file panduan <code className="bg-surface-container px-2 py-0.5 rounded text-primary">/documentation/SETUP.md</code> dan salin kode <code className="bg-surface-container px-2 py-0.5 rounded text-primary">code.gs</code> dan <code className="bg-surface-container px-2 py-0.5 rounded text-primary">setup.gs</code> ke editor Google Apps Script.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("news")}
                    className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline text-xs font-bold hover:shadow-[0_0_16px_rgba(0,242,254,0.35)] transition-all"
                  >
                    + Buat Berita Baru
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className="px-4 py-2 rounded-lg bg-surface-container text-primary font-headline text-xs font-semibold hover:bg-surface-bright transition-colors"
                  >
                    Ganti Password Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAJEMEN USER */}
          {activeTab === "users" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-primary">Manajemen User & Akun</h2>
                  <p className="text-xs text-on-surface-variant font-telemetry">
                    PENCARIAN, PENGATURAN STATUS, & KELOLA HAK AKSES
                  </p>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari user berdasarkan nama/email..."
                    className="w-full px-3.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-high border-b border-outline-variant/30 font-telemetry text-on-surface-variant uppercase text-[11px]">
                      <tr>
                        <th className="p-4">Nama Lengkap</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role Akses</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Didaftarkan</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                            Tidak ada user yang cocok dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isSelf = currentUser?.id === u.id;
                          return (
                            <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                              <td className="p-4 font-semibold text-primary">
                                {u.name} {isSelf && <span className="text-[10px] text-secondary font-telemetry">(Anda)</span>}
                              </td>
                              <td className="p-4 text-on-surface-variant font-telemetry">{u.email}</td>
                              <td className="p-4">
                                <select
                                  value={u.role_id}
                                  disabled={isSelf}
                                  onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                                  className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container disabled:opacity-50"
                                >
                                  {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-telemetry ${
                                    u.status === "active"
                                      ? "bg-secondary/10 text-secondary border border-secondary/20"
                                      : "bg-error/10 text-error border border-error/20"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      u.status === "active" ? "bg-secondary" : "bg-error"
                                    }`}
                                  />
                                  {u.status === "active" ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>
                              <td className="p-4 text-on-surface-variant text-[11px]">
                                {new Date(u.created_at).toLocaleDateString("id-ID")}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  disabled={isSelf}
                                  onClick={() => handleToggleUserStatus(u)}
                                  className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-bright text-[11px] text-on-surface transition-colors disabled:opacity-30"
                                >
                                  {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                                </button>
                                <button
                                  disabled={isSelf}
                                  onClick={() => setDeleteConfirm({ type: "user", id: u.id, title: u.name })}
                                  className="px-2.5 py-1 rounded bg-error/10 hover:bg-error/20 text-error text-[11px] transition-colors disabled:opacity-30"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAJEMEN ROLE */}
          {activeTab === "roles" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-headline text-2xl font-bold text-primary">Manajemen Role & Hak Akses</h2>
                <p className="text-xs text-on-surface-variant font-telemetry">
                  ROLE BAWAAN SISTEM TERPROTEKSI // ROLE KUSTOM FLEKSIBEL
                </p>
              </div>

              {/* Form Add Role */}
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4">
                <h3 className="font-headline font-bold text-sm text-primary">Tambah Role Baru</h3>
                <form onSubmit={handleAddRole} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-telemetry text-on-surface-variant uppercase">Nama Role</label>
                    <input
                      type="text"
                      required
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                      placeholder="mis. auditor, analyst"
                      className="px-3.5 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-telemetry text-on-surface-variant uppercase">Deskripsi</label>
                    <input
                      type="text"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                      placeholder="Keterangan cakupan role..."
                      className="px-3.5 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={roleFormLoading}
                    className="py-2.5 px-4 rounded-lg bg-primary-container text-on-primary-container font-headline text-xs font-bold hover:shadow-[0_0_16px_rgba(0,242,254,0.35)] disabled:opacity-50 transition-all"
                  >
                    {roleFormLoading ? "Menyimpan..." : "+ Tambah Role"}
                  </button>
                </form>
              </div>

              {/* Roles Table */}
              <div className="rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-high border-b border-outline-variant/30 font-telemetry text-on-surface-variant uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Nama Role</th>
                      <th className="p-4">Deskripsi</th>
                      <th className="p-4">Tipe Role</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {roles.map((r) => (
                      <tr key={r.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="p-4 font-bold text-primary">{r.name}</td>
                        <td className="p-4 text-on-surface-variant">{r.description}</td>
                        <td className="p-4">
                          {r.is_system ? (
                            <span className="font-telemetry text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                              SYSTEM (TIDAK BISA DIHAPUS)
                            </span>
                          ) : (
                            <span className="font-telemetry text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                              KUSTOM
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            disabled={r.is_system}
                            onClick={() => setDeleteConfirm({ type: "role", id: r.id, title: r.name })}
                            className="px-2.5 py-1 rounded bg-error/10 hover:bg-error/20 text-error text-[11px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CRUD BERITA */}
          {activeTab === "news" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-primary">CRUD Berita & Riset Ancaman</h2>
                  <p className="text-xs text-on-surface-variant font-telemetry">
                    PUBLIKASIKAN ARTIKEL BARU // TAMPIL LANGSUNG DI LANDING PAGE
                  </p>
                </div>
                <button
                  onClick={() => handleOpenNewsModal()}
                  className="px-4 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline text-xs font-bold hover:shadow-[0_0_16px_rgba(0,242,254,0.35)] transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Tambah Berita Baru
                </button>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-surface-container-lowest">
                        <Image
                          src={item.thumbnail_path}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="font-telemetry text-[10px] font-bold text-primary bg-surface-container-lowest/90 px-2 py-0.5 rounded border border-primary/30 backdrop-blur-sm">
                            ID: #{item.id}
                          </span>
                          <span
                            className={`font-telemetry text-[10px] px-2 py-0.5 rounded backdrop-blur-sm border ${
                              item.status === "published"
                                ? "bg-secondary-container/80 text-on-secondary-container border-secondary"
                                : "bg-surface-container-highest/80 text-on-surface border-outline"
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-on-surface-variant font-telemetry flex items-center justify-between">
                        <span>Index #{item.id}</span>
                        <span>{new Date(item.created_at).toLocaleDateString("id-ID")} • {item.author_id}</span>
                      </div>

                      <h3 className="font-headline font-bold text-base text-primary line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setPreviewNews(item)}
                        className="text-primary-container hover:underline font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Pratinjau
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenNewsModal(item)}
                          className="p-1.5 rounded hover:bg-surface-container-high text-on-surface hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: "news", id: item.id, title: item.title })}
                          className="p-1.5 rounded hover:bg-error/20 text-error transition-colors"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: KEAMANAN & PASSWORD */}
          {activeTab === "security" && (
            <div className="max-w-xl flex flex-col gap-6">
              <div>
                <h2 className="font-headline text-2xl font-bold text-primary">Pengaturan Keamanan & Password</h2>
                <p className="text-xs text-on-surface-variant font-telemetry">
                  ENKRIPSI BCRYPT // PERBARUI KREDENSIAL SECARA BERKALA
                </p>
              </div>

              {/* Alert reminder */}
              <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] shrink-0">warning</span>
                <p className="leading-relaxed">
                  <strong>Penting:</strong> Akun admin awal menggunakan password bawaan publik (<code className="font-mono font-bold">123456</code>). Segera ubah password Anda dengan kombinasi kuat sebelum mempublikasikan website ke production Vercel.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30">
                <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-telemetry text-on-surface-variant uppercase">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Masukkan password saat ini (mis. 123456)"
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-telemetry text-on-surface-variant uppercase">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-telemetry text-on-surface-variant uppercase">
                      Ulangi Password Baru
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Ketik ulang password baru"
                      className="px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full mt-2 py-3 rounded-lg bg-primary-container text-on-primary-container font-headline text-xs font-bold hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                    {passwordLoading ? "Memperbarui Password..." : "Simpan Password Baru"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: CREATE / EDIT NEWS */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-headline text-lg font-bold text-primary">
                {editingNewsId ? "Edit Artikel Berita" : "Tambah Artikel Berita Baru"}
              </h3>
              <button
                onClick={() => !newsFormLoading && setNewsModalOpen(false)}
                disabled={newsFormLoading}
                className="p-1 rounded text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-telemetry text-on-surface-variant uppercase">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="Judul artikel berita keamanan..."
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-telemetry text-on-surface-variant uppercase">Ringkasan Singkat (Excerpt)</label>
                <input
                  type="text"
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>

              {/* Thumbnail upload & preview */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-telemetry text-on-surface-variant uppercase">Thumbnail Gambar</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shrink-0">
                    <Image
                      src={newsForm.thumbnail_path}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      className="text-xs text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-surface-container-high file:text-primary hover:file:bg-surface-bright cursor-pointer"
                    />
                    <span className="text-[10px] text-on-surface-variant">
                      {uploadingImage ? "Mengunggah gambar..." : "Disimpan di folder lokal public/uploads/ (JPG/PNG/WebP, maks 5MB)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-telemetry text-on-surface-variant uppercase">Isi Konten Berita</label>
                <textarea
                  rows={6}
                  required
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  placeholder="Tuliskan isi artikel lengkap..."
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-telemetry text-on-surface-variant uppercase">Status Publikasi</label>
                <select
                  value={newsForm.status}
                  onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary-container"
                >
                  <option value="published">Published (Tampil di Landing Page)</option>
                  <option value="draft">Draft (Disimpan Sementara)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(false)}
                  disabled={newsFormLoading}
                  className="px-4 py-2 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-bright disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={newsFormLoading || uploadingImage}
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline text-xs font-bold hover:shadow-[0_0_16px_rgba(0,242,254,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {newsFormLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      {editingNewsId ? "Menyimpan..." : "Menerbitkan..."}
                    </>
                  ) : (
                    editingNewsId ? "Simpan Perubahan" : "Terbitkan Berita"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE PREVIEW NEWS */}
      {previewNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant shadow-2xl flex flex-col gap-5">
            <button
              onClick={() => setPreviewNews(null)}
              className="absolute top-5 right-5 p-1 rounded text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <span className="font-telemetry text-xs text-secondary bg-secondary/10 px-2.5 py-0.5 rounded border border-secondary/20 self-start">
              PRATINJAU ARTIKEL
            </span>

            <h3 className="font-headline text-2xl font-bold text-primary">{previewNews.title}</h3>

            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-surface-container-lowest">
              <Image
                src={previewNews.thumbnail_path}
                alt={previewNews.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-xs text-on-surface-variant font-telemetry">
              Index #{previewNews.id} • Penulis: {previewNews.author_id} • Diterbitkan: {new Date(previewNews.created_at).toLocaleDateString("id-ID")}
            </div>

            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
              {previewNews.content}
            </p>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
              <button
                onClick={() => setPreviewNews(null)}
                className="px-4 py-2 rounded-lg bg-surface-container-high text-xs text-primary font-bold hover:bg-surface-bright"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-surface-container rounded-2xl p-6 border border-error/40 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-error font-headline font-bold text-base">
              <span className="material-symbols-outlined text-[22px]">warning</span>
              Konfirmasi Penghapusan
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Apakah Anda yakin ingin menghapus data <strong className="text-primary">{deleteConfirm.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-bright"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-lg bg-error text-white font-headline text-xs font-bold hover:bg-error/80"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

