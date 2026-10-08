import { Link } from "react-router-dom";
import styled from "styled-components";
import { colors, Container } from "../styles";
const Hero = styled.header`
  height: 360px;
  background: ${colors.cream} url("/assets/fundo-home.svg") 0 -24px no-repeat;
  text-align: center;
  padding-top: 40px;
  img {
    margin: 0 auto;
  }
  h1 {
    font-size: 36px;
    font-weight: 900;
    line-height: 42px;
    margin: 138px auto 0;
    max-width: 550px;
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 28px;
      line-height: 34px;
      margin-top: 110px;
      padding: 0 16px;
    }
  }
`;
const Bar = styled.header`
  height: 162px;
  background: ${colors.cream} url("/assets/fundo-header.svg") 0 -23px no-repeat;
  ${Container} {
    display: grid;
    grid-template-columns: 1fr 125px 1fr;
    align-items: center;
    padding-top: 40px;
    gap: 16px;
  }
  a {
    text-decoration: none;
    font-weight: 900;
    font-size: 18px;
  }
  button {
    justify-self: end;
    background: transparent;
    border: 0;
    color: ${colors.coral};
    font-weight: 900;
    font-size: 18px;
    padding: 8px 0;
    text-align: right;
  }
  @media (max-width: 600px) {
    ${Container} {
      grid-template-columns: 1fr 1fr;
      padding-top: 24px;
    }
    a:first-child {
      grid-row: 2;
    }
    a:nth-child(2) {
      grid-column: 1 / -1;
      justify-self: center;
    }
    button {
      grid-row: 2;
    }
    a,
    button {
      font-size: 14px;
    }
  }
`;
export function Header({
  home = false,
  count = 0,
  onCart,
}: {
  home?: boolean;
  count?: number;
  onCart?: () => void;
}) {
  if (home)
    return (
      <Hero>
        <img src="/assets/logo.svg" alt="efood" width="125" height="57.5" />
        <h1>
          Viva experiências gastronômicas
          <br />
          no conforto da sua casa
        </h1>
      </Hero>
    );
  return (
    <Bar>
      <Container>
        <Link to="/">Restaurantes</Link>
        <Link to="/" aria-label="efood — página inicial">
          <img src="/assets/logo.svg" alt="efood" width="125" height="57.5" />
        </Link>
        <button
          id="cart-trigger"
          type="button"
          onClick={onCart}
          aria-label={`Abrir carrinho com ${count} produtos`}
        >
          {count} produto(s) no carrinho
        </button>
      </Container>
    </Bar>
  );
}
