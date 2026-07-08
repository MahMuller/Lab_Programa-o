/* ================================================================
   menu.js — Menu mobile, carrossel encomendas, helpers de navegação
   TRABWILLEN — Confecções em Feltro
   ================================================================ */

/* Controle do menu mobile (hambúrguer) */
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('aberto');
}

/* Controle do carrossel de peças sob encomenda */
let cPos = 0;
function slideCarrossel(d) {
  const track = document.getElementById('c-track');
  if (!track) return;
  const cards = track.querySelectorAll('.ecard');
  if (!cards.length) return;
  const w = cards[0].offsetWidth + 14;
  const maxP = Math.max(0, cards.length - 3);
  cPos = Math.max(0, Math.min(maxP, cPos + d));
  track.style.transform = `translateX(-${cPos * w}px)`;
}

/* Rola a página suavemente até o formulário de encomenda */
function irParaEncomenda() {
  const el = document.getElementById('enc-form-sec');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* Marca ou limpa o estado de erro visual de um campo do formulário de encomenda */
function setErroEnc(id, msg) {
  const input = document.getElementById(id);
  const span = document.getElementById('erro-' + id);
  if (!input) return true;
  if (msg) {
    input.classList.add('erro');
    if (span) span.textContent = msg;
    return false;
  }
  input.classList.remove('erro');
  if (span) span.textContent = '';
  return true;
}

/* Valida e registra um pedido de encomenda personalizada em localStorage */
function submitEncomenda() {
  const nome = document.getElementById('enc-nome').value.trim();
  const whatsapp = document.getElementById('enc-whatsapp').value.trim();
  const tipo = document.getElementById('enc-tipo').value;
  const data = document.getElementById('enc-data').value;
  const descricao = document.getElementById('enc-descricao').value.trim();

  let ok = true;
  ok = setErroEnc('enc-nome', !nome ? 'Informe seu nome.' : '') && ok;
  ok = setErroEnc('enc-whatsapp', !whatsapp ? 'Informe um WhatsApp para contato.' : '') && ok;
  ok = setErroEnc('enc-descricao', !descricao ? 'Descreva a encomenda desejada.' : '') && ok;

  if (!ok) {
    mostrarToast('⚠️ Preencha os campos obrigatórios para enviar sua encomenda.');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  const encomendas = JSON.parse(localStorage.getItem('encomendas')) || [];

  const encomenda = {
    id: 'enc-' + Date.now(),
    numero: encomendas.length + 1,
    nome,
    whatsapp,
    tipo: tipo || 'Não especificado',
    data: data || 'Nenhuma específica',
    descricao,
    dataEnvio: new Date().toLocaleString('pt-BR'),
    status: 'Recebida',
    emailCliente: usuario ? usuario.email : null,
  };

  encomendas.push(encomenda);
  localStorage.setItem('encomendas', JSON.stringify(encomendas));

  mostrarToast('✅ Encomenda enviada! Entraremos em contato em até 24h.');

  document.getElementById('enc-nome').value = '';
  document.getElementById('enc-whatsapp').value = '';
  document.getElementById('enc-tipo').value = '';
  document.getElementById('enc-data').value = 'Nenhuma específica';
  document.getElementById('enc-descricao').value = '';
}
