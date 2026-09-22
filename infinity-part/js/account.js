/* ============================================================
   INFINITY PARTS — account.js
   Login, cadastro (com validação), minha conta e favoritos.
   Dados de sessão simulados via localStorage.
   ============================================================ */

const USER_KEY = 'ip_user';

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
}
function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function logoutUser() {
  localStorage.removeItem(USER_KEY);
  window.location.href = 'login.html';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/* Telefone brasileiro: aceita fixo (10 dígitos) ou celular (11 dígitos) */
function isValidPhoneBR(phone) {
  const len = phone.replace(/\D/g, '').length;
  return len === 10 || len === 11;
}
/* Data no formato DD/MM/AAAA, validando dias por mês (inclusive ano bissexto) */
function isValidDateBR(value) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return false;
  const day = Number(m[1]), month = Number(m[2]), year = Number(m[3]);
  if (month < 1 || month > 12) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  return true;
}

/* ---------- LOGIN ---------- */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    let valid = true;

    if (!isValidEmail(email)) { markError('login-email', true); valid = false; } else markError('login-email', false);
    if (password.length < 4) { markError('login-password', true); valid = false; } else markError('login-password', false);

    if (!valid) { showToast('Verifique os campos e tente novamente.', 'error'); return; }

    const name = email.split('@')[0];
    saveUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
    showToast('Login realizado com sucesso!');
    setTimeout(() => window.location.href = 'minha-conta.html', 700);
  });
}

/* ---------- CADASTRO EM DUAS ETAPAS (dados pessoais + endereço) ----------
   Estrutura pensada para casar com um backend real assim que ele existir:
   REGISTER_API_CONFIG segue exatamente o mesmo padrão do API_CONFIG usado
   em products.js (useApi + baseUrl + path). Hoje não há nenhum backend no
   projeto (é só front-end, como o restante do site), então useApi começa
   em false e o cadastro segue simulado via localStorage, igual ao login.
   Quando a API de cadastro existir, basta virar useApi para true e apontar
   baseUrl/registerPath para o endpoint real — nada mais muda. */
const REGISTER_API_CONFIG = {
  useApi: false,                                  // true assim que existir um endpoint de cadastro
  baseUrl: "http://localhost:5000/api",            // <-- troque pela URL da sua API
  registerPath: "/auth/register"                   // POST {baseUrl}{registerPath}
};

let registerStep = 1;
let cepValidated = false;

function maskPhoneLocal(v) {
  return v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}
function maskDateLocal(v) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
}
function maskCEPLocal(v) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

