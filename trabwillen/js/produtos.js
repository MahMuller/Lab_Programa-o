/* ================================================================
   produtos.js — Renderização, filtragem e ordenação dos produtos
   TRABWILLEN — Confecções em Feltro
   Depende de: dados.js, carrinho.js
   ================================================================ */

let catAtiva = 'todos';

/* Favoritos: persistidos por usuário logado */
function usuarioAtualProdutos() {
  return JSON.parse(localStorage.getItem('usuarioLogado'));
}
function getFavoritosMap() {
  return JSON.parse(localStorage.getItem('favoritos')) || {};
}
function getFavoritosDoUsuario() {
  const usuario = usuarioAtualProdutos();
  if (!usuario) return [];
  const mapa = getFavoritosMap();
  return mapa[usuario.email] || [];
}
function isFavorito(id) {
  return getFavoritosDoUsuario().includes(id);
}

/* Troca a foto exibida no card ao passar o mouse */
function iniciarHover(card, imgs) {
  if (imgs.length < 2) return;
  card.addEventListener('mouseenter', () => {
    card.querySelector('.card-img-foto').src = imgs[1];
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.card-img-foto').src = imgs[0];
  });
}

/* Gera a exibição de estrelas de avaliação */
function gerarEstrelas(av) {
  const cheia  = Math.floor(av);
  const vazia  = 5 - cheia;
  return '<span class="stars">' + '★'.repeat(cheia) + '☆'.repeat(vazia) + '</span>';
}

/* Aplica busca, categoria, preço e ordenação, e redesenha a grade de produtos */
function renderProdutos() {
  const busca   = (document.getElementById('search-input')?.value || '').toLowerCase();
  const ordem   = document.getElementById('f-ordem').value;
  const maxPreco = parseFloat(document.getElementById('f-preco').value) || Infinity;

  let lista = [...PRODUTOS];

  if (catAtiva !== 'todos') lista = lista.filter(p => p.cat === catAtiva);
  if (busca)                lista = lista.filter(p =>
    p.nome.toLowerCase().includes(busca) ||
    p.desc.toLowerCase().includes(busca) ||
    p.cat.toLowerCase().includes(busca)
  );
  lista = lista.filter(p => p.preco <= maxPreco);

  if (ordem === 'mn') lista.sort((a, b) => a.preco - b.preco);
  if (ordem === 'mx') lista.sort((a, b) => b.preco - a.preco);
  if (ordem === 'av') lista.sort((a, b) => b.avaliacao - a.avaliacao);

  const contEl = document.getElementById('contagem');
  if (contEl) contEl.textContent = `${lista.length} produto${lista.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById('produtos-grid');

  if (!lista.length) {
    grid.innerHTML = `
      <div class="vazio">
        <div class="ei">🔍</div>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente ajustar os filtros ou a busca.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(p => `
    <div class="card-produto" data-id="${p.id}">
      ${p.badge ? `<div class="card-badge ${p.badgeClass}">${p.badge}</div>` : ''}
      <button class="card-fav ${isFavorito(p.id) ? 'ativo' : ''}" onclick="event.stopPropagation();favToggle(this,'${p.id}')" title="Favoritar">${isFavorito(p.id) ? '❤️' : '🤍'}</button>
      <div class="card-img">
        <img class="card-img-foto"
             src="${p.imgs[0]}"
             alt="${p.nome}"
             loading="lazy" />
      </div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-nome">${p.nome}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-stars">
          ${gerarEstrelas(p.avaliacao)} ${p.avaliacao} <span style="color:var(--cor-borda-input)">(${p.numAv})</span>
        </div>
        <div class="card-rodape">
          <div class="card-preco">
            R$ ${p.preco.toFixed(2)}
            <small>3x de R$ ${(p.preco / 3).toFixed(2)} s/ juros</small>
          </div>
          <button class="btn-add-card" onclick="event.stopPropagation();adicionarCarrinho('${p.id}')">
            + Carrinho
          </button>
        </div>
      </div>
    </div>
  `).join('');

  /* Clique no card abre modal; hover troca foto */
  lista.forEach(p => {
    const card = grid.querySelector(`[data-id="${p.id}"]`);
    if (!card) return;
    card.addEventListener('click', () => abrirModalProduto(p.id));
    iniciarHover(card, p.imgs);
  });
}

/* Adiciona ou remove um produto dos favoritos */
function favToggle(btn, id) {
  const usuario = usuarioAtualProdutos();

  if (!usuario) {
    mostrarToast('Faça login para favoritar produtos.');
    abrirModal('login');
    return;
  }

  const mapa = getFavoritosMap();
  const lista = mapa[usuario.email] || [];
  const idx = lista.indexOf(id);
  const produto = PRODUTOS.find(p => p.id === id);

  if (idx > -1) {
    lista.splice(idx, 1);
    btn.textContent = '🤍';
    btn.classList.remove('ativo');
    mostrarToast('💔 ' + (produto ? produto.nome : 'Produto') + ' removido dos favoritos.');
  } else {
    lista.push(id);
    btn.textContent = '❤️';
    btn.classList.add('ativo');
    mostrarToast('❤️ ' + (produto ? produto.nome : 'Produto') + ' adicionado aos favoritos!');
  }

  mapa[usuario.email] = lista;
  localStorage.setItem('favoritos', JSON.stringify(mapa));
}

/* Restaura busca, categoria, preço e ordenação para os valores padrão */
function limparFiltros() {
  document.getElementById('f-ordem').value = 'rel';
  document.getElementById('f-preco').value = '';
  const si = document.getElementById('search-input');
  if (si) si.value = '';
  catAtiva = 'todos';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('ativo'));
  document.querySelector('.cat-btn[data-cat="todos"]').classList.add('ativo');
  renderProdutos();
}

/* Listener dos botões de categoria */
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('ativo'));
    this.classList.add('ativo');
    catAtiva = this.dataset.cat;
    renderProdutos();
  });
});

/* Renderiza ao carregar */
renderProdutos();
