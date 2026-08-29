#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""AI Design Studio cron tick — generate concepts for ORD-C378E12A (Bagiak) and PUT to server."""
import json, urllib.request, os

ORDER_ID = "ORD-C378E12A"
BASE = "http://localhost:7000/api/orders"
OUT_DIR = r"D:/Hermes Agent/AI Design Studio/assets/orders"
os.makedirs(OUT_DIR, exist_ok=True)

# ---- THINK / STRATEGIZE: ANALISIS ----
analysis = (
    "Brand \"Bagiak\" — kategori makanan, target 20-35, gaya playful, identitas warna merah + cream. "
    "Klien: TYO (order internal/studio).\n\n"
    "MASALAH KLIEN: Kategori makanan itu SANGAT sesak — di feed sosmed maupun di shelf. "
    "Sekadar \"logo merah\" nggak cukup buat stand out; brand ini butuh KEPRIBADIAN yang langsung kerasa playful tapi tetap rapi.\n\n"
    "AUDIENS: 20-35 (Gen Z + millennial), urban, peduli vibe & visual, suka konten yang \"shareable\". "
    "Mereka nggak cuma beli rasa, tapi beli kesan/feel.\n\n"
    "POSISI BRAND: Playful + hangat. Merah = energi & rangsang apetit; cream = ramah & soft (ngurangin agresivitas merah). "
    "Kombinasi ini kuat buat makanan kekinian yang mau dekat sama anak muda.\n\n"
    "ARAH DESAIN: Mainin bentuk main-main + palette merah/cream, TAPI tetap punya struktur biar nggak childish. "
    "Tiga pendekatan di bawah sengaja beda-beda (typography-first, character-first, system-first) biar Tyo bisa pilih arah, bukan cuma variasi warna.\n\n"
    "BRIEF LEMAH: Objective cuma \"menarik + merah cream\", reference kosong, nggak ada detail produk "
    "(makanan apa? jajanan / resto / UMKM kemasan?). Nama \"Bagiak\" juga bisa bermakna \"bagi\" (share) — potensi positioning bagus yang belum dimanfaatin. "
    "SARAN SEBELUM PRODUKSI VISUAL: Tyo perlu klarifikasi 3 hal — "
    "(1) jenis makanan & format aplikasi (jajanan, resto, atau kemasan UMKM?), "
    "(2) mau beda dari kompetitor atau ikut arus playful, "
    "(3) ada short-name/panggilan? (mis. \"Bagi\" atau \"BK\")."
)

# ---- STRATEGIZE: 3 KONSEP BERBEDA ----
concepts = [
    {
        "name": "Bagiak Lettered",
        "core": "Wordmark playful custom — \"Bagiak\" jadi hero. Huruf rounded-bold dengan satu detail makanan tersembunyi (mis. ekor 'g' melengkung jadi sendok/daun, atau dot 'i' jadi biji). Logo = nama, kuat di feed.",
        "visual": "Logotype lowercase/hybrid, rounded slab. Icon kecil opsional (sendok-garpu atau daun) di samping sebagai secondary mark.",
        "color": "Merah utama (#E63946) + Cream (#FFF3E0) sebagai background/secondary. Tanpa aksen ketiga biar clean.",
        "typography": "Rounded bold sans (Fredoka/Quicksand-like) — playful tapi rapi, tight tracking.",
        "mood": "Ramah, enerjik, percaya diri, nggak norak.",
        "layout": "Horizontal lockup; wordmark sebagai hero, icon kecil secondary di kiri/kanan.",
        "reasoning": "Di kategori makanan, wordmark kuat = gampang diingat & di feed. Playful tapi tetap elegan. Paling aman buat Basic package.",
        "strengths": "Clean, scalable, mudah di merch & app icon, cepat dikenali, murah produksi.",
        "weaknesses": "Kalau cuma wordmark bisa mirip kompetitor; butuh eksekusi letterform yang unik biar beda."
    },
    {
        "name": "Maskot Bagiak",
        "core": "Karakter/maskot makanan yang lucu & ngajak share — personifikasi \"Bagiak\". Bisa sebungkus/semangkok makanan dengan muka ramah, atau karakter \"bagi=share\" yang pegang sendok. Emotional connection langsung.",
        "visual": "Maskot rounded di dalam badge bulat, wordmark di bawah. Ekspresi playful, pose ngajak makan bareng.",
        "color": "Merah dominan + cream, plus 1 pop ceria opsional (mustard #F4A261) buat aksen bahagia.",
        "typography": "Rounded friendly (Baloo/Nunito-like) — mengundang.",
        "mood": "Fun, sosial, mengundang — vibe \"ajak makan bareng\".",
        "layout": "Icon/maskot di atas, wordmark di bawah (atau lockup kiri-kanan).",
        "reasoning": "Maskot kuat di emotional connection & merch (sticker, plush, packaging). Cocok target 20-35 yang suka share & koleksi.",
        "strengths": "Catchy, memorable, Instagrammable, kuat di merchandise & sticker.",
        "weaknesses": "Bisa kelihatan 'anak-anak'/less premium kalau eksekusi kurang rapi; maskot susah di favicon kecil (butuh simplified mark)."
    },
    {
        "name": "Bagiak Badge",
        "core": "Identitas sistem — badge/segel bulat + wordmark + pattern merah-cream. Terasa 'brand lengkap' meski cuma Basic. Differensiasi: banyak logo food cuma wordmark/maskot; badge kasih kesan established.",
        "visual": "Seal/badge (lingkaran merah, garis tepi cream), di dalam ada icon makanan simpel + wordmark. Plus pattern dot/strip merah-cream buat aplikasi kemasan.",
        "color": "Merah + Cream, dengan variasi tint (merah muda/maroon) biar ada depth tanpa nambah warna.",
        "typography": "Bold grotesk/rounded dipadukan — wordmark dalam badge, sans sekunder untuk sekunder.",
        "mood": "Kekinian, terstruktur, trustworthy tapi tetap playful.",
        "layout": "Badge lockup (icon + wordmark dalam lingkaran), plus pattern sebagai elemen pendukung kemasan.",
        "reasoning": "Badge fleksibel buat packaging/signage & terasa 'lengkap'. Cocok kalau Bagiak mau naik ke kemasan UMKM nanti.",
        "strengths": "Fleksibel, berkesan 'lengkap', cocok kemasan & store signage, scalable.",
        "weaknesses": "Badge bisa berat di ukuran sangat kecil; butuh simplified version untuk favicon/app icon."
    }
]

