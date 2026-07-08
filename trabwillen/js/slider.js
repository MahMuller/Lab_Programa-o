/* ================================================================
   slider.js — Lógica do hero carousel (autoplay, setas, dots)
   TRABWILLEN — Confecções em Feltro
   ================================================================ */

let slideAtual     = 0;
const TOTAL_SLIDES = 3;
const INTERVALO    = 5500;
let   autoPlayTimer;

/* Move o carrossel para um slide específico e reinicia a barra de progresso */
function irParaSlide(n) {
  slideAtual = n;
  document.getElementById('slider-wrapper').style.transform = `translateX(-${n * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('ativo', i === n));
  reiniciarProgresso();
}

/* Avança ou retrocede um slide (usado pelas setas de navegação) */
function moverSlide(dir) {
  irParaSlide((slideAtual + dir + TOTAL_SLIDES) % TOTAL_SLIDES);
  reiniciarAutoPlay();
}

/* Reinicia a animação da barra de progresso do autoplay */
function reiniciarProgresso() {
  const barra = document.getElementById('slider-progresso');
  barra.style.transition = 'none';
  barra.style.width      = '0%';
  void barra.offsetWidth; // força reflow para reiniciar a animação
  barra.style.transition = `width ${INTERVALO}ms linear`;
  barra.style.width      = '100%';
}

/* Reinicia o temporizador de troca automática de slides */
function reiniciarAutoPlay() {
  clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => moverSlide(1), INTERVALO);
}

/* Inicializa ao carregar a página */
reiniciarAutoPlay();
reiniciarProgresso();
