import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Restaurant } from "../models";
import { ActionLink, colors } from "../styles";
const Card = styled.article`
  min-width: 0;
  background: white;
`;
const Picture = styled.div`
  height: 217px;
  position: relative;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Tags = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  gap: 8px;
  span {
    background: ${colors.coral};
    color: ${colors.cream};
    font-size: 12px;
    font-weight: 700;
    padding: 6px 4px;
  }
`;
const Body = styled.div`
  border: 1px solid ${colors.coral};
  border-top: 0;
  padding: 8px;
  min-height: 181px;
  display: flex;
  flex-direction: column;
  h2 {
    font-size: 18px;
    font-weight: 700;
  }
  p {
    font-size: 14px;
    line-height: 22px;
    margin: 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 88px;
  }
  a {
    align-self: start;
    margin-top: auto;
  }
`;
const Title = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: start;
  > span {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
  }
`;
export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Card>
      <Picture>
        <img
          src={restaurant.capa}
          alt={`Culinária do ${restaurant.titulo}`}
          loading="lazy"
          width="472"
          height="217"
        />
        <Tags>
          {restaurant.destacado && <span>Destaque da semana</span>}
          <span>{restaurant.tipo}</span>
        </Tags>
      </Picture>
      <Body>
        <Title>
          <h2>{restaurant.titulo}</h2>
          <span aria-label={`Avaliação ${restaurant.avaliacao} de 5`}>
            {restaurant.avaliacao}
            <img src="/assets/estrela.svg" alt="" />
          </span>
        </Title>
        <p>{restaurant.descricao}</p>
        <ActionLink
          as={Link}
          to={`/restaurante/${restaurant.id}`}
          aria-label={`Saiba mais sobre ${restaurant.titulo}`}
        >
          Saiba mais
        </ActionLink>
      </Body>
    </Card>
  );
}
