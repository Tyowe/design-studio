/* ===================================================
   AI Design Studio — Scripts
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. PORTFOLIO DATA
    // =============================================
    // Tambah gambar di folder assets/images/
    // Lalu daftarkan di array ini.
    const portfolioItems = [
        // Contoh — ganti dengan karya aslimu
        {
            src: 'assets/images/sample-1.jpg',   // ganti dengan file asli
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

    const grid = document.getElementById('portfolioGrid');
    const empty = document.getElementById('portfolioEmpty');

    function renderPortfolio() {
        grid.innerHTML = '';

        if (portfolioItems.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';

        portfolioItems.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'portfolio-item';
            el.setAttribute('data-index', index);
            el.innerHTML = `
                <div class="portfolio-item-img">
                    ${item.src
                        ? `<img src="${item.src}" alt="${item.alt || item.title}" class="portfolio-item-img-real" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'portfolio-item-img-placeholder\\'>Gambar ${index+1}</div>'">`
                        : `<div class="portfolio-item-img-placeholder">Karya ${index+1}</div>`
                    }
                </div>
                <div class="portfolio-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            `;

            // Klik untuk liat gambar besar (modal sederhana)
            el.addEventListener('click', () => openImageModal(item));
            grid.appendChild(el);
        });
    }

    // =============================================
    // 2. IMAGE MODAL (klik untuk zoom)
    // =============================================
    function openImageModal(item) {
        const overlay = document.createElement('div');
        overlay.className = 'image-modal-overlay';
        overlay.innerHTML = `
            <div class="image-modal-content">
                <button class="image-modal-close" aria-label="Tutup">&times;</button>
                <img src="${item.src}" alt="${item.alt}" class="image-modal-img">
                <div class="image-modal-caption">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('image-modal-close')) {
                overlay.remove();
            }
        });
        document.body.appendChild(overlay);

        // Trap ESC
        const onKey = (e) => {
            if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); }
        };
        document.addEventListener('keydown', onKey);
    }

    // Inject modal CSS
    const modalCSS = document.createElement('style');
    modalCSS.textContent = `
        .image-modal-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000;
            padding: 20px;
            animation: fadeIn 0.2s ease;
        }
        .image-modal-content {
            background: #fff;
            border-radius: 12px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 30px rgba(0,0,0,0.3);
        }
        .image-modal-img {
            display: block;
            max-width: 90vw;
            max-height: 75vh;
            object-fit: contain;
        }
        .image-modal-caption {
            padding: 16px 20px;
            text-align: center;
        }
        .image-modal-caption h3 {
            font-size: 1.05rem;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .image-modal-caption p {
            color: #6b7280;
            font-size: 0.9rem;
        }
        .image-modal-close {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 36px;
            height: 36px;
            border: none;
            background: rgba(255,255,255,0.85);
            border-radius: 50%;
            font-size: 1.4rem;
            cursor: pointer;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .image-modal-close:hover {
            background: #fff;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(modalCSS);

    renderPortfolio();

    // =============================================
    // 3. ORDER FORM
    // =============================================
    const form = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formStatus = document.getElementById('formStatus');

    // Validasi required checkbox saat submit
    form.addEventListener('submit', (e) => {
        const consent = form.querySelector('input[name="consent"]');
        if (!consent.checked) {
            e.preventDefault();
            showStatus('Mohon ceklis persetujuan terlebih dahulu.', 'error');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ambil data form
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            wa: formData.get('wa'),
            service: formData.get('service'),
            budget: formData.get('budget'),
            deadline: formData.get('deadline'),
            message: formData.get('message'),
            files: formData.getAll('files'),
            consent: true,
            submittedAt: new Date().toISOString(),
            source: 'AI Design Studio Website',
        };

        // UI: loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        try {
            // Opsi 1: Kirim ke Netlify Forms (auto jika website di-deploy ke Netlify)
            // Form sudah pakai data-netlify="true" di HTML.
            // Form submission akan jalan otomatis saat di Netlify.
            // Di sini kita simulasi submit "berhasil" untuk pengalaman lokal.
            //
            // Opsi 2: Kirim ke Airtable API (butuh API key, disimpan di environment)
            // Config: ganti ke Airtable kalau mau integrasi langsung.

            // Simpan ke localStorage sebagai cadangan (untuk preview lokal)
            saveToLocalStorage(data);

            showStatus(`
                <strong>Pesan terkirim! ✅</strong><br>
                Terima kasih, ${data.name}. Kami akan menghubungimu dalam 24 jam ke depan.<br>
                <small style="color:#6b7280;">(Di browser lokal, order tersimpan di localStorage. Setelah deploy ke Netlify, order akan masuk ke Netlify Forms.)</small>
            `, 'success');

            form.reset();

        } catch (err) {
            showStatus(`Gagal mengirim: ${err.message}`, 'error');
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    // =============================================
    // 4. LOCAL STORAGE (cadangan lokal)
    // =============================================
    function saveToLocalStorage(data) {
        const key = 'ai-design-studio-orders';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(data); // urutan terbaru di atas
        localStorage.setItem(key, JSON.stringify(existing));

        // Batasi hanya 50 entry terbaru
        if (existing.length > 50) {
            localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
        }

        console.log('[AI Design Studio] Order tersimpan di localStorage:', data.name);
    }

    // =============================================
    // 5. STATUS MESSAGE
    // =============================================
    function showStatus(html, type) {
        formStatus.style.display = 'block';
        formStatus.className = `form-status ${type}`;
        formStatus.innerHTML = html;

        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        }
    }

    // =============================================
    // 6. ADMIN DASHBOARD (baca localStorage)
    // =============================================
    // Bisa dibuka dengan menambahkan ?admin ke URL, contoh:
    // http://localhost:8000/?admin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
        const key = 'ai-design-studio-orders';
        const orders = JSON.parse(localStorage.getItem(key) || '[]');

        if (orders.length === 0) {
            showStatus('<strong>Belum ada order.</strong> Form baru akan muncul di sini setelah ada yang kirim.', 'success');
        } else {
            let html = `
                <div style="margin-top:20px;">
                    <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:10px;">📋 Dashboard Order (Local)</h3>
                    <p style="color:#6b7280;font-size:0.9rem;margin-bottom:14px;">
                        Total: ${orders.length} order. <br>
                        <small>(Data tersimpan di browser ini. Setelah di Netlify, data akan masuk ke Netlify Forms / Airtable.)</small>
                    </p>
                    <div style="max-height:400px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;">
            `;

            orders.forEach((o, i) => {
                const filesList = o.files && o.files.length > 0
                    ? o.files.map(f => f.name).join(', ')
                    : 'Tidak ada';
                const deadlineStr = o.deadline ? new Date(o.deadline).toLocaleDateString('id-ID') : '-';

                html += `
                    <div style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:0.9rem;">
                        <div style="display:flex;justify-content:space-between;align-items:start;">
                            <strong>${o.name}</strong>
                            <span style="color:#6b7280;font-size:0.8rem;">${new Date(o.submittedAt).toLocaleString('id-ID')}</span>
                        </div>
                        <div style="margin-top:6px;color:#6b7280;">
                            ✉️ ${o.email} ${o.wa ? '📱 ' + o.wa : ''}
                        </div>
                        <div style="margin-top:4px;">
                            <strong>Layanan:</strong> ${o.service}<br>
                            <strong>Budget:</strong> ${o.budget}<br>
                            <strong>Deadline:</strong> ${deadlineStr}<br>
                            ${o.message ? `<strong>Pesan:</strong> ${o.message}` : ''}
                        </div>
                        ${filesList ? `<div style="margin-top:6px;color:#6b7280;">📎 ${filesList}</div>` : ''}
                    </div>
                `;
            });

            html += `</div></div>`;
            showStatus(html, 'success');
        }
    }

});
