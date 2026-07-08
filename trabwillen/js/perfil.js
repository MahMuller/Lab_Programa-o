/* ================================================================
   perfil.js — Lógica da página "Minha Conta"
   TRABWILLEN — Confecções em Feltro
   Depende de: dados.js, carrinho.js, modal.js
   ================================================================ */

/* Formata um valor numérico como moeda brasileira (R$ 0,00) */
function formatarMoeda(v) {
  return "R$ " + Number(v || 0).toFixed(2).replace(".", ",");
}

/* Inicialização da página de perfil */
function initPerfil() {
  const bloqueado = document.getElementById("perfil-bloqueado");
  const conteudo = document.getElementById("perfil-conteudo");
  if (!bloqueado || !conteudo) return; // só executa na página de perfil

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario) {
    bloqueado.classList.add("visivel");
    conteudo.classList.remove("visivel");
    return;
  }

  bloqueado.classList.remove("visivel");
  conteudo.classList.add("visivel");

  renderDadosPessoais(usuario);
  const pedidos = renderCompras(usuario);
  const encomendas = renderEncomendas(usuario);
  const favoritos = renderFavoritos(usuario);

  document.getElementById("pf-n-compras").textContent = pedidos.length;
  document.getElementById("pf-n-encomendas").textContent = encomendas.length;
  document.getElementById("pf-n-favoritos").textContent = favoritos.length;
}

/* Navegação por abas */
function trocarAbaPerfil(aba) {
  document.querySelectorAll(".pf-tab-btn").forEach(b => b.classList.remove("ativo"));
  document.querySelectorAll(".pf-painel").forEach(p => p.classList.remove("ativo"));
  document.getElementById("pf-tab-" + aba).classList.add("ativo");
  document.getElementById("painel-" + aba).classList.add("ativo");
}

/* Renderização dos dados pessoais */
function renderDadosPessoais(usuario) {
  document.getElementById("pf-nome-topo").textContent = usuario.nome;
  document.getElementById("pf-email-topo").textContent = usuario.email;
  document.getElementById("pf-nome").textContent = usuario.nome;
  document.getElementById("pf-email").textContent = usuario.email;
  document.getElementById("pf-avatar").textContent = usuario.nome.trim().charAt(0);

  const pedidos = (JSON.parse(localStorage.getItem("pedidos")) || [])
    .filter(p => p.emailCliente === usuario.email);

  if (pedidos.length) {
    const ultimo = pedidos[pedidos.length - 1];
    document.getElementById("pf-ultimo-endereco").textContent =
      `${ultimo.endereco}, ${ultimo.numeroCasa} — ${ultimo.bairro}, ${ultimo.cidade}`;
    document.getElementById("pf-ultimo-telefone").textContent =
      ultimo.telefone || "—";
  }
}

/* Renderização do histórico de compras */
function renderCompras(usuario) {
  const todos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const pedidos = todos.filter(p => p.emailCliente === usuario.email);
  const box = document.getElementById("lista-compras");

  if (!pedidos.length) {
    box.innerHTML = `
      <div class="pf-vazio">
        <div class="pv-icone">🧾</div>
        <h4>Você ainda não fez nenhuma compra</h4>
        <p>Explore nossa coleção e encontre a peça perfeita em feltro.</p>
        <a href="index.html#produtos-section">Ver produtos</a>
      </div>`;
    return pedidos;
  }

  box.innerHTML = pedidos.slice().reverse().map(p => `
    <div class="pedido-card">
      <div class="pedido-head">
        <span class="ped-num">Pedido #${p.numero}</span>
        <span class="status-pill">${p.status || "Confirmado"}</span>
      </div>
      <div class="ped-data">${p.data}</div>
      <div class="pedido-itens">
        ${p.itens.map(i => `
          <div class="pedido-item-linha">
            <span><b>${i.qty}x</b> ${i.nome}</span>
            <span>${formatarMoeda(i.preco * i.qty)}</span>
          </div>
        `).join("")}
      </div>
      <div class="pedido-rodape">
        <div class="pedido-endereco">
          📍 ${p.endereco}, ${p.numeroCasa} — ${p.bairro}, ${p.cidade} (CEP ${p.cep})
        </div>
        <div>
          <div class="pedido-total">${formatarMoeda(p.total)}</div>
          <div class="pedido-pagamento">${p.pagamento}</div>
        </div>
      </div>
    </div>
  `).join("");

  return pedidos;
}

