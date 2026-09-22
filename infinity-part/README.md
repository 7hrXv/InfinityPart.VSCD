# Infinity Parts — E-commerce de Hardware

Loja virtual completa (front-end) especializada em peças, componentes e periféricos para computadores, desenvolvida com **HTML5, CSS3 e JavaScript puro** (com Bootstrap Icons para os ícones).

## Como executar o projeto no VS Code

1. Extraia o arquivo `.zip` e abra a pasta `infinity-parts` no VS Code.
2. Instale a extensão **Live Server** (autor: Ritwick Dey), caso ainda não tenha.
3. Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.
   - Alternativamente, abra `index.html` diretamente no navegador (algumas funções de `fetch`/módulos não são necessárias aqui, então isso também funciona).
4. Navegue pela loja normalmente: Home → Catálogo → Produto → Carrinho → Checkout.

Não é necessário instalar dependências (`npm install`), pois o projeto não utiliza build tools nem frameworks pesados — apenas arquivos estáticos.

## Estrutura do projeto

```
infinity-parts/
├── index.html          → Página inicial (hero, banners, categorias, destaques)
├── produtos.html        → Catálogo com filtros, busca e ordenação
├── produto.html         → Página de detalhes do produto (usa ?id=)
├── carrinho.html         → Carrinho de compras (localStorage)
├── checkout.html        → Checkout em etapas (identificação → entrega → pagamento → confirmação)
├── login.html            → Login
├── cadastro.html         → Cadastro de novo cliente
├── minha-conta.html      → Dashboard do cliente (pedidos, dados, endereços, segurança)
├── favoritos.html        → Produtos favoritados (localStorage)
├── suporte.html          → Central de suporte e formulário de contato
│
├── css/
│   ├── style.css         → Base, tipografia, header, footer, hero, seções
│   ├── components.css    → Cards, badges, forms, tabs, toasts, carrinho, checkout
│   └── responsive.css    → Breakpoints (1920 → 320px)
│
├── js/
│   ├── main.js           → Header, busca, menu mobile, favoritos, toasts, WhatsApp
│   ├── products.js       → Base de dados de produtos (28 itens) + helpers de preço
│   ├── cart.js            → Carrinho, cupons, frete simulado (localStorage)
│   ├── filters.js         → Filtros e ordenação do catálogo
│   ├── checkout.js        → Etapas do checkout, máscaras, Pix fictício
│   └── account.js         → Login/cadastro (validação), minha conta, favoritos
│
├── assets/
│   ├── products/          → Ilustrações SVG geradas para cada produto
│   ├── icons/              → Favicon
│   ├── images/ e banners/ → Reservados para imagens adicionais
│
└── README.md
```

## Conectando à sua API / app desktop

O catálogo agora tenta carregar os produtos de uma API antes de usar os
dados de demonstração. Isso é configurado em um único lugar:
`js/products.js`, logo após o array `FALLBACK_PRODUCTS`, no objeto
`API_CONFIG`:

```js
const API_CONFIG = {
  useApi: true,                          // false = sempre usar o catálogo de demonstração
  baseUrl: "http://localhost:5000/api",  // <-- troque pela URL real da sua API
  productsPath: "/products",             // GET {baseUrl}{productsPath}
  ...
};
```

O site faz `GET {baseUrl}{productsPath}` esperando um **array JSON**, onde
cada item segue o mesmo formato dos produtos de demonstração (`id`, `name`,
`brand`, `category`, `price`, `salePrice`, `stock`, `rating`, `reviews`,
`image`, `badges`, `sku`, `desc`, `specs` — o comentário no topo do arquivo
mostra um exemplo completo). O campo `image` aceita tanto uma URL completa
quanto um caminho relativo.

Se a API não responder (fora do ar, CORS bloqueado, formato diferente do
esperado), o site cai automaticamente para o catálogo de demonstração local
e avisa isso discretamente via toast — nada quebra. Assim dá pra continuar
desenvolvendo o site e a API em paralelo.

**Importante:** como o site (arquivos estáticos) e a API rodam em
endereços diferentes, é preciso habilitar CORS na API para a origem de
onde o site é servido, senão o navegador bloqueia a requisição.

O app desktop (Forms) e este site passam a ser dois clientes da mesma API —
o desktop cadastra/edita produtos via `HttpClient`, e este site apenas lê
(`GET`) e exibe.

## Funcionalidades implementadas

- Identidade visual com o símbolo do infinito vermelho extraído do banner oficial, usado como logo (header, footer e favicon) e como imagem de fundo do hero, com gradiente suave até a cor de fundo
- Catálogo com **161 produtos**: pelo menos 10 itens em cada uma das 15 categorias de peças, mais uma linha exclusiva de **PCs Montados**
- Fotos reais de produto aplicadas aos itens correspondentes (GPUs, CPUs, placas-mãe, memórias, SSD, HD, fonte, cooler, headset, monitores, teclado); ícones vetoriais em estilo "foto de produto" (fundo claro) criados para os demais itens, mantendo o catálogo visualmente consistente
- Carrossel "PCs Montados" na Home com pelo menos 10 configurações completas, imagem, especificações resumidas, preço e botão de compra integrado ao carrinho
- Busca com sugestões em tempo real (nome, categoria, marca, descrição)
- Catálogo com filtros combináveis (categoria, marca, faixa de preço) e ordenação
- Painel de filtros em formato de gaveta no mobile
- Cálculo automático de desconto, preço no Pix (5% OFF) e parcelamento
- Carrinho persistente via `localStorage` (sobrevive a atualizações de página)
- Cupons de desconto funcionais: `INFINITY10`, `GANHE10`, `PARTS5`
- Cálculo de frete simulado por CEP (PAC / SEDEX / Transportadora), pronto para integração futura com uma API real
- Checkout em 4 etapas com validação de formulário e máscaras (CPF, CEP, telefone, cartão)
- Simulação de pagamento via Pix com QR Code fictício e botão "copiar código"
- Sistema de favoritos persistente via `localStorage`
- Login e cadastro com validação de campos no front-end
- Dashboard "Minha Conta" com pedidos fictícios
- Sistema de avaliações com distribuição de estrelas
- Badges de produto: OFERTA, NOVO, MAIS VENDIDO, OPEN BOX, ÚLTIMAS UNIDADES, ESGOTADO
- Toasts de feedback para as principais ações
- Botão flutuante do WhatsApp com mensagem automática
- Totalmente responsivo (320px → 1920px)

## Próximos passos sugeridos (produção)

- Substituir o Pix fictício e o frete simulado por integrações reais (gateway de pagamento e API de frete/Correios).
- Conectar o catálogo (`products.js`) a uma API/backend real em vez de dados estáticos.
- Adicionar autenticação real (hoje o login/cadastro é simulado no front-end).
- Otimizar imagens de produto (atualmente SVGs ilustrativos).

---
© 2026 Infinity Parts. Projeto desenvolvido para fins de demonstração.
