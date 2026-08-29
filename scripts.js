/* ===================================================
   AI DESIGN STUDIO — Scripts
   Order system: service -> package -> addon -> checkout -> payment
   =================================================== */

// ===== WHATSAPP CONFIG (opsional, untuk notifikasi) =====
// GANTI dengan nomor studio tanpa "+" atau "0" di depan.
const WHATSAPP_NUMBER = "6281234567890";

// ===== CATALOG (6 layanan, masing-masing 3 paket) =====
const catalog = {
  "Desain Logo": [
    ["Basic", 350000, "1 konsep • 2 revisi • PNG/JPG"],
    ["Professional", 650000, "2 konsep • 3 revisi • vector file"],
    ["Premium", 1000000, "3 konsep • mini brand guide • source file"]
  ],
  "Desain Kemasan": [
    ["Basic", 750000, "1 desain • 2 revisi • preview"],
    ["Professional", 1200000, "2 konsep • 3 revisi • mockup"],
    ["Premium", 1800000, "2 konsep • mockup • print-ready file"]
  ],
  "Desain Poster": [
    ["Basic", 150000, "1 desain • 1 revisi"],
    ["Professional", 300000, "2 desain • 2 revisi"],
    ["Campaign", 550000, "3 desain • campaign set"]
  ],
  "Social Media Design": [
    ["Basic", 100000, "1 design"],
    ["Content Pack", 450000, "5 design"],
    ["Monthly Pack", 900000, "12 design"]
  ],
  "3D Mockup": [
    ["Basic", 250000, "1 visual"],
    ["Professional", 450000, "2 angle"],
    ["Premium", 700000, "3 visual high resolution"]
  ],
  "Custom Design": [
    ["Consultation", 250000, "konsultasi + scope project"],
    ["Standard", 500000, "custom design project"],
    ["Custom", 1000000, "starting price"]
  ]
};

const serviceMeta = {
  "Desain Logo": ["01 / BRANDING", "✦", "Logo profesional yang merepresentasikan karakter dan positioning brand.", ["Logo utama & alternatif", "3 konsep awal", "Revisi unlimited", "File PNG, SVG, AI"]],
  "Desain Kemasan": ["02 / PACKAGING", "▣", "Desain kemasan yang menarik di rak, marketplace, maupun media promosi.", ["Box / pouch / label", "Layout informasi produk", "Spesifikasi cetak ready", "File siap cetak"]],
  "Desain Poster": ["03 / PROMOTION", "◈", "Poster promosi untuk produk, event, campaign, marketplace, dan sosial media.", ["Poster digital", "Promotional ads", "Feed / Story / Banner", "High resolution"]],
  "Social Media Design": ["04 / CONTENT", "◎", "Konten visual yang konsisten untuk Instagram, TikTok, Facebook, dan marketplace.", ["Feed & carousel", "Story", "Promo produk", "Template konten"]],
  "3D Mockup": ["05 / VISUAL", "◇", "Visualisasi produk yang realistis untuk presentasi, katalog, atau promosi.", ["Packaging mockup", "Product visualization", "Realistic lighting", "High resolution"]],
  "Custom Design": ["06 / CUSTOM", "＋", "Punya kebutuhan desain lain? Ceritakan project-mu dan kami bantu tentukan solusinya.", ["Menu / katalog", "Banner & brosur", "Stationery", "Custom request"]]
};

let currentService = "";
let currentPackageIndex = 0;
let currentOrderId = "";

const rupiah = (n) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(n).replace("IDR", "Rp");

function renderServices() {
  const grid = document.getElementById("serviceGrid");
  grid.innerHTML = "";
  Object.keys(catalog).forEach(service => {
    const [num, icon, desc, bullets] = serviceMeta[service];
    const card = document.createElement("article");
    card.className = "service-card";
    const bulletHtml = (bullets || []).map(b => `<li>${b}</li>`).join("");
    card.innerHTML = `
      <div class="service-num">${num}</div>
      <div class="service-icon">${icon}</div>
      <h3>${service}</h3>
      <p>${desc}</p>
      <ul>
        ${bulletHtml}
      </ul>
      <div class="service-price">Mulai ${rupiah(catalog[service][0][1])} <small>/ project</small></div>
      <button class="btn btn-primary" onclick="openOrder('${service}')">Pilih Paket →</button>
    `;
    grid.appendChild(card);
  });
}

