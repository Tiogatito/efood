# efood

Site de restaurantes e pedidos desenvolvido com React, TypeScript, Styled Components, React Router e Redux Toolkit. O layout segue o Figma disponibilizado pela EBAC.

- [Site publicado](https://efood-tau-nine.vercel.app/)
- [Layout de referência](https://www.figma.com/file/JjduV2Tg713TzYUUsees8b/efood)

## Executar

Requisito: Node.js 24 e npm.

```sh
npm ci
npm run dev
```

Para gerar e visualizar a versão de produção:

```sh
npm run build
npm run preview
```

## Etapas do projeto

| Módulo | Implementação                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------- |
| 35     | Layout, componentes com Styled Components e navegação com React Router.                                  |
| 36     | Restaurantes e cardápios carregados pela API; modal com foto, descrição, porção e preço do produto.      |
| 37     | Carrinho em Redux: adicionar, remover, contar produtos e calcular o total.                               |
| 38     | Entrega e pagamento com Formik e Yup; envio do pedido à API e confirmação com o identificador retornado. |

O site adapta a grade de restaurantes, os produtos, o modal e os formulários para telas menores. Os diálogos permitem navegação por teclado, fechamento com Escape e retorno do foco. Durante o envio do pedido, os controles ficam bloqueados até a resposta.

## APIs

- `GET https://api-ebac.vercel.app/api/efood/restaurantes`
- `POST https://api-ebac.vercel.app/api/efood/checkout`

Nomes, avaliações, descrições, fotos, cardápios, porções e preços vêm da API. O código trata carregamento, erro, listas vazias e novas tentativas. O carrinho só é limpo depois de receber a confirmação do pedido.

Este é um projeto acadêmico com a API didática da EBAC. Utilize somente dados fictícios na demonstração do checkout. Os dados do formulário não são gravados em armazenamento persistente.

## Organização

- `src/pages`: páginas de restaurantes e cardápio.
- `src/components`: cabeçalhos, cards, modal, carrinho, checkout e rodapé.
- `src/store.ts`: carrinho Redux e consulta de restaurantes via RTK Query.
- `src/checkout.ts`: validações, máscaras e requisição do pedido.
- `src/styles.ts`: estilos globais, cores e componentes compartilhados.
- `public/assets`: recursos visuais do layout.

O Vercel acompanha a branch `main`. As rotas de restaurantes também podem ser acessadas diretamente ou recarregadas.
