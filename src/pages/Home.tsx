import styled from "styled-components";
import { Button, Container, Loader, Message } from "../styles";
import { Header } from "../components/Header";
import { RestaurantCard } from "../components/RestaurantCard";
import { useGetRestaurantsQuery } from "../store";
const List = styled(Container)`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 80px;
  row-gap: 48px;
  padding-top: 80px;
  padding-bottom: 120px;
  @media (max-width: 900px) {
    column-gap: 32px;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    padding-top: 40px;
    padding-bottom: 64px;
  }
`;
export function Home() {
  const {
    data: restaurants,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetRestaurantsQuery();
  return (
    <>
      <Header home />
      <main>
        {isLoading ? (
          <Message role="status">
            <Loader />
            Carregando restaurantes...
          </Message>
        ) : isError ? (
          <Message role="alert">
            <h2>Não foi possível carregar os restaurantes</h2>
            <p>Confira sua conexão e tente novamente.</p>
            <Button disabled={isFetching} onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </Message>
        ) : !restaurants?.length ? (
          <Message>
            <h2>Nenhum restaurante disponível</h2>
            <p>Volte em alguns instantes.</p>
          </Message>
        ) : (
          <List>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </List>
        )}
      </main>
    </>
  );
}
