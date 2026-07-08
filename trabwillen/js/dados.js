/* ================================================================
   dados.js — Catálogo de produtos com imagens reais
   TRABWILLEN — Confecções em Feltro
   Preços baseados na Tabela de Valores oficial:
     Pelúcias 10cm → R$ 50   | Pelúcias 20cm → R$ 100
     Pelúcias 40cm → R$ 250  | Chaveiros → R$ 10
     Guirlandas → R$ 80      | Roupas extras → R$ 25
   ================================================================ */

const IMG = 'assets/images';

const PRODUTOS = [
  /* Categoria: pelúcias de animais */
  {
    id: 'elefanta', nome: 'Elefanta', preco: 100, cat: 'Pelúcias',
    desc: 'Elefantinha em feltro rosa com vestidinho jeans e botõezinhos.',
    imgs: [`${IMG}/elefanta/01.jpeg`, `${IMG}/elefanta/02.jpeg`],
    data: ['Aniversário', 'Mães', 'Namorados'],
    avaliacao: 4.9, numAv: 34, badge: '', badgeClass: '',
    tags: ['Feltro', 'Presente', 'Personalizado'],
  },
  {
    id: 'elefante', nome: 'Elefante', preco: 100, cat: 'Pelúcias',
    desc: 'Elefantinho em feltro cinza, fofo e resistente.',
    imgs: [`${IMG}/elefante/01.jpeg`, `${IMG}/elefante/02.jpeg`],
    data: ['Aniversário', 'Páscoa'],
    avaliacao: 4.7, numAv: 21, badge: '', badgeClass: '',
    tags: ['Feltro', 'Infantil'],
  },
  {
    id: 'gatinha', nome: 'Gatinha', preco: 100, cat: 'Pelúcias',
    desc: 'Gatinha em feltro com detalhes em costura manual.',
    imgs: [`${IMG}/gatinha/01.jpeg`, `${IMG}/gatinha/02.jpeg`],
    data: ['Aniversário', 'Mães', 'Namorados'],
    avaliacao: 5.0, numAv: 58, badge: 'Mais vendida', badgeClass: 'badge-hit',
    tags: ['Feltro', 'Amor', 'Presente'],
  },
  {
    id: 'girafa', nome: 'Girafa', preco: 100, cat: 'Pelúcias',
    desc: 'Girafa estilizada em feltro com manchas recortadas à mão.',
    imgs: [`${IMG}/girafa/01.jpeg`, `${IMG}/girafa/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.8, numAv: 17, badge: '', badgeClass: '',
    tags: ['Feltro', 'Animal', 'Artesanal'],
  },
  {
    id: 'hipopotamo', nome: 'Hipopótamo', preco: 100, cat: 'Pelúcias',
    desc: 'Hipopótamo rechonchudo em feltro macio.',
    imgs: [`${IMG}/hipopotamo/01.jpeg`, `${IMG}/hipopotamo/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.6, numAv: 12, badge: '', badgeClass: '',
    tags: ['Feltro', 'Animal', 'Fofo'],
  },
  {
    id: 'leao', nome: 'Leão', preco: 100, cat: 'Pelúcias',
    desc: 'Leãozinho com juba em feltro multicor cortada à mão.',
    imgs: [`${IMG}/leao/01.jpeg`, `${IMG}/leao/02.jpeg`],
    data: ['Aniversário', 'Pais'],
    avaliacao: 4.9, numAv: 29, badge: 'Novo', badgeClass: 'badge-novo',
    tags: ['Feltro', 'Animal', 'Artesanal'],
  },
  {
    id: 'macaco', nome: 'Macaco', preco: 100, cat: 'Pelúcias',
    desc: 'Macaquinho em feltro marrom com detalhinhos de rosto bordados.',
    imgs: [`${IMG}/macaco/01.jpeg`, `${IMG}/macaco/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.7, numAv: 15, badge: '', badgeClass: '',
    tags: ['Feltro', 'Animal', 'Bordado'],
  },
  {
    id: 'ratinha', nome: 'Ratinha', preco: 100, cat: 'Pelúcias',
    desc: 'Ratinha delicada em feltro com orelhinhas arredondadas.',
    imgs: [`${IMG}/ratinha/01.jpeg`, `${IMG}/ratinha/02.jpeg`],
    data: ['Aniversário', 'Namorados'],
    avaliacao: 4.8, numAv: 23, badge: '', badgeClass: '',
    tags: ['Feltro', 'Delicado', 'Presente'],
  },
  {
    id: 'tigre', nome: 'Tigre', preco: 100, cat: 'Pelúcias',
    desc: 'Tigrinho em feltro com listras costuradas à mão.',
    imgs: [`${IMG}/tigre/01.jpeg`, `${IMG}/tigre/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.9, numAv: 31, badge: '', badgeClass: '',
    tags: ['Feltro', 'Animal', 'Costura'],
  },
  {
    id: 'zebra', nome: 'Zebra', preco: 100, cat: 'Pelúcias',
    desc: 'Zebra em feltro preto e branco com crina de tiras.',
    imgs: [`${IMG}/zebra/01.jpeg`, `${IMG}/zebra/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.7, numAv: 19, badge: '', badgeClass: '',
    tags: ['Feltro', 'Animal', 'Artesanal'],
  },
  {
    id: 'gansos', nome: 'Gansos', preco: 100, cat: 'Pelúcias',
    desc: 'Dupla de gansos em feltro branco com detalhes coloridos.',
    imgs: [`${IMG}/gansos/01.jpeg`, `${IMG}/gansos/02.jpeg`],
    data: ['Aniversário', 'Mães'],
    avaliacao: 5.0, numAv: 11, badge: 'Novo', badgeClass: 'badge-novo',
    tags: ['Feltro', 'Dupla', 'Presente'],
  },

  /* Categoria: pelúcias especiais */
  {
    id: 'fada', nome: 'Fada', preco: 250, cat: 'Especiais',
    desc: 'Fada articulada em feltro com asas de glitter lilás e vestido elaborado.',
    imgs: [`${IMG}/fada/01.jpeg`, `${IMG}/fada/02.jpeg`],
    data: ['Aniversário', 'Namorados', 'Mães'],
    avaliacao: 5.0, numAv: 47, badge: 'Ed. Limitada', badgeClass: 'badge-lim',
    tags: ['Especial', 'Glitter', 'Articulada'],
  },
  {
    id: 'nossa-senhora', nome: 'Nossa Senhora', preco: 250, cat: 'Especiais',
    desc: 'Nossa Senhora Aparecida em feltro com manto bordado, pérolas e coroa dourada.',
    imgs: [`${IMG}/nossa-senhora/01.jpeg`, `${IMG}/nossa-senhora/02.jpeg`],
    data: ['Aniversário', 'Mães'],
    avaliacao: 5.0, numAv: 63, badge: 'Mais pedida', badgeClass: 'badge-hit',
    tags: ['Especial', 'Bordado', 'Pérolas'],
  },
  {
    id: 'tristeza', nome: 'Tristeza — Divertida Mente', preco: 50, cat: 'Especiais',
    desc: 'Personagem Tristeza de Divertida Mente em feltro azul com óculos.',
    imgs: [`${IMG}/tristeza/01.jpeg`, `${IMG}/tristeza/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.8, numAv: 38, badge: 'Sazonal', badgeClass: 'badge-sazonal',
    tags: ['Cinema', 'Personagem', 'Feltro'],
  },

  /* Categoria: guirlandas */
  {
    id: 'guirlanda-1', nome: 'Guirlanda Panda', preco: 80, cat: 'Guirlandas',
    desc: 'Painel personalizado com nome em nuvem e panda em feltro — perfeito para quarto de bebê.',
    imgs: [`${IMG}/guirlanda/01.jpeg`],
    data: ['Aniversário', 'Mães'],
    avaliacao: 4.9, numAv: 26, badge: 'Personalizável', badgeClass: 'badge-pers',
    tags: ['Bebê', 'Panda', 'Quarto'],
  },
  {
    id: 'guirlanda-2', nome: 'Guirlanda Personalizada', preco: 80, cat: 'Guirlandas',
    desc: 'Painel decorativo em feltro com tema personalizável.',
    imgs: [`${IMG}/guirlanda/02.jpeg`],
    data: ['Aniversário'],
    avaliacao: 4.7, numAv: 14, badge: 'Personalizável', badgeClass: 'badge-pers',
    tags: ['Feltro', 'Decoração', 'Personalizado'],
  },
  {
    id: 'guirlanda-3', nome: 'Guirlanda Festiva', preco: 80, cat: 'Guirlandas',
    desc: 'Painel decorativo em feltro com tema personalizável.',
    imgs: [`${IMG}/guirlanda/03.jpeg`],
    data: ['Aniversário', 'Natal'],
    avaliacao: 4.8, numAv: 9, badge: '', badgeClass: '',
    tags: ['Feltro', 'Natal', 'Decoração'],
  },
  {
    id: 'guirlanda-4', nome: 'Guirlanda Natalina', preco: 80, cat: 'Guirlandas',
    desc: 'Painel decorativo em feltro com tema personalizável.',
    imgs: [`${IMG}/guirlanda/04.jpeg`],
    data: ['Natal', 'Aniversário'],
    avaliacao: 5.0, numAv: 7, badge: 'Sazonal', badgeClass: 'badge-sazonal',
    tags: ['Natal', 'Feltro', 'Especial'],
  },
];
