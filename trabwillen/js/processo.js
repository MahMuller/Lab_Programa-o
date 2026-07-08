/* ================================================================
   processo.js — Tela de confirmação de pedido
   TRABWILLEN — Confecções em Feltro
   Depende de: um pedido salvo em localStorage["ultimoPedido"]
                (gerado por checkout.js ao confirmar a compra)
   ================================================================ */

const pedido = JSON.parse(localStorage.getItem("ultimoPedido"));

/* Sem pedido registrado, não há o que exibir: volta para a loja */
if (!pedido) {
    window.location.href = "index.html";
}

document.getElementById("pedidoNumero").textContent = "#" + pedido.numero;
document.getElementById("cliente").textContent = pedido.cliente;
document.getElementById("pagamento").textContent = pedido.pagamento;
document.getElementById("total").textContent = "R$ " + pedido.total.toFixed(2);
document.getElementById("data").textContent = pedido.data;
document.getElementById("endereco").textContent =
    pedido.endereco + ", " + pedido.numeroCasa + " - " + pedido.bairro + " - " + pedido.cidade;

function voltarLoja() {
    window.location.href = "index.html";
}
