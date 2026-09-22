/* ============================================================
   INFINITY PARTS — checkout.js
   Checkout em etapas (identificação, entrega, pagamento,
   confirmação), validação de formulário e simulação de Pix.
   ============================================================ */

let checkoutStep = 1;

function goToStep(step) {
  if (getCart().length === 0 && step !== 4) {
    window.location.href = 'carrinho.html';
    return;
  }
  checkoutStep = step;
  document.querySelectorAll('.checkout-step-panel').forEach(p => p.classList.remove('active'));
  const panel = document.querySelector(`.checkout-step-panel[data-step="${step}"]`);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.step-indicator').forEach(i => {
    const s = Number(i.dataset.step);
    i.classList.toggle('active', s === step);
    i.classList.toggle('done', s < step);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
  const panel = document.querySelector(`.checkout-step-panel[data-step="${step}"]`);
  if (!panel) return true;
  const requiredFields = panel.querySelectorAll('[required]');
  let valid = true;
  requiredFields.forEach(field => {
    field.classList.remove('input-error');
    if (!field.value.trim()) {
      field.classList.add('input-error');
      valid = false;
    }
  });
  if (!valid) showToast('Preencha todos os campos obrigatórios.', 'error');
  return valid;
}

function renderCheckoutSummary() {
  const box = document.getElementById('checkout-summary-items');
  const { subtotal, discount, shippingCost, total } = calcCartTotals();
  if (box) {
    box.innerHTML = getCart().map(item => {
      const p = getProductById(item.id);
      if (!p) return '';
      return `<div class="checkout-summary-item">
        <span>${item.qty}x ${p.name}</span>
        <span>${formatBRL(p.salePrice * item.qty)}</span>
      </div>`;
    }).join('');
  }
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('checkout-subtotal', formatBRL(subtotal));
  setText('checkout-discount', `- ${formatBRL(discount)}`);
  setText('checkout-shipping', formatBRL(shippingCost));
  setText('checkout-total', formatBRL(total));

  const pixValue = +(total * 0.95).toFixed(2);
  setText('pix-value', formatBRL(pixValue));
  setText('final-total', formatBRL(total));
}

/* ---------- MÁSCARAS SIMPLES ---------- */
function maskCPF(value) {
  return value.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function maskCEP(value) {
  return value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}
function maskPhone(value) {
  return value.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}
function maskCard(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function initMasks() {
  const cpf = document.getElementById('cpf'); if (cpf) cpf.addEventListener('input', () => cpf.value = maskCPF(cpf.value));
  const cep = document.getElementById('cep'); if (cep) cep.addEventListener('input', () => cep.value = maskCEP(cep.value));
  const phone = document.getElementById('telefone'); if (phone) phone.addEventListener('input', () => phone.value = maskPhone(phone.value));
  const card = document.getElementById('card-number'); if (card) card.addEventListener('input', () => card.value = maskCard(card.value));
}

/* ---------- PAGAMENTO: alternar formulários ---------- */
function initPaymentToggle() {
  const radios = document.querySelectorAll('input[name="payment-method"]');
  radios.forEach(r => r.addEventListener('change', () => {
    document.querySelectorAll('.payment-form').forEach(f => f.classList.remove('active'));
    const target = document.getElementById(`payment-${r.value}`);
    if (target) target.classList.add('active');
  }));
}

/* ---------- COPIAR CÓDIGO PIX ---------- */
function initPixCopy() {
  const btn = document.getElementById('copy-pix');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const fakeCode = '00020126580014BR.GOV.BCB.PIX0136infinityparts-pix-demo520400005303986540' + calcCartTotals().total.toFixed(2).replace('.', '') + '5802BR5913INFINITY PARTS6009SAO PAULO62070503***6304ABCD';
    navigator.clipboard.writeText(fakeCode).then(() => {
      showToast('Pix copiado!');
    }).catch(() => {
      showToast('Não foi possível copiar. Copie manualmente.', 'error');
    });
  });
}

/* ---------- NAVEGAÇÃO ENTRE ETAPAS ---------- */
function initStepNavigation() {
  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(checkoutStep)) goToStep(checkoutStep + 1);
    });
  });
  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => goToStep(checkoutStep - 1));
  });

  const finishBtn = document.getElementById('finish-order');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      const orderNumber = 'IP' + Math.floor(10000 + Math.random() * 89999);
      const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setText('order-number', orderNumber);
      localStorage.removeItem(CART_KEY);
      sessionStorage.removeItem('ip_coupon');
      sessionStorage.removeItem('ip_shipping');
      updateCartCount();
      goToStep(4);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.querySelector('.checkout-wrapper')) return;
  if (getCart().length === 0) {
    window.location.href = 'carrinho.html';
    return;
  }
  await window.productsReadyPromise;
  renderCheckoutSummary();
  initMasks();
  initPaymentToggle();
  initPixCopy();
  initStepNavigation();
  goToStep(1);
});
