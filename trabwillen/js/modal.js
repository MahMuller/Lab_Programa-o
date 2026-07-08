/* ================================================================
   modal.js — Modal de login/cadastro, modal de produto e
              sincronização do estado de sessão no cabeçalho
   TRABWILLEN — Confecções em Feltro
   ================================================================ */

/* Modal de login e cadastro */

function abrirModal(aba) {
  document.getElementById('modal-overlay').classList.add('aberto');
  trocarTab(aba || 'login');
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('aberto');
}

function fecharModalFora(e) {
  if (e.target === document.getElementById('modal-overlay')) fecharModal();
}

/* Alterna entre as abas "Entrar" e "Cadastrar", limpando erros e mensagens anteriores */
function trocarTab(aba) {
  document.getElementById('tab-login').classList.toggle('ativo',    aba === 'login');
  document.getElementById('tab-cadastro').classList.toggle('ativo', aba === 'cadastro');
  document.getElementById('painel-login').classList.toggle('ativo',    aba === 'login');
  document.getElementById('painel-cadastro').classList.toggle('ativo', aba === 'cadastro');
  document.querySelectorAll('.msg-erro').forEach(el => el.textContent = '');
  document.querySelectorAll('.campo-grupo input').forEach(el => el.classList.remove('erro'));
  document.querySelectorAll('.alerta-sucesso').forEach(el => el.classList.remove('visivel'));
}

/* Marca ou limpa o estado de erro visual de um campo do formulário */
function setErro(id, msg) {
  const input = document.getElementById(id);
  const span  = document.getElementById('erro-' + id);
  if (msg) { input.classList.add('erro'); span.textContent = msg; return false; }
  input.classList.remove('erro'); span.textContent = ''; return true;
}

function emailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* Autentica o usuário contra a lista de contas salva em localStorage */
function validarLogin() {

  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  let ok = true;

  ok = setErro('login-email',
      !email ? 'Informe o e-mail.' :
      !emailValido(email) ? 'E-mail inválido.' : '') && ok;

  ok = setErro('login-senha',
      !senha ? 'Informe a senha.' : '') && ok;

  if (!ok) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = usuarios.find(
      u => u.email === email && u.senha === senha
  );

  if (!usuario) {
      setErro("login-email", "E-mail ou senha incorretos.");
      return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  document.getElementById('ok-login').classList.add('visivel');

  mostrarToast("✅ Bem-vindo(a), " + usuario.nome + "!");

  setTimeout(() => {
      fecharModal();
      atualizarUsuarioLogado();
  }, 1200);
}

/* Cria uma nova conta e persiste na lista de usuários em localStorage */
function validarCadastro() {
  const nome     = document.getElementById('cad-nome').value.trim();
  const email    = document.getElementById('cad-email').value.trim();
  const senha    = document.getElementById('cad-senha').value;
  const confirma = document.getElementById('cad-confirma').value;

  let ok = true;

  ok = setErro('cad-nome', !nome ? 'Informe seu nome.' : '') && ok;
  ok = setErro('cad-email', !email ? 'Informe o e-mail.' : !emailValido(email) ? 'E-mail inválido.' : '') && ok;
  ok = setErro('cad-senha', !senha ? 'Crie uma senha.' : senha.length < 6 ? 'Mínimo 6 caracteres.' : '') && ok;
  ok = setErro('cad-confirma', !confirma ? 'Confirme a senha.' : confirma !== senha ? 'Senhas não coincidem.' : '') && ok;

  if (!ok) return;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existe = usuarios.find(u => u.email === email);

  if (existe) {
    setErro("cad-email", "Este e-mail já está cadastrado.");
    return;
  }

  usuarios.push({
    nome: nome,
    email: email,
    senha: senha
  });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  document.getElementById('ok-cadastro').classList.add('visivel');

  mostrarToast('✅ Conta criada com sucesso!');

  setTimeout(() => {
    trocarTab("login");
  }, 1500);
}

/* Modal de detalhes do produto */

let prodQtyModal = 1;

/* Monta e exibe o modal com os detalhes de um produto */
function abrirModalProduto(id) {
  const p = PRODUTOS.find(x => x.id === id);
  if (!p) return;
  prodQtyModal = 1;
  const estrelas = '★'.repeat(Math.floor(p.avaliacao)) + '☆'.repeat(5 - Math.floor(p.avaliacao));
  document.getElementById('pm-content').innerHTML = `
    <button class="pm-close" onclick="fecharModalProduto()">✕</button>
    <div class="pm-head">
      <div class="pm-img">
        <img src="${p.imgs[0]}" alt="${p.nome}" />
      </div>
      <div class="pm-body">
        <div class="pm-cat">${p.cat}</div>
        <div class="pm-nome">${p.nome}</div>
        <div class="pm-stars">
          <span class="stars">${estrelas}</span> ${p.avaliacao} · ${p.numAv} avaliações
        </div>
        <div class="pm-desc">${p.desc}</div>
        <div class="pm-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="pm-preco">
          R$ ${p.preco.toFixed(2)}
          <small>ou 3x de R$ ${(p.preco / 3).toFixed(2)} sem juros</small>
        </div>
        <div class="pm-qty">
          <label>Quantidade</label>
          <button class="mq-btn" onclick="ajustarQtyModal(-1)">−</button>
          <span class="mq-n" id="mq-n">1</span>
          <button class="mq-btn" onclick="ajustarQtyModal(1)">+</button>
        </div>
        <div class="pm-btns">
          <button class="btn-pm-add" onclick="adicionarCarrinho('${id}', prodQtyModal); fecharModalProduto()">
            🛒 Adicionar ao carrinho
          </button>
          <button class="btn-pm-enc" onclick="irParaEncomenda(); fecharModalProduto()">
            ✉️ Encomendar
          </button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('prod-modal-overlay').classList.add('open');
}

function fecharModalProduto() {
  document.getElementById('prod-modal-overlay').classList.remove('open');
}

function ajustarQtyModal(d) {
  prodQtyModal = Math.max(1, prodQtyModal + d);
  document.getElementById('mq-n').textContent = prodQtyModal;
}

/* Fecha o modal de produto ao clicar fora da caixa de conteúdo */
document.getElementById('prod-modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) fecharModalProduto();
});

/* Sessão do usuário: sincroniza cabeçalho e menu mobile com o estado de login */

/* Atualiza os elementos de conta no cabeçalho conforme o usuário estiver logado ou não */
function atualizarUsuarioLogado() {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const contaWrap = document.getElementById("conta-wrap");
    const contaWrapMobile = document.getElementById("conta-wrap-mobile");
    const navPerfil = document.getElementById("nav-perfil-item");
    const navPerfilMobile = document.getElementById("nav-perfil-item-mobile");

    if (usuario) {

        if (contaWrap) {
            contaWrap.innerHTML =
                '<a class="btn-perfil" href="perfil.html" title="Ver meu perfil">👤 ' + usuario.nome + '</a>' +
                '<button class="btn-sair" onclick="sairConta()">Sair</button>';
        }

        if (contaWrapMobile) {
            contaWrapMobile.innerHTML =
                '<a href="perfil.html">👤 Minha conta (' + usuario.nome + ')</a>' +
                '<a href="#" onclick="sairConta()">Sair</a>';
        }

        if (navPerfil) navPerfil.style.display = "";
        if (navPerfilMobile) navPerfilMobile.style.display = "";

    } else {

        if (contaWrap) {
            contaWrap.innerHTML = '<button class="btn-login" id="btn-login" onclick="abrirModal(\'login\')">Entrar</button>';
        }

        if (contaWrapMobile) {
            contaWrapMobile.innerHTML = '<a href="#" onclick="abrirModal(\'login\')">Entrar / Cadastrar</a>';
        }

        if (navPerfil) navPerfil.style.display = "none";
        if (navPerfilMobile) navPerfilMobile.style.display = "none";

    }

    /* Se a página de perfil estiver carregada, atualiza seu conteúdo também */
    if (typeof initPerfil === "function") initPerfil();

}

/* Encerra a sessão do usuário e atualiza a interface */
function sairConta() {

    localStorage.removeItem("usuarioLogado");

    atualizarUsuarioLogado();

    mostrarToast("👋 Você saiu da sua conta.");

}

/* Canais de contato externo (WhatsApp e Instagram) */

function abrirWhatsapp() {

    const telefone = "5549991996992";

    const mensagem =
        "Olá! Vim pelo site da Trabwillen e gostaria de um orçamento.";

    window.open(
        `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`,
        "_blank"
    );

}

function abrirInstagram() {

    window.open(
        "https://www.instagram.com/nanedaluz.atelier?igsh=cnh2aDkzNTl6NXcx",
        "_blank"
    );

}

window.addEventListener("load", atualizarUsuarioLogado);