function goToRegisterStep(step) {
  registerStep = step;
  document.querySelectorAll('.register-step').forEach(panel => {
    panel.classList.toggle('active', Number(panel.dataset.registerStep) === step);
  });
  document.querySelectorAll('#register-steps-nav .step-indicator').forEach(ind => {
    const s = Number(ind.dataset.step);
    ind.classList.toggle('active', s === step);
    ind.classList.toggle('done', s < step);
  });

  const loginLink = document.getElementById('register-login-link');
  if (loginLink) loginLink.style.display = step === 1 ? '' : 'none';

  const title = document.getElementById('register-title');
  const subtitle = document.getElementById('register-subtitle');
  if (title && subtitle) {
    if (step === 1) { title.textContent = 'Criar Conta'; subtitle.textContent = 'Leva menos de dois minutos'; }
    else { title.textContent = 'Endereço de Entrega'; subtitle.textContent = 'Para onde devemos enviar seus pedidos?'; }
  }

  const wrapper = document.querySelector('.auth-wrapper');
  if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Valida a Etapa 1 — Dados pessoais */
function validateRegisterStep1() {
  const nome = document.getElementById('reg-nome');
  const telefone = document.getElementById('reg-telefone');
  const nascimento = document.getElementById('reg-nascimento');
  const email = document.getElementById('reg-email');
  const senha = document.getElementById('reg-senha');
  const confirmar = document.getElementById('reg-confirmar');
  let valid = true;

  const requireField = (field) => {
    const ok = !!field.value.trim();
    markError(field.id, !ok);
    if (!ok) valid = false;
    return ok;
  };

  requireField(nome);

  if (requireField(telefone) && !isValidPhoneBR(telefone.value)) { markError(telefone.id, true); valid = false; }
  if (requireField(nascimento) && !isValidDateBR(nascimento.value)) { markError(nascimento.id, true); valid = false; }
  if (requireField(email) && !isValidEmail(email.value)) { markError(email.id, true); valid = false; }
  if (requireField(senha) && senha.value.length < 6) { markError(senha.id, true); valid = false; }
  requireField(confirmar);
  if (confirmar.value && confirmar.value !== senha.value) { markError(confirmar.id, true); valid = false; }

  if (!valid) showToast('Verifique os campos destacados.', 'error');
  return valid;
}

/* Valida a Etapa 2 — Endereço */
function validateRegisterStep2() {
  const cep = document.getElementById('reg-cep');
  const rua = document.getElementById('reg-rua');
  const numero = document.getElementById('reg-numero');
  const bairro = document.getElementById('reg-bairro');
  const cidade = document.getElementById('reg-cidade');
  const estado = document.getElementById('reg-estado');
  let valid = true;

  const requireField = (field) => {
    const ok = !!field.value.trim();
    markError(field.id, !ok);
    if (!ok) valid = false;
    return ok;
  };

  const cepOk = requireField(cep) && cep.value.replace(/\D/g, '').length === 8;
  if (!cepOk) { markError(cep.id, true); valid = false; }
  if (cepOk && !cepValidated) {
    setCepStatus('CEP não encontrado.', 'error');
    valid = false;
  }

  requireField(rua);
  requireField(numero);
  requireField(bairro);
  requireField(cidade);
  if (requireField(estado) && estado.value.trim().length !== 2) { markError(estado.id, true); valid = false; }

  if (!valid) showToast('Verifique os campos destacados.', 'error');
  return valid;
}

function setCepStatus(message, type) {
  const el = document.getElementById('cep-status');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('field-status-loading', 'field-status-error', 'field-status-success');
  if (type) el.classList.add(`field-status-${type}`);
}

/* ---------- ViaCEP ---------- */
async function lookupCEP() {
  const cepField = document.getElementById('reg-cep');
  if (!cepField) return;
  const digits = cepField.value.replace(/\D/g, '');
  cepValidated = false;

  if (digits.length === 0) { setCepStatus('', null); return; }
  if (digits.length !== 8) { setCepStatus('Digite um CEP válido.', 'error'); return; }

  setCepStatus('Buscando endereço...', 'loading');

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!res.ok) throw new Error('Falha na consulta do CEP');
    const data = await res.json();

    if (data.erro) {
      setCepStatus('CEP não encontrado.', 'error');
      return;
    }

    document.getElementById('reg-rua').value = data.logradouro || '';
    document.getElementById('reg-bairro').value = data.bairro || '';
    document.getElementById('reg-cidade').value = data.localidade || '';
    document.getElementById('reg-estado').value = data.uf || '';
    markError('reg-rua', false);
    markError('reg-bairro', false);
    markError('reg-cidade', false);
    markError('reg-estado', false);
    markError('reg-cep', false);

    cepValidated = true;
    setCepStatus('Endereço encontrado.', 'success');
    document.getElementById('reg-numero').focus();
  } catch (err) {
    setCepStatus('Não foi possível consultar o endereço. Tente novamente.', 'error');
  }
}

/* Envia o cadastro. Hoje não existe backend no projeto, então cai no modo
   local (mesma simulação de sessão que login.html já usa). O formato do
   payload já é o combinado das duas etapas, pronto para uma API real. */
async function submitRegistration(payload) {
  if (REGISTER_API_CONFIG.useApi) {
    const res = await fetch(REGISTER_API_CONFIG.baseUrl + REGISTER_API_CONFIG.registerPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`API respondeu com status ${res.status}`);
    return res.json();
  }
  return null; // modo demonstração — nada é enviado, o site segue local
}