/* Renderização das encomendas personalizadas */
function renderEncomendas(usuario) {
  const todas = JSON.parse(localStorage.getItem("encomendas")) || [];
  const encomendas = todas.filter(e => e.emailCliente === usuario.email);
  const box = document.getElementById("lista-encomendas");

  if (!encomendas.length) {
    box.innerHTML = `
      <div class="pf-vazio">
        <div class="pv-icone">✉️</div>
        <h4>Nenhuma encomenda personalizada ainda</h4>
        <p>Quer algo feito sob medida? Envie os detalhes da sua ideia.</p>
        <a href="index.html#enc-form-sec">Fazer encomenda</a>
      </div>`;
    return encomendas;
  }

  box.innerHTML = encomendas.slice().reverse().map(e => `
    <div class="encomenda-card">
      <div class="encomenda-head">
        <span class="enc-tipo">${e.tipo}</span>
        <span class="status-pill recebida">${e.status || "Recebida"}</span>
      </div>
      <div class="enc-data">Enviada em ${e.dataEnvio}</div>
      <p class="encomenda-desc">${e.descricao}</p>
      <div class="encomenda-meta">
        <span>📱 <b>${e.whatsapp}</b></span>
        <span>🎉 Ocasião: <b>${e.data}</b></span>
      </div>
    </div>
  `).join("");

  return encomendas;
}

/* Renderização dos produtos favoritos */
function renderFavoritos(usuario) {
  const mapa = JSON.parse(localStorage.getItem("favoritos")) || {};
  const ids = mapa[usuario.email] || [];
  const produtos = ids.map(id => PRODUTOS.find(p => p.id === id)).filter(Boolean);
  const grid = document.getElementById("grid-favoritos");

  if (!produtos.length) {
    grid.innerHTML = `
      <div class="pf-vazio" style="grid-column:1/-1">
        <div class="pv-icone">❤️</div>
        <h4>Você ainda não favoritou nenhum produto</h4>
        <p>Toque no coração dos produtos que você mais gostar para vê-los aqui.</p>
        <a href="index.html#produtos-section">Ver produtos</a>
      </div>`;
    return produtos;
  }

  grid.innerHTML = produtos.map(p => `
    <div class="card-produto" data-id="${p.id}">
      <button class="fav-remover" onclick="event.stopPropagation();removerFavoritoPerfil('${p.id}')" title="Remover dos favoritos">❤️</button>
      <div class="card-img">
        <img class="card-img-foto" src="${p.imgs[0]}" alt="${p.nome}" loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-nome">${p.nome}</div>
        <div class="card-rodape">
          <div class="card-preco">${formatarMoeda(p.preco)}</div>
          <button class="btn-add-card" onclick="event.stopPropagation();adicionarCarrinho('${p.id}')">+ Carrinho</button>
        </div>
      </div>
    </div>
  `).join("");

  produtos.forEach(p => {
    const card = grid.querySelector(`[data-id="${p.id}"]`);
    if (card) card.addEventListener("click", () => abrirModalProduto(p.id));
  });

  return produtos;
}

/* Remove um produto da lista de favoritos do usuário logado */
function removerFavoritoPerfil(id) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  const mapa = JSON.parse(localStorage.getItem("favoritos")) || {};
  const lista = (mapa[usuario.email] || []).filter(x => x !== id);
  mapa[usuario.email] = lista;
  localStorage.setItem("favoritos", JSON.stringify(mapa));

  mostrarToast("💔 Produto removido dos favoritos.");
  initPerfil();
}

window.addEventListener("load", initPerfil);
