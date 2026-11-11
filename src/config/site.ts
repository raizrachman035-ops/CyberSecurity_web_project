export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  thumbnail: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  field: string;
  tagline: string;
  description: string;
  heroHeadline: string;
  heroSubheadline: string;
  address: {
    label: string;
    detail: string;
    city: string;
    mapUrl: string;
    embedUrl: string;
    coordinates: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    whatsappNumberOnly: string;
    email: string;
    emergencyEmail: string;
    operationalHours: string;
    socHours: string;
  };
  logo: {
    path: string;
    alt: string;
  };
  navLinks: Array<{ label: string; href: string }>;
  services: ServiceItem[];
  news: NewsItem[];
}

export const siteConfig: SiteConfig = {
  name: "PT CyberSecurity Keamanan Indonesia",
  shortName: "CyberSecurity",
  field: "Pengamanan Web & Uji Coba Penetrasi",
  tagline: "Benteng Pertahanan Web & Uji Coba Keamanan Terdepan",
  description:
    "Layanan pengamanan web komprehensif, uji coba penetrasi (penetration testing), dan pemantauan ancaman 24/7 untuk melindungi aplikasi dan infrastruktur digital enterprise.",
  heroHeadline: "Benteng Keamanan Web Terdepan untuk Aplikasi & Infrastruktur Digital Anda",
  heroSubheadline:
    "Perlindungan komprehensif terhadap serangan siber, zero-day exploit, dan kebocoran data dengan mitigasi real-time 24/7 serta pengujian penetrasi mendalam.",
  address: {
    label: "Pusat Operasional SOC & Edukasi Keamanan",
    detail: "Kawasan SMK IDN Boarding School, Jl. Raya Dayeuh, Sukanegara, Jonggol",
    city: "Bogor, Jawa Barat 16830",
    mapUrl: "https://maps.app.goo.gl/gN1nAXrxXvUHnz8q9",
    embedUrl: "https://maps.google.com/maps?q=-6.5252823,107.0381356&hl=id&z=15&output=embed",
    coordinates: "-6.5253° S, 107.0381° E",
  },
  contact: {
    phone: "+62 21 5590 8820",
    whatsapp: "+62 811 9920 7711",
    whatsappNumberOnly: "6281199207711",
    email: "soc@cybersecurity.id",
    emergencyEmail: "emergency@cybersecurity.id",
    operationalHours: "Senin - Jumat (08:30 - 18:00 WIB)",
    socHours: "24 Jam / 7 Hari / 365 Hari Non-Stop",
  },
  logo: {
    path: "/images/logo.png",
    alt: "CyberSecurity Emblem Logo",
  },
  navLinks: [
    { label: "Beranda", href: "#hero" },
    { label: "Tentang Kami", href: "#about" },
    { label: "Layanan", href: "#services" },
    { label: "Berita & Riset", href: "#news" },
    { label: "Kontak", href: "#contact" },
  ],
  services: [
    {
      id: "wapt",
      code: "MOD_01",
      title: "Uji Coba Penetrasi Web (WAPT)",
      description:
        "Identifikasi celah keamanan SQL injection, XSS, SSRF, dan business logic flaws sebelum dieksploitasi peretas dengan simulasi serangan nyata.",
      badge: "OWASP TOP 10 VALIDATED",
      icon: "bug_report",
    },
    {
      id: "waf",
      code: "MOD_02",
      title: "Managed Web Application Firewall (WAF)",
      description:
        "Filter proteksi lalu lintas web cerdas untuk memblokir botnet, serangan DDoS L7, dan injeksi berbahaya secara otomatis tanpa latensi.",
      badge: "AI HEURISTIC FILTERING",
      icon: "security",
    },
    {
      id: "ddos",
      code: "MOD_03",
      title: "Proteksi DDoS & Cloud Defense",
      description:
        "Infrastruktur penangkis lonjakan trafik masif Multi-Tbps dengan scrubbing center terdistribusi demi menjamin uptime 99.99%.",
      badge: "MULTI-TBPS SCRUBBING",
      icon: "cloud_sync",
    },
    {
      id: "compliance",
      code: "MOD_04",
      title: "Audit Kepatuhan & Postur Keamanan",
      description:
        "Asesmen kesiapan sertifikasi ISO 27001, PCI-DSS untuk gateway pembayaran, dan audit kepatuhan regulasi UU Perlindungan Data Pribadi (UU PDP).",
      badge: "GAP ANALYSIS & REMEDIATION",
      icon: "fact_check",
    },
    {
      id: "devsecops",
      code: "MOD_05",
      title: "Code Review & DevSecOps Integration",
      description:
        "Analisis source code statis dan dinamis (SAST/DAST) ke dalam pipeline CI/CD guna memangkas kerentanan sejak tahap pengembangan.",
      badge: "SHIFT-LEFT SECURITY",
      icon: "code_blocks",
    },
    {
      id: "incident",
      code: "MOD_06",
      title: "Respon Insiden & Forensik Digital",
      description:
        "Investigasi forensik cepat pasca-insiden, pemulihan integritas sistem, penelusuran bukti digital, dan mitigasi kebocoran kredensial terkoordinasi.",
      badge: "CSIRT RAPID DEPLOYMENT",
      icon: "emergency_home",
    },
  ],
  news: [
    {
      id: "1",
      slug: "tren-serangan-web-defacement-api-vulnerabilities",
      title: "Tren Serangan Web Defacement dan API Vulnerabilities Terkini",
      excerpt:
        "Kajian mendalam cara mencegah kebocoran API end-point modern akibat broken object level authorization (BOLA) dan miskonfigurasi gateway cloud.",
      content:
        "Dalam lanskap ancaman siber modern, kerentanan API telah menjadi vektor serangan utama. Pengujian penetrasi berkala dan validasi skema input adalah perlindungan lini pertama yang esensial.",
      category: "Analisis Ancaman",
      date: "28 Mei 2025",
      author: "Unit Riset Siber",
      thumbnail: "/images/soc-center.png",
    },
    {
      id: "2",
      slug: "strategi-mengamankan-web-finansial-uu-pdp",
      title: "Strategi Mengamankan Aplikasi Web Menyambut Regulasi PDP",
      excerpt:
        "Langkah wajib tim engineering dalam mengadopsi pseudonymization, enkripsi at-rest, dan protokol pelaporan insiden keamanan 3x24 jam.",
      content:
        "Kepatuhan terhadap UU Perlindungan Data Pribadi mengharuskan setiap platform yang mengelola data sensitif memiliki sistem audit jejak akses dan enkripsi data yang teruji.",
      category: "Panduan Regulasi",
      date: "15 Mei 2025",
      author: "Tim Kepatuhan & Audit",
      thumbnail: "/images/team-collaboration.png",
    },
    {
      id: "3",
      slug: "mengapa-waf-tradisional-tidak-cukup-halau-ai-bots",
      title: "Mengapa WAF Tradisional Tidak Cukup Menghalau Serangan Bot Cerdas",
      excerpt:
        "Eksplorasi taktik bot bertenaga AI yang meniru perilaku navigasi manusia murni dan metode mitigasi berbasis behavioral fingerprinting real-time.",
      content:
        "Bot modern mampu memecahkan CAPTCHA statis dan merotasi IP perumahan. Solusinya adalah penerapan machine learning behavioral analysis di tingkat edge network.",
      category: "Riset Teknologi",
      date: "02 Mei 2025",
      author: "SOC Engineering",
      thumbnail: "/images/soc-center.png",
    },
  ],
};

