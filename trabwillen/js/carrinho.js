/* ================================================================
   carrinho.js — Cart Drawer completo com controle de quantidade
   TRABWILLEN — Confecções em Feltro
   ================================================================ */

let cart = JSON.parse(localStorage.getItem("carrinho")) || [];
let toastTimer;

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(cart));
}

/* Adiciona um item ao carrinho */
function adicionarCarrinho(id, qty = 1) {
    const p = PRODUTOS.find(x => x.id === id);
    if (!p) return;

    const it = cart.find(x => x.id === id);

    if (it) {
        it.qty += qty;
    } else {
        cart.push({ ...p, qty });
    }

    salvarCarrinho();
    atualizarBadge();
    mostrarToast("✅ " + p.nome + " adicionado!");
    renderCart();
}

/* Remove um item do carrinho */
function removerCarrinho(id) {
    cart = cart.filter(x => x.id !== id);

    salvarCarrinho();
    atualizarBadge();
    renderCart();
}

/* Atualiza a quantidade de um item */
function mudarQty(id, d) {

    const it = cart.find(x => x.id === id);

    if (!it) return;

    it.qty += d;

    if (it.qty <= 0) {
        removerCarrinho(id);
        return;
    }

    salvarCarrinho();
    atualizarBadge();
    renderCart();
}

/* Contador de itens exibido no ícone do carrinho */
function atualizarBadge() {
    const n = cart.reduce((s, i) => s + i.qty, 0);

    document.getElementById("cart-badge").textContent = n;
}

/* Renderiza os itens do carrinho no painel lateral */
function renderCart() {

    const body = document.getElementById("cart-body");
    const foot = document.getElementById("cart-foot");

    if (!cart.length) {

        body.innerHTML = `
            <div class="cart-empty">
                <div class="ce">🛒</div>
                <p>Seu carrinho está vazio.<br>Explore nossa coleção!</p>
            </div>
        `;

        if (foot) foot.style.display = "none";

        return;
    }

    body.innerHTML = cart.map(i => `
        <div class="cart-item">

            <div class="ci-img">
                <img src="${i.imgs[0]}" alt="${i.nome}">
            </div>

            <div class="ci-info">

                <div class="ci-nome">${i.nome}</div>

                <div class="ci-preco">
                    R$ ${(i.preco * i.qty).toFixed(2)}
                </div>

                <div class="ci-qty">

                    <button class="qty-btn"
                        onclick="mudarQty('${i.id}',-1)">−</button>

                    <span class="qty-n">${i.qty}</span>

                    <button class="qty-btn"
                        onclick="mudarQty('${i.id}',1)">+</button>

                </div>

            </div>

            <button class="ci-rm"
                onclick="removerCarrinho('${i.id}')">
                🗑
            </button>

        </div>
    `).join("");

    const total = cart.reduce((s, i) => s + i.preco * i.qty, 0);

    document.getElementById("cart-total-val").textContent =
        "R$ " + total.toFixed(2);

    if (foot) foot.style.display = "block";
}

/* Abre o painel lateral do carrinho */
function abrirCarrinho() {

    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("drawer-overlay").classList.add("open");

    renderCart();
}

/* Fecha o painel lateral do carrinho */
function fecharCarrinho() {

    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("drawer-overlay").classList.remove("open");
}

/* Exibe uma notificação flutuante */
function mostrarToast(msg) {

    const toast = document.getElementById("toast");

    document.getElementById("toast-msg").textContent = msg;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2800);
}

/* Inicialização ao carregar a página */
window.addEventListener("load", () => {

    atualizarBadge();

    renderCart();

});

/* Valida o carrinho e a sessão do usuário antes de seguir para o checkout */
function irParaCheckout() {

    if (cart.length === 0) {
        mostrarToast("🛒 Seu carrinho está vazio.");
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        mostrarToast("Faça login para continuar.");
        abrirModal("login");
        return;
    }

    window.location.href = "checkout.html";

}