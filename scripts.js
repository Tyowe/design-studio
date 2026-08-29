/* ===================================================
   AI DESIGN STUDIO — Scripts
   =================================================== */

// ===== WHATSAPP CONFIG =====
// GANTI dengan nomor WhatsApp bisnis, tanpa "+" atau "0" di depan.
// Contoh: 0812-3456-7890 -> "6281234567890"
const WHATSAPP_NUMBER = "6281234567890";

// ===== PORTFOLIO DATA =====
// Tambah gambar ke assets/images/ lalu daftarkan di sini.
const portfolioItems = [
    {
        src: 'assets/images/sample-1.jpg',
        alt: 'Desain Logo Boutique Fashion',
        title: 'Logo — Boutique Fashion',
        desc: 'Logo minimalis untuk brand fashion lokal.'
    },
    {
        src: 'assets/images/sample-2.jpg',
        alt: 'Kemasan Produk Skincare',
        title: 'Kemasan — Skincare Series',
        desc: 'Desain kemasan serum wajah, 3 varian.'
    },
    {
        src: 'assets/images/sample-3.jpg',
        alt: 'Poster Acara Komunitas',
        title: 'Poster — Komunitas Desain',
        desc: 'Poster undangan acara gathering desain.'
    },
];

document.addEventListener('DOMContentLoaded', () => {

    // ===== RENDER PORTFOLIO =====
    const grid = document.getElementById('portfolioGrid');
    const empty = document.getElementById('portfolioEmpty');

    function renderPortfolio() {
        grid.innerHTML = '';
        if (portfolioItems.length === 0) {
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';
        portfolioItems.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'portfolio-item';
            el.innerHTML = `
                <div class="portfolio-item-img">
                    ${item.src
                        ? `<img src="${item.src}" alt="${item.alt || item.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'portfolio-item-img-placeholder\\'>Karya ${index+1}</div>'">`
                        : `<div class="portfolio-item-img-placeholder">Karya ${index+1}</div>`
                    }
                </div>
                <div class="portfolio-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>`;
            el.addEventListener('click', () => openImageModal(item));
            grid.appendChild(el);
        });
    }

    function openImageModal(item) {
        const overlay = document.createElement('div');
        overlay.className = 'image-modal-overlay';
        overlay.innerHTML = `
            <div class="image-modal-content">
                <button class="image-modal-close" aria-label="Tutup">&times;</button>
                <img src="${item.src}" alt="${item.alt}" class="image-modal-img">
                <div class="image-modal-caption"><h3>${item.title}</h3><p>${item.desc}</p></div>
            </div>`;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('image-modal-close')) overlay.remove();
        });
        document.body.appendChild(overlay);
        const onKey = (e) => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); } };
        document.addEventListener('keydown', onKey);
    }

    renderPortfolio();

    // ===== WHATSAPP BRIEF MODAL =====
    const modal = document.getElementById('modal');
    const form = document.getElementById('briefForm');

    window.openForm = function (service) {
        document.getElementById('serviceName').textContent = service;
        document.getElementById('service').value = service;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    window.closeForm = function () {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.buy').forEach(btn => {
        btn.addEventListener('click', () => openForm(btn.dataset.service));
    });
    modal.addEventListener('click', e => { if (e.target === modal) closeForm(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeForm(); });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const msg =
`Halo AI Design Studio 👋

Saya ingin memesan / konsultasi desain.

LAYANAN
${data.get('service')}

DATA KLIEN
Nama: ${data.get('name')}
WhatsApp: ${data.get('phone')}
Email: ${data.get('email') || '-'}
Brand: ${data.get('brand')}
Jenis bisnis: ${data.get('business') || '-'}
Budget: ${data.get('budget')}

BRIEF PROJECT
${data.get('brief')}

REFERENSI
${data.get('reference') || '-'}

Mohon info langkah selanjutnya. Terima kasih.`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        closeForm();
    });

});
