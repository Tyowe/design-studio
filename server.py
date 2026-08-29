"""
AI Design Studio — Local Order Bridge Server
=============================================
Gudang bersama (shared store) yang menghubungkan:
  - Landing page (klien)  -> POST /api/orders
  - Dashboard (Tyo)       -> GET /api/orders
  - Hermes Agent (cron)   -> GET /api/orders?status=NEW, PUT /api/orders/<id>

Data disimpan sebagai JSON di folder assets/orders/ (1 file per order).
Jalan di localhost, tidak perlu internet.

Cara jalan:
  cd "D:/Hermes Agent/AI Design Studio"
  python server.py
  -> http://localhost:7000
"""

import json
import os
import re
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
ORDERS_DIR = os.path.join(HERE, "assets", "orders")
PORT = 7000

# Mapping nama service dari landing page -> nama di dashboard (spy konsisten)
SERVICE_MAP = {
    "Desain Logo": "Logo",
    "Desain Kemasan": "Packaging",
    "Desain Poster": "Poster",
    "Social Media Design": "Social Media",
    "3D Mockup": "3D Mockup",
    "Custom Design": "Custom",
}

# Status pipeline (lokal, krn Hermes AI bantu sampai konsep, Tyo yg produksi)
STATUS_FLOW = [
    "NEW",            # order masuk, belum bayar
    "PAID",           # DP 50% lunas
    "BRIEF REVIEW",   # Hermes baca & analisis brief
    "CONCEPT",        # Hermes usulin 3 konsep + mockup
    "AWAITING_CLIENT",# tunggu Tyo produksi visual final
    "PRODUCTION",     # Tyo kerjakan di Illustrator
    "QC",             # Hermes QC checklist
    "CLIENT REVIEW",  # kirim ke klien
    "REVISION",       # revisi
    "DELIVERED",      # selesai
]


def ensure_dir():
    os.makedirs(ORDERS_DIR, exist_ok=True)


def slugify(text):
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "order"


def all_orders():
    ensure_dir()
    orders = []
    for fn in os.listdir(ORDERS_DIR):
        # skip helper files (payloads, partials) — only real orders
        if not fn.endswith(".json") or fn.endswith("_payload.json"):
            continue
        try:
            with open(os.path.join(ORDERS_DIR, fn), "r", encoding="utf-8") as f:
                o = json.load(f)
            # hanya order yang punya code & id valid
            if not o.get("code") or not o.get("id"):
                continue
            orders.append(o)
        except Exception:
            pass
    # urutkan terbaru dulu
    orders.sort(key=lambda o: o.get("created_at", ""), reverse=True)
    return orders


def get_order(order_id):
    path = os.path.join(ORDERS_DIR, f"{order_id}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def save_order(order):
    ensure_dir()
    path = os.path.join(ORDERS_DIR, f"{order['id']}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(order, f, indent=2, ensure_ascii=False)


def next_code():
    # ADS-2026-XXXX (lanjut dari nomor terbesar)
    year = time.strftime("%Y")
    nums = []
    for o in all_orders():
        m = re.match(rf"ADS-{year}-(\d+)", o.get("code", ""))
        if m:
            nums.append(int(m.group(1)))
    n = (max(nums) + 1) if nums else 1
    return f"ADS-{year}-{n:04d}"


def make_order_id():
    return "ORD-" + uuid.uuid4().hex[:8].upper()


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, payload, extra_headers=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        if extra_headers:
            for k, v in extra_headers.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        # log singkat ke console
        print(f"[{time.strftime('%H:%M:%S')}] {fmt % args}")

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        if parsed.path == "/api/orders":
            orders = all_orders()
            status = qs.get("status", [None])[0]
            if status:
                orders = [o for o in orders if o.get("status") == status]
            # spy dashboard bisa tau berapa belum diproses Hermes
            pending = [o for o in all_orders()
                       if o.get("status") in ("NEW", "PAID", "BRIEF REVIEW")]
            self._send(200, {"orders": orders, "pending_count": len(pending)})
        elif parsed.path == "/api/health":
            self._send(200, {"ok": True, "orders": len(all_orders())})
        elif parsed.path == "/":
            self._send(200, {"service": "AI Design Studio Order Bridge",
                             "docs": "POST /api/orders, GET /api/orders, PUT /api/orders/<id>"})
        else:
            self._send(404, {"error": "not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/orders":
            self._send(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw.decode("utf-8") or "{}")
        except Exception as e:
            self._send(400, {"error": f"bad json: {e}"})
            return

        svc = SERVICE_MAP.get(data.get("service"), data.get("service", "Custom"))
        code = next_code()
        oid = make_order_id()
        now = time.strftime("%Y-%m-%dT%H:%M:%S")

        order = {
            "id": oid,
            "code": code,
            "client": data.get("name") or data.get("client") or "Unknown",
            "phone": data.get("phone", ""),
            "email": data.get("email", ""),
            "brand": data.get("brand") or data.get("client") or "",
            "service": svc,
            "package": data.get("package", "Professional"),
            "price": int(data.get("price", 0) or 0),
            "payment": "PAID" if data.get("paid") else "UNPAID",
            "status": "PAID" if data.get("paid") else "NEW",
            "hermes": "WAITING",
            "progress": 100 if data.get("paid") else 0,
            "objective": data.get("brief", ""),
            "style": data.get("style", ""),
            "business": data.get("business", ""),
            "target": data.get("target", ""),
            "reference": data.get("reference", ""),
            "created_at": now,
            "updated_at": now,
            "log": [{"at": now, "by": "system", "msg": "Order dibuat dari landing page"}],
        }
        save_order(order)
        self._send(201, {"ok": True, "order": order})

    def do_PUT(self):
        parsed = urlparse(self.path)
        m = re.match(r"^/api/orders/([\w-]+)$", parsed.path)
        if not m:
            self._send(404, {"error": "not found"})
            return
        oid = m.group(1)
        order = get_order(oid)
        if not order:
            self._send(404, {"error": "order not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw.decode("utf-8") or "{}")
        except Exception as e:
            self._send(400, {"error": f"bad json: {e}"})
            return

        # field yang boleh diupdate (oleh dashboard atau Hermes)
        allowed = ["status", "hermes", "progress", "payment", "price",
                   "concepts", "mockups", "analysis", "qc", "log", "notes"]
        now = time.strftime("%Y-%m-%dT%H:%M:%S")
        for k, v in data.items():
            if k in allowed:
                order[k] = v
        # log entry
        if "log" not in data and ("status" in data or "hermes" in data):
            order.setdefault("log", []).append({
                "at": now, "by": data.get("_by", "api"),
                "msg": f"update {', '.join([x for x in ('status','hermes','progress') if x in data])}"
            })
        order["updated_at"] = now
        save_order(order)
        self._send(200, {"ok": True, "order": order})


def main():
    ensure_dir()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"AI Design Studio Order Bridge jalan di http://localhost:{PORT}")
    print(f"Orders disimpan di: {ORDERS_DIR}")
    print("Tekan Ctrl+C untuk berhenti.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dihentikan.")


if __name__ == "__main__":
    main()
