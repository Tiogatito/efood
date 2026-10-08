import styled from 'styled-components';
import { Container } from '../styles';
import { Header } from '../components/Header';
import { RestaurantCard } from '../components/RestaurantCard';
import { restaurants } from '../data';
const List = styled(Container)`display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 80px; row-gap: 48px; padding-top: 80px; padding-bottom: 120px; @media(max-width: 900px) { column-gap: 32px; } @media(max-width: 650px) { grid-template-columns: 1fr; padding-top: 40px; padding-bottom: 64px; }`;
export function Home() { return <><Header home /><main><List>{restaurants.map(restaurant => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</List></main></>; }
