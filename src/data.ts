import type { Restaurant } from './models';
const italianDescription = 'A La Dolce Vita Trattoria leva a autêntica cozinha italiana até você! Desfrute de massas caseiras, pizzas deliciosas e risotos incríveis, tudo no conforto do seu lar. Entrega rápida, pratos bem embalados e sabor inesquecível. Peça já!';
const menu = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, nome: 'Pizza Marguerita', foto: '/assets/pizza.png', preco: 60.9, porcao: 'de 2 a 3 pessoas', descricao: 'A clássica Marguerita: molho de tomate suculento, mussarela derretida, manjericão fresco e um toque de azeite. Sabor e simplicidade!' }));
export const restaurants: Restaurant[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1, titulo: index === 0 ? 'Hioki Sushi' : 'La Dolce Vita Trattoria', destacado: index === 0,
  tipo: index === 0 ? 'Japonesa' : 'Italiana', avaliacao: index === 0 ? 4.9 : 4.6,
  capa: index === 0 ? '/assets/sushi.png' : '/assets/italiana.png', cardapio: menu,
  descricao: index === 0 ? 'Peça já o melhor da culinária japonesa no conforto da sua casa! Sushis frescos, sashimis deliciosos e pratos quentes irresistíveis. Entrega rápida, embalagens cuidadosas e qualidade garantida. Experimente o Japão sem sair do lar com nosso delivery!' : italianDescription,
}));
