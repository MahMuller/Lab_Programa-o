/* ================================================================
   checkout.js — Processamento da compra com validações reforçadas
   TRABWILLEN — Confecções em Feltro
   ================================================================ */

let toastTimer;

/* Exibe uma notificação flutuante; usa alert() como fallback se o elemento de toast não existir */
function mostrarToast(msg, icone) {
    const toast = document.getElementById("toast");
    if (!toast) { alert(msg); return; }
    document.getElementById("toast-icon").textContent = icone || "✅";
    document.getElementById("toast-msg").textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

/* Guarda de acesso: só é possível finalizar a compra estando logado */
if (!usuario) {
    mostrarToast("Faça login para finalizar sua compra.", "🔒");
    setTimeout(() => { window.location.href = "index.html"; }, 1800);
}

/* Guarda de acesso: sem itens no carrinho não há o que finalizar */
if (!carrinho.length) {
    mostrarToast("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.", "🛒");
    setTimeout(() => { window.location.href = "index.html"; }, 1800);
}

/* Pré-preenche o nome com os dados da conta, quando disponível */
if (usuario) {
    document.getElementById("nome").value = usuario.nome;
}

/* Renderização do resumo do pedido a partir dos itens do carrinho */
const lista = document.getElementById("listaProdutos");

let subtotal = 0;

carrinho.forEach(produto => {

    subtotal += produto.preco * produto.qty;

    lista.innerHTML += `
    <div class="produto">
        <img src="${produto.imgs[0]}" alt="${produto.nome}">
        <div class="info">
            <h4>${produto.nome}</h4>
            <p>Quantidade: ${produto.qty}</p>
        </div>
        <div class="preco">
            R$ ${(produto.preco * produto.qty).toFixed(2)}
        </div>
    </div>
    `;
});

const frete = subtotal >= 150 ? 0 : 20;
const total = subtotal + frete;

document.getElementById("total").innerHTML = `
<div class="resumo">
<div class="linha">
<span>Subtotal</span>
<span>R$ ${subtotal.toFixed(2)}</span>
</div>
<div class="linha">
<span>Frete</span>
<span>${frete == 0 ? "Grátis 🎉" : "R$ " + frete.toFixed(2)}</span>
</div>
<div class="linha total">
<span>Total</span>
<span>R$ ${total.toFixed(2)}</span>
</div>
</div>
`;

/* Máscaras de digitação para telefone e CEP */

function maskTelefone(valor) {
    let v = valor.replace(/\D/g, "").slice(0, 11);

    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (v.length > 0) {
        v = v.replace(/^(\d*)/, "($1");
    }

    return v;
}

function maskCep(valor) {
    let v = valor.replace(/\D/g, "").slice(0, 8);

    if (v.length > 5) {
        v = v.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
    }

    return v;
}

const inputTelefone = document.getElementById("telefone");
const inputCep = document.getElementById("cep");
const inputNumero = document.getElementById("numero");

inputTelefone.addEventListener("input", () => {
    inputTelefone.value = maskTelefone(inputTelefone.value);
});

inputCep.addEventListener("input", () => {
    inputCep.value = maskCep(inputCep.value);
    agendarBuscaCep(inputCep.value);
});

/* Preenchimento automático de endereço a partir do CEP (API ViaCEP)
   Documentação: https://viacep.com.br
   Dispara a busca somente quando o CEP tem 8 dígitos, com um pequeno
   atraso (debounce) para não disparar uma requisição a cada tecla. */

let buscaCepTimer;

function agendarBuscaCep(valorCep) {
    clearTimeout(buscaCepTimer);

    const digitos = apenasDigitos(valorCep);
    if (digitos.length !== 8) {
        setStatusCep("");
        return;
    }

    buscaCepTimer = setTimeout(() => buscarEnderecoPorCep(digitos), 400);
}

function setStatusCep(estado) {
    const status = document.getElementById("cep-status");
    if (!status) return;
    status.className = "cep-status" + (estado ? " " + estado : "");
    status.textContent = estado === "ok" ? "✅" : estado === "erro" ? "⚠️" : "";
}

async function buscarEnderecoPorCep(cep) {
    setStatusCep("buscando");

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            setStatusCep("erro");
            setErro("cep", "CEP não encontrado.");
            return;
        }

        preencherCampo("endereco", dados.logradouro);
        preencherCampo("bairro", dados.bairro);
        preencherCampo("cidade", dados.localidade);

        setErro("cep", "");
        setStatusCep("ok");

        /* Se o logradouro já veio da API, o foco segue direto para o número */
        if (dados.logradouro) {
            document.getElementById("numero").focus();
        }

    } catch (erro) {
        /* Falha de rede: não bloqueia a compra, o cliente pode preencher manualmente */
        setStatusCep("erro");
        mostrarToast("Não foi possível buscar o CEP automaticamente. Preencha o endereço manualmente.", "⚠️");
    }
}

function preencherCampo(id, valor) {
    if (!valor) return;
    const campo = document.getElementById(id);
    campo.value = valor;
    campo.classList.add("preenchido-auto");
}