# ---- CREATE: QC AWAL ----
qc = (
    "QC AWAL (sebelum produksi visual):\n\n"
    "KONTEN\n"
    "- Ejaan \"Bagiak\" konsisten di semua lockup & varian\n"
    "- Tidak ada claim menyesatkan / kata terlarang (cth. 'terbaik', 'no.1' tanpa bukti)\n"
    "- Tagline (jika ada) selaras brief playful + makanan\n\n"
    "VISUAL\n"
    "- Hierarchy jelas: icon/maskot vs wordmark tidak saling mendominasi\n"
    "- Alignment & spacing konsisten (grid)\n"
    "- Terbaca di ukuran kecil (favicon / app icon 32px)\n"
    "- Kontras cukup: merah di cream, cek WCAG (target ratio >= 3:1 untuk elemen besar)\n"
    "- Komposisi seimbang, tidak clutter\n\n"
    "TEKNIS\n"
    "- Vektor murni (AI/SVG) — scalable tanpa lost quality\n"
    "- Palette merah + cream (+ maks 1 aksen bila perlu)\n"
    "- Clear space / safe area didefinisikan\n"
    "- Export: SVG + PNG transparan (16/32/128/512) + PDF\n"
    "- Cek contrast ratio (WCAG) untuk aksesibilitas"
)

# ---- Tulis file markdown buat Tyo ----
md = f"""# ORD-C378E12A — BAGIAK (Logo / Basic)

**Status:** CONCEPT (menunggu Tyo produksi visual di Illustrator)
**Client:** TYO  |  **Service:** Logo  |  **Package:** Basic  |  **Price:** Rp650.000
**Payment:** PAID  |  **Style:** Playful  |  **Business:** Makanan  |  **Target:** 20-35
**Warna identitas:** Merah + Cream  |  **Reference:** (kosong)

---

## ANALISIS (THINK)

{analysis}

---

## 3 KONSEP (STRATEGIZE)

### 1. {concepts[0]['name']}
- **Core:** {concepts[0]['core']}
- **Visual:** {concepts[0]['visual']}
- **Warna:** {concepts[0]['color']}
- **Tipografi:** {concepts[0]['typography']}
- **Mood:** {concepts[0]['mood']}
- **Layout:** {concepts[0]['layout']}
- **Reasoning:** {concepts[0]['reasoning']}
- **Strengths:** {concepts[0]['strengths']}
- **Weaknesses:** {concepts[0]['weaknesses']}

### 2. {concepts[1]['name']}
- **Core:** {concepts[1]['core']}
- **Visual:** {concepts[1]['visual']}
- **Warna:** {concepts[1]['color']}
- **Tipografi:** {concepts[1]['typography']}
- **Mood:** {concepts[1]['mood']}
- **Layout:** {concepts[1]['layout']}
- **Reasoning:** {concepts[1]['reasoning']}
- **Strengths:** {concepts[1]['strengths']}
- **Weaknesses:** {concepts[1]['weaknesses']}

### 3. {concepts[2]['name']}
- **Core:** {concepts[2]['core']}
- **Visual:** {concepts[2]['visual']}
- **Warna:** {concepts[2]['color']}
- **Tipografi:** {concepts[2]['typography']}
- **Mood:** {concepts[2]['mood']}
- **Layout:** {concepts[2]['layout']}
- **Reasoning:** {concepts[2]['reasoning']}
- **Strengths:** {concepts[2]['strengths']}
- **Weaknesses:** {concepts[2]['weaknesses']}

---

## QC AWAL

{qc}

---

_Dibuat otomatis oleh Hermes Agent (AI Design Studio) — {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}._
_Tunggu approval Tyo sebelum produksi visual (mockup gambar tidak digenerate otomatis)._
"""

md_path = os.path.join(OUT_DIR, f"{ORDER_ID}_concepts.md")
with open(md_path, "w", encoding="utf-8") as f:
    f.write(md)
print("MD written:", md_path)

# ---- PUT ke server ----
payload = {
    "status": "CONCEPT",
    "hermes": "COMPLETED",
    "progress": 40,
    "concepts": concepts,
    "analysis": analysis,
    "qc": qc,
    "_by": "hermes"
}
data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
req = urllib.request.Request(
    f"{BASE}/{ORDER_ID}",
    data=data,
    headers={"Content-Type": "application/json"},
    method="PUT"
)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        print("PUT status:", resp.status)
        print("PUT response:", body[:500])
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.read().decode("utf-8")[:500])
except Exception as e:
    print("PUT failed:", repr(e))