function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  /* máscaras */
  const telField = document.getElementById('reg-telefone');
  if (telField) telField.addEventListener('input', () => telField.value = maskPhoneLocal(telField.value));
  const dateField = document.getElementById('reg-nascimento');
  if (dateField) dateField.addEventListener('input', () => dateField.value = maskDateLocal(dateField.value));
  const cepField = document.getElementById('reg-cep');
  if (cepField) {
    cepField.addEventListener('input', () => {
      cepField.value = maskCEPLocal(cepField.value);
      if (cepField.value.replace(/\D/g, '').length === 8) lookupCEP();
      else { cepValidated = false; setCepStatus('', null); }
    });
    cepField.addEventListener('blur', () => { if (cepField.value.trim()) lookupCEP(); });
  }
  const estadoField = document.getElementById('reg-estado');
  if (estadoField) estadoField.addEventListener('input', () => estadoField.value = estadoField.value.toUpperCase().slice(0, 2));

  /* navegação entre etapas */
  const nextBtn = document.getElementById('btn-register-next');
  if (nextBtn) nextBtn.addEventListener('click', () => { if (validateRegisterStep1()) goToRegisterStep(2); });

  const backBtn = document.getElementById('btn-register-back');
  if (backBtn) backBtn.addEventListener('click', () => goToRegisterStep(1));

  /* envio final */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (registerStep !== 2) return; // Enter na etapa 1 não deve finalizar o cadastro
    if (!validateRegisterStep1()) { goToRegisterStep(1); return; }
    if (!validateRegisterStep2()) return;

    const payload = {
      nomeCompleto: document.getElementById('reg-nome').value.trim(),
      telefone: document.getElementById('reg-telefone').value.trim(),
      dataNascimento: document.getElementById('reg-nascimento').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      senha: document.getElementById('reg-senha').value,
      cep: document.getElementById('reg-cep').value.trim(),
      rua: document.getElementById('reg-rua').value.trim(),
      numero: document.getElementById('reg-numero').value.trim(),
      complemento: document.getElementById('reg-complemento').value.trim(),
      bairro: document.getElementById('reg-bairro').value.trim(),
      cidade: document.getElementById('reg-cidade').value.trim(),
      estado: document.getElementById('reg-estado').value.trim()
    };

    const finishBtn = document.getElementById('btn-register-finish');
    finishBtn.disabled = true;

    try {
      await submitRegistration(payload);
      /* A senha nunca é persistida no navegador — nem em texto puro nem de
         nenhuma outra forma. Se/quando existir backend, o hash é feito lá. */
      saveUser({ name: payload.nomeCompleto, email: payload.email });
      showToast('Conta criada com sucesso!');
      setTimeout(() => window.location.href = 'minha-conta.html', 700);
    } catch (err) {
      showToast('Não foi possível concluir o cadastro. Tente novamente.', 'error');
      finishBtn.disabled = false;
    }
  });
}

function markError(id, hasError) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('input-error', hasError);
}

/* ---------- MINHA CONTA ---------- */
const FAKE_ORDERS = [
  { number: 'IP10294', date: '02/09/2026', status: 'Em preparação', total: 2199.90 },
  { number: 'IP10187', date: '18/08/2026', status: 'Entregue', total: 749.90 },
  { number: 'IP10052', date: '30/07/2026', status: 'Entregue', total: 429.90 }
];

function renderAccountPage() {
  const greeting = document.getElementById('account-greeting');
  if (!greeting) return;

  const user = getUser();
  greeting.textContent = `Olá, ${user ? user.name.split(' ')[0] : 'Visitante'}!`;

  const emailEl = document.getElementById('account-email');
  if (emailEl && user) emailEl.value = user.email;
  const nameEl = document.getElementById('account-name');
  if (nameEl && user) nameEl.value = user.name;

  const ordersBox = document.getElementById('orders-list');
  if (ordersBox) {
    ordersBox.innerHTML = FAKE_ORDERS.map(o => `
      <div class="order-card">
        <div>
          <span class="order-number">Pedido #${o.number}</span>
          <span class="order-date">${o.date}</span>
        </div>
        <span class="order-status status-${slugify(o.status)}">${o.status}</span>
        <span class="order-total">${formatBRL(o.total)}</span>
      </div>`).join('');
  }

  initAccountMenu();
}

function initAccountMenu() {
  const links = document.querySelectorAll('.account-menu a[data-panel]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.account-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(link.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
}

/* ---------- FAVORITOS: página dedicada ---------- */
function renderFavoritesPage() {
  const grid = document.getElementById('favorites-grid');
  if (!grid) return;
  const favs = getFavorites();
  const products = PRODUCTS.filter(p => favs.includes(p.id));

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-heart"></i>
        <p>Você ainda não adicionou favoritos.</p>
        <a href="produtos.html" class="btn btn-primary">EXPLORAR PRODUTOS</a>
      </div>`;
    return;
  }
  grid.innerHTML = products.map(renderProductCard).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  initLoginForm();
  initRegisterForm();
  renderAccountPage(); // não depende de PRODUCTS (pedidos são dados fixos de demonstração)
  const favGrid = document.getElementById('favorites-grid');
  if (favGrid) {
    favGrid.innerHTML = '<div class="loading-state"><i class="bi bi-arrow-repeat spin"></i> Carregando favoritos...</div>';
    await window.productsReadyPromise;
    renderFavoritesPage();
  }
});
