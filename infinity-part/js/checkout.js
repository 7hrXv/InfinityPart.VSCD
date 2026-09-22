/* ============================================================
   INFINITY PARTS — checkout.js
   Checkout integrado com a API:
   POST /api/Pedido
   POST /api/ItemPedido
   ============================================================ */

const API_BASE_URL = 'http://localhost:5022/api';

// CLIENTE DE TESTE
// Depois vamos trocar pelo cliente obtido através do login.
const CLIENTE_ID = 4;

// Status "Pendente" retornado pela API
const STATUS_PEDIDO_ID = 2;

let checkoutStep = 1;
let finalizandoPedido = false;


/* ============================================================
   NAVEGAÇÃO ENTRE ETAPAS
   ============================================================ */

function goToStep(step) {

  if (getCart().length === 0 && step !== 4) {
    window.location.href = 'carrinho.html';
    return;
  }

  checkoutStep = step;

  document
    .querySelectorAll('.checkout-step-panel')
    .forEach(p => p.classList.remove('active'));

  const panel = document.querySelector(
    `.checkout-step-panel[data-step="${step}"]`
  );

  if (panel) {
    panel.classList.add('active');
  }

  document.querySelectorAll('.step-indicator').forEach(i => {
    const s = Number(i.dataset.step);

    i.classList.toggle('active', s === step);
    i.classList.toggle('done', s < step);
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateStep(step) {

  const panel = document.querySelector(
    `.checkout-step-panel[data-step="${step}"]`
  );

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

  if (!valid) {
    showToast(
      'Preencha todos os campos obrigatórios.',
      'error'
    );
  }

  return valid;
}


/* ============================================================
   RESUMO DO CHECKOUT
   ============================================================ */

function renderCheckoutSummary() {

  const box = document.getElementById(
    'checkout-summary-items'
  );

  const {
    subtotal,
    discount,
    shippingCost,
    total
  } = calcCartTotals();

  if (box) {

    box.innerHTML = getCart().map(item => {

      const p = getProductById(item.id);

      if (!p) return '';

      return `
        <div class="checkout-summary-item">
          <span>${item.qty}x ${p.name}</span>
          <span>${formatBRL(p.salePrice * item.qty)}</span>
        </div>
      `;

    }).join('');
  }

  const setText = (id, val) => {

    const el = document.getElementById(id);

    if (el) {
      el.textContent = val;
    }
  };

  setText(
    'checkout-subtotal',
    formatBRL(subtotal)
  );

  setText(
    'checkout-discount',
    `- ${formatBRL(discount)}`
  );

  setText(
    'checkout-shipping',
    formatBRL(shippingCost)
  );

  setText(
    'checkout-total',
    formatBRL(total)
  );

  const pixValue = +(total * 0.95).toFixed(2);

  setText(
    'pix-value',
    formatBRL(pixValue)
  );

  setText(
    'final-total',
    formatBRL(total)
  );
}


/* ============================================================
   MÁSCARAS
   ============================================================ */

function maskCPF(value) {

  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}


function maskCEP(value) {

  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}


function maskPhone(value) {

  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}


function maskCard(value) {

  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}


function initMasks() {

  const cpf = document.getElementById('cpf');

  if (cpf) {
    cpf.addEventListener('input', () => {
      cpf.value = maskCPF(cpf.value);
    });
  }

  const cep = document.getElementById('cep');

  if (cep) {
    cep.addEventListener('input', () => {
      cep.value = maskCEP(cep.value);
    });
  }

  const phone = document.getElementById('telefone');

  if (phone) {
    phone.addEventListener('input', () => {
      phone.value = maskPhone(phone.value);
    });
  }

  const card = document.getElementById('card-number');

  if (card) {
    card.addEventListener('input', () => {
      card.value = maskCard(card.value);
    });
  }
}


/* ============================================================
   PAGAMENTO
   ============================================================ */

function initPaymentToggle() {

  const radios = document.querySelectorAll(
    'input[name="payment-method"]'
  );

  radios.forEach(radio => {

    radio.addEventListener('change', () => {

      document
        .querySelectorAll('.payment-form')
        .forEach(form => {
          form.classList.remove('active');
        });

      const target = document.getElementById(
        `payment-${radio.value}`
      );

      if (target) {
        target.classList.add('active');
      }
    });

  });
}


/* ============================================================
   PIX
   ============================================================ */

function initPixCopy() {

  const btn = document.getElementById('copy-pix');

  if (!btn) return;

  btn.addEventListener('click', () => {

    const total = calcCartTotals().total;

    const fakeCode =
      '00020126580014BR.GOV.BCB.PIX' +
      '0136infinityparts-pix-demo' +
      '520400005303986540' +
      total.toFixed(2).replace('.', '') +
      '5802BR5913INFINITY PARTS6009SAO PAULO' +
      '62070503***6304ABCD';

    navigator.clipboard
      .writeText(fakeCode)
      .then(() => {

        showToast('Pix copiado!');

      })
      .catch(() => {

        showToast(
          'Não foi possível copiar. Copie manualmente.',
          'error'
        );

      });

  });
}


/* ============================================================
   CRIA PEDIDO NA API
   ============================================================ */

async function criarPedidoNaAPI(total) {

  console.log(
    '[Infinity Parts] Criando pedido na API...'
  );

  const pedido = {
    clienteId: CLIENTE_ID,
    statusPedidoId: STATUS_PEDIDO_ID,
    valorTotal: Number(total.toFixed(2))
  };

  console.log(
    '[Infinity Parts] Dados do pedido:',
    pedido
  );

  const response = await fetch(
    `${API_BASE_URL}/Pedido`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify(pedido)
    }
  );

  if (!response.ok) {

    const erro = await response.text();

    console.error(
      '[Infinity Parts] Erro ao criar pedido:',
      erro
    );

    throw new Error(
      `Erro ao criar pedido (${response.status})`
    );
  }

  const data = await response.json();

  console.log(
    '[Infinity Parts] Pedido criado:',
    data
  );

  return data;
}


/* ============================================================
   CRIA ITEM DO PEDIDO NA API
   ============================================================ */

async function criarItemPedidoNaAPI(
  pedidoId,
  produtoId,
  quantidade,
  precoUnitario
) {

  const itemPedido = {
    pedidoId: Number(pedidoId),
    produtoId: Number(produtoId),
    quantidade: Number(quantidade),
    precoUnitario: Number(precoUnitario.toFixed(2))
  };

  console.log(
    '[Infinity Parts] Criando item:',
    itemPedido
  );

  const response = await fetch(
    `${API_BASE_URL}/ItemPedido`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify(itemPedido)
    }
  );

  if (!response.ok) {

    const erro = await response.text();

    console.error(
      '[Infinity Parts] Erro ao criar item:',
      erro
    );

    throw new Error(
      `Erro ao criar item do pedido (${response.status})`
    );
  }

  const data = await response.json();

  console.log(
    '[Infinity Parts] Item criado:',
    data
  );

  return data;
}


/* ============================================================
   FINALIZAÇÃO DO PEDIDO
   ============================================================ */

async function finalizarPedido() {

  if (finalizandoPedido) {
    return;
  }

  const cart = getCart();

  if (!cart || cart.length === 0) {

    showToast(
      'Seu carrinho está vazio.',
      'error'
    );

    window.location.href = 'carrinho.html';

    return;
  }

  finalizandoPedido = true;

  const finishBtn = document.getElementById(
    'finish-order'
  );

  const textoOriginal = finishBtn
    ? finishBtn.innerHTML
    : '';

  try {

    if (finishBtn) {

      finishBtn.disabled = true;

      finishBtn.innerHTML =
        '<i class="bi bi-arrow-repeat spin"></i> PROCESSANDO PEDIDO...';
    }

    /*
     * Calcula o total exatamente como o resumo
     * do checkout.
     */
    const {
      total
    } = calcCartTotals();

    if (!Number.isFinite(total) || total <= 0) {

      throw new Error(
        'O valor total do pedido é inválido.'
      );
    }


    /* --------------------------------------------------------
       1. CRIA O PEDIDO
       -------------------------------------------------------- */

    const pedidoCriado =
      await criarPedidoNaAPI(total);


    /*
     * A API pode retornar diretamente:
     *
     * { id: 5, ... }
     *
     * Então pegamos o ID.
     */

    const pedidoId =
      pedidoCriado?.id ??
      pedidoCriado?.pedidoId ??
      pedidoCriado?.Id ??
      pedidoCriado?.PedidoId;


    if (!pedidoId) {

      console.error(
        '[Infinity Parts] Resposta da API:',
        pedidoCriado
      );

      throw new Error(
        'A API criou o pedido, mas não retornou o ID.'
      );
    }


    /* --------------------------------------------------------
       2. CRIA OS ITENS DO PEDIDO
       -------------------------------------------------------- */

    for (const item of cart) {

      const product =
        getProductById(item.id);

      if (!product) {

        throw new Error(
          `Produto ${item.id} não encontrado.`
        );
      }


      /*
       * O preço usado no ItemPedido é o preço
       * de venda que o Front está mostrando.
       */
      const precoUnitario =
        Number(product.salePrice);


      await criarItemPedidoNaAPI(
        pedidoId,
        item.id,
        item.qty,
        precoUnitario
      );
    }


    /* --------------------------------------------------------
       3. SUCESSO
       -------------------------------------------------------- */

    const orderNumber =
      'IP' + String(pedidoId).padStart(5, '0');


    const setText = (id, val) => {

      const el =
        document.getElementById(id);

      if (el) {
        el.textContent = val;
      }
    };


    setText(
      'order-number',
      orderNumber
    );


    /*
     * Só apagamos o carrinho DEPOIS de
     * Pedido + todos os ItemPedido
     * terem sido criados.
     */

    localStorage.removeItem(CART_KEY);

    sessionStorage.removeItem(
      'ip_coupon'
    );

    sessionStorage.removeItem(
      'ip_shipping'
    );

    updateCartCount();


    showToast(
      'Pedido realizado com sucesso!'
    );


    goToStep(4);


    console.log(
      '[Infinity Parts] PEDIDO FINALIZADO COM SUCESSO',
      {
        pedidoId,
        orderNumber
      }
    );

  } catch (error) {

    console.error(
      '[Infinity Parts] ERRO AO FINALIZAR PEDIDO:',
      error
    );


    showToast(
      'Não foi possível finalizar o pedido. Verifique a API.',
      'error'
    );


    /*
     * NÃO apagamos o carrinho em caso de erro.
     * Assim o usuário não perde os produtos.
     */

  } finally {

    finalizandoPedido = false;

    if (finishBtn) {

      finishBtn.disabled = false;

      finishBtn.innerHTML =
        textoOriginal;
    }
  }
}


/* ============================================================
   NAVEGAÇÃO ENTRE ETAPAS
   ============================================================ */

function initStepNavigation() {

  document
    .querySelectorAll('.btn-next-step')
    .forEach(btn => {

      btn.addEventListener('click', () => {

        if (
          validateStep(checkoutStep)
        ) {

          goToStep(
            checkoutStep + 1
          );

        }

      });

    });


  document
    .querySelectorAll('.btn-prev-step')
    .forEach(btn => {

      btn.addEventListener('click', () => {

        goToStep(
          checkoutStep - 1
        );

      });

    });


  const finishBtn =
    document.getElementById(
      'finish-order'
    );


  if (finishBtn) {

    finishBtn.addEventListener(
      'click',
      async () => {

        /*
         * Verifica novamente a última etapa
         * antes de enviar para a API.
         */

        if (
          !validateStep(checkoutStep)
        ) {
          return;
        }

        await finalizarPedido();

      }
    );

  }
}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    if (
      !document.querySelector(
        '.checkout-wrapper'
      )
    ) {
      return;
    }


    if (getCart().length === 0) {

      window.location.href =
        'carrinho.html';

      return;
    }


    /*
     * Aguarda os produtos da API.
     */

    await window.productsReadyPromise;


    renderCheckoutSummary();

    initMasks();

    initPaymentToggle();

    initPixCopy();

    initStepNavigation();

    goToStep(1);

  }
);