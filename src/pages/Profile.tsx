import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Container, Message } from '../styles';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { restaurants } from '../data';
const Banner = styled.section<{ $image: string }>`height: 280px; background: linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)), url(${p=>JSON.stringify(p.$image)}) center / cover; color: white; ${Container} { display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding-top: 24px; padding-bottom: 32px; } p { font-size: 32px; font-weight: 100; text-transform: capitalize; } h1 { font-size: 32px; font-weight: 900; }`;
const List = styled(Container)`display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 32px; padding-top: 56px; padding-bottom: 120px; @media(max-width: 900px) { grid-template-columns: repeat(2,minmax(0,1fr)); } @media(max-width: 600px) { grid-template-columns: 1fr; padding-top: 32px; padding-bottom: 64px; }`;
export function Profile() { const { id } = useParams(); const restaurant = restaurants.find(item=>item.id===Number(id)); if (!restaurant) return <><Header /><Message><h1>Restaurante não encontrado</h1><Button as={Link} to="/">Voltar aos restaurantes</Button></Message></>; return <><Header /><main><Banner $image={restaurant.capa}><Container><p>{restaurant.tipo}</p><h1>{restaurant.titulo}</h1></Container></Banner><List>{restaurant.cardapio.map(product=><ProductCard key={product.id} product={product} onDetails={()=>{}} />)}</List></main></>; }
