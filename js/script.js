// ──────────────────────────────────────────────────────
// Smooth scroll com offset da navbar
// ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        e.preventDefault();

        const target = document.querySelector(targetId);
        if (target) {
            const offset = document.getElementById('header-nav')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ──────────────────────────────────────────────────────
// Navbar: glassmorphism ao scroll
// ──────────────────────────────────────────────────────
const nav = document.getElementById('header-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });

// ──────────────────────────────────────────────────────
// Modal de captura de lead
// ──────────────────────────────────────────────────────
const ASAAS_URL = 'https://www.asaas.com/c/6ygeqteukb7ctpbc';
const WEBHOOK_URL = 'https://automacao.bagents.cloud/webhook/d16921bc-1986-4b41-8afa-a512e3db7041';

const leadModal = document.getElementById('lead-modal');
const leadForm = document.getElementById('lead-form');
const submitBtn = document.getElementById('lead-submit');
const btnLabel = submitBtn?.querySelector('.btn-label');
const btnLoading = submitBtn?.querySelector('.btn-loading');
const feedbackEl = document.getElementById('modal-feedback');

/** Abre o modal com animação */
function openLeadModal() {
    leadModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Re-inicializa ícones Lucide dentro do modal
    if (window.lucide) lucide.createIcons();
}

/** Fecha o modal com animação */
function closeLeadModal() {
    leadModal.classList.remove('open');
    document.body.style.overflow = '';
}

// Fechar ao clicar no overlay (fora da caixa)
leadModal?.addEventListener('click', (e) => {
    if (e.target === leadModal) closeLeadModal();
});

// Fechar com tecla Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && leadModal.classList.contains('open')) closeLeadModal();
});

// ──────────────────────────────────────────────────────
// Máscara de telefone brasileira
// ──────────────────────────────────────────────────────
const telInput = document.getElementById('lead-telefone');
telInput?.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    telInput.value = v;
});

// ──────────────────────────────────────────────────────
// Envio do formulário → Webhook → Redireciona ao Asaas
// ──────────────────────────────────────────────────────
leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('lead-nome').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const telefone = document.getElementById('lead-telefone').value.trim();

    // Validação simples
    if (!nome || !email || !telefone) {
        showFeedback('Por favor, preencha todos os campos.', 'error');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback('Informe um e-mail válido.', 'error');
        return;
    }

    setLoading(true);

    // Captura parâmetros UTM da URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const utms = {};
    utmFields.forEach(key => {
        const val = urlParams.get(key);
        if (val) utms[key] = val;
    });

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, telefone, ...utms })
        });

        // Sucesso: feedback visual breve, depois redireciona
        showFeedback('✓ Dados enviados! Redirecionando...', 'success');
        setTimeout(() => {
            window.open(ASAAS_URL, '_blank');
            closeLeadModal();
            leadForm.reset();
            hideFeedback();
        }, 1500);

    } catch (err) {
        // Mesmo com erro de rede, redireciona (modo no-cors não lança exceção em geral)
        showFeedback('✓ Redirecionando...', 'success');
        setTimeout(() => {
            window.open(ASAAS_URL, '_blank');
            closeLeadModal();
            leadForm.reset();
            hideFeedback();
        }, 1200);
    } finally {
        setLoading(false);
    }
});

function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    if (btnLabel) btnLabel.hidden = on;
    if (btnLoading) btnLoading.hidden = !on;
}

function showFeedback(msg, type) {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.className = `modal-feedback ${type}`;
    feedbackEl.hidden = false;
}

function hideFeedback() {
    if (feedbackEl) feedbackEl.hidden = true;
}