function openOrder(service) {
  currentService = service;
  currentPackageIndex = 0;
  document.getElementById("selectedService").textContent = service;
  document.getElementById("overlay").classList.add("show");
  document.body.style.overflow = "hidden";

  document.getElementById("orderScreen").style.display = "block";
  document.getElementById("paymentScreen").classList.remove("show");
  document.getElementById("successScreen").classList.remove("show");

  document.querySelectorAll(".addon input").forEach(x => x.checked = false);

  renderPackages();
  updateSummary();
}

function closeOrder() {
  document.getElementById("overlay").classList.remove("show");
  document.body.style.overflow = "";
}

function renderPackages() {
  const grid = document.getElementById("packageGrid");
  grid.innerHTML = "";
  catalog[currentService].forEach((pkg, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "package" + (index === currentPackageIndex ? " selected" : "");
    button.innerHTML = `
      <b>${pkg[0]}</b>
      <strong>${rupiah(pkg[1])}</strong>
      <small>${pkg[2]}</small>
    `;
    button.onclick = () => {
      currentPackageIndex = index;
      renderPackages();
      updateSummary();
    };
    grid.appendChild(button);
  });
}

function getSelectedAddons() {
  return [...document.querySelectorAll(".addon input:checked")].map(x => ({
    name: x.dataset.name,
    price: Number(x.value)
  }));
}

function getTotal() {
  let total = catalog[currentService][currentPackageIndex][1];
  getSelectedAddons().forEach(a => total += a.price);
  return total;
}

function updateSummary() {
  const pkg = catalog[currentService][currentPackageIndex];
  const addons = getSelectedAddons();
  document.getElementById("summaryPackage").textContent = `${pkg[0]} — ${rupiah(pkg[1])}`;
  document.getElementById("summaryAddon").textContent = addons.length ? addons.map(a => a.name).join(", ") : "Tidak ada";
  document.getElementById("summaryTotal").textContent = rupiah(getTotal());
}

document.querySelectorAll(".addon input").forEach(x => x.addEventListener("change", updateSummary));

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  currentOrderId = "DS-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 99999)).padStart(5, "0");

  const pkg = catalog[currentService][currentPackageIndex];
  const total = getTotal();
  const dp = Math.round(total * 0.5);

  document.getElementById("orderScreen").style.display = "none";
  document.getElementById("paymentScreen").classList.add("show");

  document.getElementById("paymentOrderId").textContent = currentOrderId;
  document.getElementById("payService").textContent = currentService;
  document.getElementById("payPackage").textContent = pkg[0];
  document.getElementById("payTotal").textContent = rupiah(dp);
  document.getElementById("payNote").textContent = `DP 50% untuk mulai desain (Rp ${rupiah(dp)}). Sisa Rp ${rupiah(total - dp)} lunas sebelum file final dikirim.`;
});

function backToOrder() {
  document.getElementById("paymentScreen").classList.remove("show");
  document.getElementById("orderScreen").style.display = "block";
}

function simulatePayment(method) {
  document.getElementById("paymentScreen").classList.remove("show");
  document.getElementById("successScreen").classList.add("show");
  document.getElementById("successOrderId").textContent = currentOrderId;
  console.log("Payment simulated:", { method, orderId: currentOrderId, service: currentService, total: getTotal() });
}

function finishOrder() {
  closeOrder();
  document.getElementById("orderForm").reset();
}

document.getElementById("overlay").addEventListener("click", e => {
  if (e.target.id === "overlay") closeOrder();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeOrder();
});

renderServices();

// ===== SCROLL REVEAL =====
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();
