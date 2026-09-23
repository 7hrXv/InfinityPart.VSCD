/* ============================================================
   INFINITY PARTS — account.js
   Login conectado à API + cadastro + minha conta + favoritos
   ============================================================ */

const API_BASE_URL = 'http://localhost:5022/api';
const USER_KEY = 'ip_user';

/* ============================================================
   USUÁRIO / SESSÃO
   ============================================================ */

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(USER_KEY);
  window.location.href = 'login.html';
}

/* ============================================================
   VALIDAÇÕES
   ============================================================ */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneBR(phone) {
  const len = phone.replace(/\D/g, '').length;
  return len === 10 || len === 11;
}

function isValidDateBR(value) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!m) return false;

  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);

  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();

  if (day < 1 || day > daysInMonth) return false;

  if (year < 1900 || year > new Date().getFullYear()) {
    return false;
  }

  return true;
}

/* ============================================================
   LOGIN DO CLIENTE — API REAL
   ============================================================ */

function initLoginForm() {
  const form = document.getElementById('login-form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');

    const email = emailField.value.trim();
    const password = passwordField.value;

    let valid = true;

    /* Validação do e-mail */

    if (!isValidEmail(email)) {
      markError('login-email', true);
      valid = false;
    } else {
      markError('login-email', false);
    }

    /* Validação da senha */

    if (password.length < 4) {
      markError('login-password', true);
      valid = false;
    } else {
      markError('login-password', false);
    }

    if (!valid) {
      showToast('Verifique os campos e tente novamente.', 'error');
      return;
    }

    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = true;
      button.textContent = 'ENTRANDO...';
    }

    try {
      /* =====================================================
         CHAMADA PARA A API
         POST http://localhost:5022/api/Autenticacao/login-cliente
         ===================================================== */

      const response = await fetch(
        `${API_BASE_URL}/Autenticacao/login-cliente`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            senha: password
          })
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }

      /* =====================================================
         LOGIN NÃO AUTENTICADO
         ===================================================== */

      if (!response.ok || !data || !data.autenticado) {

        const mensagem =
          data?.mensagem ||
          'E-mail ou senha incorretos.';

        showToast(mensagem, 'error');

        if (button) {
          button.disabled = false;
          button.textContent = 'ENTRAR';
        }

        return;
      }

      /* =====================================================
         LOGIN REALIZADO
         ===================================================== */

      const cliente = data.cliente;

      if (!cliente) {
        showToast(
          'Login realizado, mas os dados do cliente não foram encontrados.',
          'error'
        );

        if (button) {
          button.disabled = false;
          button.textContent = 'ENTRAR';
        }

        return;
      }

      /* =====================================================
         SALVA SOMENTE OS DADOS NECESSÁRIOS DA SESSÃO
         A SENHA NÃO É SALVA.
         ===================================================== */

      saveUser({
        id: cliente.id,
        name: cliente.nome,
        cpf: cliente.cpf,
        email: cliente.email,
        telefone: cliente.telefone,
        cep: cliente.cep,
        endereco: cliente.endereco,
        numero: cliente.numero,
        cidade: cliente.cidade,
        estado: cliente.estado
      });

      showToast('Login realizado com sucesso!');

      /* Vai para Minha Conta */

      setTimeout(() => {
        window.location.href = 'minha-conta.html';
      }, 700);

    } catch (error) {

      console.error('Erro ao conectar com a API:', error);

      showToast(
        'Não foi possível conectar à API. Verifique se o backend está rodando.',
        'error'
      );

      if (button) {
        button.disabled = false;
        button.textContent = 'ENTRAR';
      }
    }
  });
}

/* ============================================================
   CADASTRO
   ============================================================ */

const REGISTER_API_CONFIG = {
  useApi: false,
  baseUrl: API_BASE_URL,
  registerPath: '/Cliente'
};

let registerStep = 1;
let cepValidated = false;

/* ============================================================
   MÁSCARAS
   ============================================================ */