["endereco", "bairro", "cidade"].forEach((id) => {
    const campo = document.getElementById(id);
    campo.addEventListener("input", () => campo.classList.remove("preenchido-auto"));
});

/* número do endereço: apenas letras e dígitos (ex: 123, 45A) */
inputNumero.addEventListener("input", () => {
    inputNumero.value = inputNumero.value.replace(/[^0-9A-Za-zºª/-]/g, "");
});

/* Validação dos campos do formulário de entrega */

/* Expressões regulares usadas nas validações abaixo */
const REGEX_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
const REGEX_SOMENTE_LETRAS = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

function apenasDigitos(v) {
    return v.replace(/\D/g, "");
}

function setErro(idCampo, mensagem) {
    const campo = document.getElementById("campo-" + idCampo);
    const span = document.getElementById("erro-" + idCampo);

    if (mensagem) {
        if (campo) campo.classList.add("erro");
        if (span) span.textContent = mensagem;
        return false;
    }

    if (campo) campo.classList.remove("erro");
    if (span) span.textContent = "";
    return true;
}

function validarNome(valor) {
    if (!valor) return "Informe seu nome completo.";
    if (valor.length < 3) return "Nome muito curto.";
    if (valor.length > 60) return "Nome muito longo (máx. 60 caracteres).";
    if (!REGEX_NOME.test(valor)) return "Informe nome e sobrenome, somente letras.";
    return "";
}

function validarTelefone(valor) {
    const digitos = apenasDigitos(valor);
    if (!digitos) return "Informe um telefone para contato.";
    if (digitos.length < 10 || digitos.length > 11) {
        return "Telefone inválido. Use DDD + número (10 ou 11 dígitos).";
    }
    return "";
}

function validarCep(valor) {
    const digitos = apenasDigitos(valor);
    if (!digitos) return "Informe o CEP.";
    if (digitos.length !== 8) return "CEP inválido. Deve conter 8 dígitos.";
    return "";
}

function validarEndereco(valor) {
    if (!valor) return "Informe o endereço.";
    if (valor.length < 5) return "Endereço muito curto.";
    if (valor.length > 100) return "Endereço muito longo (máx. 100 caracteres).";
    return "";
}

function validarNumero(valor) {
    if (!valor) return "Informe o número.";
    if (valor.length > 10) return "Número muito longo (máx. 10 caracteres).";
    if (!/[0-9]/.test(valor)) return "O número deve conter ao menos um dígito.";
    return "";
}

function validarBairro(valor) {
    if (!valor) return "Informe o bairro.";
    if (valor.length < 2) return "Bairro muito curto.";
    if (valor.length > 50) return "Bairro muito longo (máx. 50 caracteres).";
    if (!REGEX_SOMENTE_LETRAS.test(valor)) return "Bairro deve conter apenas letras.";
    return "";
}

function validarCidade(valor) {
    if (!valor) return "Informe a cidade.";
    if (valor.length < 2) return "Cidade muito curta.";
    if (valor.length > 50) return "Cidade muito longa (máx. 50 caracteres).";
    if (!REGEX_SOMENTE_LETRAS.test(valor)) return "Cidade deve conter apenas letras.";
    return "";
}

/* Valida o formulário, registra o pedido em localStorage e segue para a confirmação */
function confirmarCompra() {

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const pagamento = document.getElementById("pagamento").value;

    let valido = true;

    valido = setErro("nome", validarNome(nome)) && valido;
    valido = setErro("telefone", validarTelefone(telefone)) && valido;
    valido = setErro("cep", validarCep(cep)) && valido;
    valido = setErro("endereco", validarEndereco(endereco)) && valido;
    valido = setErro("numero", validarNumero(numero)) && valido;
    valido = setErro("bairro", validarBairro(bairro)) && valido;
    valido = setErro("cidade", validarCidade(cidade)) && valido;

    if (!carrinho.length) {
        mostrarToast("Seu carrinho está vazio.", "🛒");
        setTimeout(() => { window.location.href = "index.html"; }, 1200);
        return;
    }

    if (!valido) {
        mostrarToast("⚠️ Verifique os campos destacados em vermelho.", "⚠️");
        const primeiroErro = document.querySelector(".campo.erro input");
        if (primeiroErro) primeiroErro.focus();
        return;
    }

    const btn = document.getElementById("btnConfirmar");
    btn.disabled = true;
    btn.textContent = "Processando...";

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const pedido = {
        numero: pedidos.length + 1,
        cliente: nome,
        emailCliente: usuario ? usuario.email : null,
        telefone: apenasDigitos(telefone),
        cep: apenasDigitos(cep),
        endereco,
        numeroCasa: numero,
        bairro,
        cidade,
        pagamento,
        status: "Confirmado",
        data: new Date().toLocaleString('pt-BR'),
        itens: carrinho,
        subtotal,
        frete,
        total
    };

    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
    localStorage.removeItem("carrinho");

    window.location.href = "processo.html";
}