function maskPhoneLocal(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function maskDateLocal(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

function maskCEPLocal(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

/* ============================================================
   NAVEGAÇÃO DO CADASTRO
   ============================================================ */

function goToRegisterStep(step) {

  registerStep = step;

  document.querySelectorAll('.register-step').forEach(panel => {

    panel.classList.toggle(
      'active',
      Number(panel.dataset.registerStep) === step
    );

  });

  document.querySelectorAll(
    '#register-steps-nav .step-indicator'
  ).forEach(indicator => {

    const currentStep = Number(indicator.dataset.step);

    indicator.classList.toggle(
      'active',
      currentStep === step
    );

    indicator.classList.toggle(
      'done',
      currentStep < step
    );

  });

  const loginLink =
    document.getElementById('register-login-link');

  if (loginLink) {
    loginLink.style.display =
      step === 1 ? '' : 'none';
  }

  const title =
    document.getElementById('register-title');

  const subtitle =
    document.getElementById('register-subtitle');

  if (title && subtitle) {

    if (step === 1) {

      title.textContent = 'Criar Conta';
      subtitle.textContent =
        'Leva menos de dois minutos';

    } else {

      title.textContent =
        'Endereço de Entrega';

      subtitle.textContent =
        'Para onde devemos enviar seus pedidos?';

    }

  }

  const wrapper =
    document.querySelector('.auth-wrapper');

  if (wrapper) {

    wrapper.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }
}

/* ============================================================
   VALIDAÇÃO ETAPA 1
   ============================================================ */

function validateRegisterStep1() {

  const nome =
    document.getElementById('reg-nome');

  const telefone =
    document.getElementById('reg-telefone');

  const nascimento =
    document.getElementById('reg-nascimento');

  const email =
    document.getElementById('reg-email');

  const senha =
    document.getElementById('reg-senha');

  const confirmar =
    document.getElementById('reg-confirmar');

  let valid = true;

  const requireField = field => {

    const ok =
      !!field.value.trim();

    markError(
      field.id,
      !ok
    );

    if (!ok) {
      valid = false;
    }

    return ok;
  };

  requireField(nome);

  if (
    requireField(telefone) &&
    !isValidPhoneBR(telefone.value)
  ) {

    markError(
      telefone.id,
      true
    );

    valid = false;
  }

  if (
    requireField(nascimento) &&
    !isValidDateBR(nascimento.value)
  ) {

    markError(
      nascimento.id,
      true
    );

    valid = false;
  }

  if (
    requireField(email) &&
    !isValidEmail(email.value)
  ) {

    markError(
      email.id,
      true
    );

    valid = false;
  }

  if (
    requireField(senha) &&
    senha.value.length < 6
  ) {

    markError(
      senha.id,
      true
    );

    valid = false;
  }

  requireField(confirmar);

  if (
    confirmar.value &&
    confirmar.value !== senha.value
  ) {

    markError(
      confirmar.id,
      true
    );

    valid = false;
  }

  if (!valid) {
    showToast(
      'Verifique os campos destacados.',
      'error'
    );
  }

  return valid;
}

/* ============================================================
   VALIDAÇÃO ETAPA 2
   ============================================================ */

function validateRegisterStep2() {

  const cep =
    document.getElementById('reg-cep');

  const rua =
    document.getElementById('reg-rua');

  const numero =
    document.getElementById('reg-numero');

  const bairro =
    document.getElementById('reg-bairro');

  const cidade =
    document.getElementById('reg-cidade');

  const estado =
    document.getElementById('reg-estado');

  let valid = true;

  const requireField = field => {

    const ok =
      !!field.value.trim();

    markError(
      field.id,
      !ok
    );

    if (!ok) {
      valid = false;
    }

    return ok;
  };

  const cepOk =
    requireField(cep) &&
    cep.value.replace(/\D/g, '').length === 8;

  if (!cepOk) {

    markError(
      cep.id,
      true
    );

    valid = false;
  }

  if (cepOk && !cepValidated) {

    setCepStatus(
      'CEP não encontrado.',
      'error'
    );

    valid = false;
  }

  requireField(rua);
  requireField(numero);
  requireField(bairro);
  requireField(cidade);

  if (
    requireField(estado) &&
    estado.value.trim().length !== 2
  ) {

    markError(
      estado.id,
      true
    );

    valid = false;
  }

  if (!valid) {

    showToast(
      'Verifique os campos destacados.',
      'error'
    );

  }

  return valid;
}

/* ============================================================
   STATUS DO CEP
   ============================================================ */

function setCepStatus(message, type) {

  const element =
    document.getElementById('cep-status');

  if (!element) return;

  element.textContent = message;

  element.classList.remove(
    'field-status-loading',
    'field-status-error',
    'field-status-success'
  );

  if (type) {

    element.classList.add(
      `field-status-${type}`
    );

  }
}

/* ============================================================
   VIACEP
   ============================================================ */

async function lookupCEP() {

  const cepField =
    document.getElementById('reg-cep');

  if (!cepField) return;

  const digits =
    cepField.value.replace(/\D/g, '');

  cepValidated = false;

  if (digits.length === 0) {

    setCepStatus('', null);
    return;

  }

  if (digits.length !== 8) {

    setCepStatus(
      'Digite um CEP válido.',
      'error'
    );

    return;
  }

  setCepStatus(
    'Buscando endereço...',
    'loading'
  );

  try {

    const response = await fetch(
      `https://viacep.com.br/ws/${digits}/json/`
    );

    if (!response.ok) {
      throw new Error(
        'Falha na consulta do CEP'
      );
    }

    const data =
      await response.json();

    if (data.erro) {

      setCepStatus(
        'CEP não encontrado.',
        'error'
      );

      return;
    }

    document.getElementById(
      'reg-rua'
    ).value = data.logradouro || '';

    document.getElementById(
      'reg-bairro'
    ).value = data.bairro || '';

    document.getElementById(
      'reg-cidade'
    ).value = data.localidade || '';

    document.getElementById(
      'reg-estado'
    ).value = data.uf || '';

    markError(
      'reg-rua',
      false
    );

    markError(
      'reg-bairro',
      false
    );

    markError(
      'reg-cidade',
      false
    );

    markError(
      'reg-estado',
      false
    );

    markError(
      'reg-cep',
      false
    );

    cepValidated = true;

    setCepStatus(
      'Endereço encontrado.',
      'success'
    );

    document.getElementById(
      'reg-numero'
    ).focus();

  } catch (error) {

    console.error(
      'Erro no ViaCEP:',
      error
    );

    setCepStatus(
      'Não foi possível consultar o endereço. Tente novamente.',
      'error'
    );

  }
}

/* ============================================================
   ENVIO DO CADASTRO
   ============================================================ */

async function submitRegistration(payload) {

  if (!REGISTER_API_CONFIG.useApi) {
    return null;
  }

  const response =
    await fetch(
      REGISTER_API_CONFIG.baseUrl +
      REGISTER_API_CONFIG.registerPath,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(payload)
      }
    );

  if (!response.ok) {

    let errorData = null;

    try {
      errorData = await response.json();
    } catch (error) {
      errorData = null;
    }

    throw new Error(
      errorData?.mensagem ||
      `API respondeu com status ${response.status}`
    );
  }

  return response.json();
}

/* ============================================================
   FORMULÁRIO DE CADASTRO
   ============================================================ */

function initRegisterForm() {

  const form =
    document.getElementById('register-form');

  if (!form) return;

  /* Telefone */

  const telField =
    document.getElementById('reg-telefone');

  if (telField) {

    telField.addEventListener(
      'input',
      () => {
        telField.value =
          maskPhoneLocal(
            telField.value
          );
      }
    );

  }

  /* Data */

  const dateField =
    document.getElementById('reg-nascimento');

  if (dateField) {

    dateField.addEventListener(
      'input',
      () => {
        dateField.value =
          maskDateLocal(
            dateField.value
          );
      }
    );

  }

  /* CEP */

  const cepField =
    document.getElementById('reg-cep');

  if (cepField) {

    cepField.addEventListener(
      'input',
      () => {

        cepField.value =
          maskCEPLocal(
            cepField.value
          );

        if (
          cepField.value
            .replace(/\D/g, '')
            .length === 8
        ) {

          lookupCEP();

        } else {

          cepValidated = false;

          setCepStatus(
            '',
            null
          );

        }

      }
    );

    cepField.addEventListener(
      'blur',
      () => {

        if (
          cepField.value.trim()
        ) {
          lookupCEP();
        }

      }
    );

  }

  /* Estado */

  const estadoField =
    document.getElementById('reg-estado');

  if (estadoField) {

    estadoField.addEventListener(
      'input',
      () => {

        estadoField.value =
          estadoField.value
            .toUpperCase()
            .slice(0, 2);

      }
    );

  }

  /* Próximo */

  const nextBtn =
    document.getElementById(
      'btn-register-next'
    );

  if (nextBtn) {

    nextBtn.addEventListener(
      'click',
      () => {

        if (
          validateRegisterStep1()
        ) {

          goToRegisterStep(2);

        }

      }
    );

  }

  /* Voltar */

  const backBtn =
    document.getElementById(
      'btn-register-back'
    );

  if (backBtn) {

    backBtn.addEventListener(
      'click',
      () => {
        goToRegisterStep(1);
      }
    );

  }

  /* Finalizar cadastro */

  form.addEventListener(
    'submit',
    async e => {

      e.preventDefault();

      if (registerStep !== 2) {
        return;
      }

      if (!validateRegisterStep1()) {

        goToRegisterStep(1);
        return;

      }

      if (!validateRegisterStep2()) {
        return;
      }

      /*
       * IMPORTANTE:
       * O backend atual não possui:
       * - dataNascimento
       * - complemento
       *
       * Portanto não enviamos esses dois campos.
       */

      const payload = {

        nome:
          document.getElementById(
            'reg-nome'
          ).value.trim(),

        cpf:
          '',

        email:
          document.getElementById(
            'reg-email'
          ).value.trim(),

        telefone:
          document.getElementById(
            'reg-telefone'
          ).value.replace(/\D/g, ''),

        senha:
          document.getElementById(
            'reg-senha'
          ).value,

        cep:
          document.getElementById(
            'reg-cep'
          ).value.replace(/\D/g, ''),

        endereco:
          document.getElementById(
            'reg-rua'
          ).value.trim(),

        numero:
          document.getElementById(
            'reg-numero'
          ).value.trim(),

        cidade:
          document.getElementById(
            'reg-cidade'
          ).value.trim(),

        estado:
          document.getElementById(
            'reg-estado'
          ).value.trim()
      };

      const finishBtn =
        document.getElementById(
          'btn-register-finish'
        );

      if (finishBtn) {
        finishBtn.disabled = true;
        finishBtn.textContent =
          'CADASTRANDO...';
      }

      try {

        await submitRegistration(
          payload
        );

        saveUser({
          name: payload.nome,
          email: payload.email,
          telefone: payload.telefone,
          cep: payload.cep,
          endereco: payload.endereco,
          numero: payload.numero,
          cidade: payload.cidade,
          estado: payload.estado
        });

        showToast(
          'Conta criada com sucesso!'
        );

        setTimeout(
          () => {
            window.location.href =
              'minha-conta.html';
          },
          700
        );

      } catch (error) {

        console.error(
          'Erro no cadastro:',
          error
        );

        showToast(
          error.message ||
          'Não foi possível concluir o cadastro.',
          'error'
        );

        if (finishBtn) {
          finishBtn.disabled = false;
          finishBtn.textContent =
            'FINALIZAR CADASTRO';
        }

      }

    }
  );
}

/* ============================================================
   MARCA ERRO NO INPUT
   ============================================================ */

function markError(id, hasError) {

  const element =
    document.getElementById(id);

  if (element) {

    element.classList.toggle(
      'input-error',
      hasError
    );

  }
}

/* ============================================================
   MINHA CONTA
   ============================================================ */

const FAKE_ORDERS = [
  {
    number: 'IP10294',
    date: '02/09/2026',
    status: 'Em preparação',
    total: 2199.90
  },
  {
    number: 'IP10187',
    date: '18/08/2026',
    status: 'Entregue',
    total: 749.90
  },
  {
    number: 'IP10052',
    date: '30/07/2026',
    status: 'Entregue',
    total: 429.90
  }
];

function renderAccountPage() {

  const greeting =
    document.getElementById(
      'account-greeting'
    );

  if (!greeting) return;

  const user = getUser();

  greeting.textContent =
    `Olá, ${
      user
        ? user.name.split(' ')[0]
        : 'Visitante'
    }!`;

  const emailEl =
    document.getElementById(
      'account-email'
    );

  if (emailEl && user) {
    emailEl.value =
      user.email || '';
  }

  const nameEl =
    document.getElementById(
      'account-name'
    );

  if (nameEl && user) {
    nameEl.value =
      user.name || '';
  }

  const ordersBox =
    document.getElementById(
      'orders-list'
    );

  if (ordersBox) {

    ordersBox.innerHTML =
      FAKE_ORDERS.map(order => `

        <div class="order-card">

          <div>

            <span class="order-number">
              Pedido #${order.number}
            </span>

            <span class="order-date">
              ${order.date}
            </span>

          </div>

          <span class="order-status status-${slugify(order.status)}">
            ${order.status}
          </span>

          <span class="order-total">
            ${formatBRL(order.total)}
          </span>

        </div>

      `).join('');

  }

  initAccountMenu();
}

/* ============================================================
   MENU DA CONTA
   ============================================================ */

function initAccountMenu() {

  const links =
    document.querySelectorAll(
      '.account-menu a[data-panel]'
    );

  links.forEach(link => {

    link.addEventListener(
      'click',
      e => {

        e.preventDefault();

        links.forEach(item =>
          item.classList.remove('active')
        );

        link.classList.add('active');

        document
          .querySelectorAll('.account-panel')
          .forEach(panel =>
            panel.classList.remove('active')
          );

        const panel =
          document.getElementById(
            link.dataset.panel
          );

        if (panel) {
          panel.classList.add('active');
        }

      }
    );

  });

  const logoutBtn =
    document.getElementById(
      'logout-btn'
    );

  if (logoutBtn) {
    logoutBtn.addEventListener(
      'click',
      logoutUser
    );
  }
}

/* ============================================================
   FAVORITOS
   ============================================================ */

function renderFavoritesPage() {

  const grid =
    document.getElementById(
      'favorites-grid'
    );

  if (!grid) return;

  const favs =
    getFavorites();

  const products =
    PRODUCTS.filter(
      product =>
        favs.includes(product.id)
    );

  if (products.length === 0) {

    grid.innerHTML = `

      <div class="empty-state">

        <i class="bi bi-heart"></i>

        <p>
          Você ainda não adicionou favoritos.
        </p>

        <a
          href="produtos.html"
          class="btn btn-primary"
        >
          EXPLORAR PRODUTOS
        </a>

      </div>

    `;

    return;
  }

  grid.innerHTML =
    products
      .map(renderProductCard)
      .join('');
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    initLoginForm();

    initRegisterForm();

    renderAccountPage();

    const favGrid =
      document.getElementById(
        'favorites-grid'
      );

    if (favGrid) {

      favGrid.innerHTML = `
        <div class="loading-state">
          <i class="bi bi-arrow-repeat spin"></i>
          Carregando favoritos...
        </div>
      `;

      if (window.productsReadyPromise) {
        await window.productsReadyPromise;
      }

      renderFavoritesPage();
    }

  }
);