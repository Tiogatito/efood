import styled from 'styled-components';
import type { Product } from '../models';
import { Button, colors } from '../styles';
const Card = styled.article`background: ${colors.coral}; color: ${colors.cream}; padding: 8px; display: flex; flex-direction: column; min-width: 0; > img { width: 100%; height: 167px; object-fit: cover; } h2 { font-size: 16px; font-weight: 900; margin-top: 8px; } p { font-size: 14px; line-height: 22px; margin: 8px 0; min-height: 88px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; } button { margin-top: auto; }`;
export function ProductCard({ product, onDetails }: { product: Product; onDetails: (product: Product) => void }) { return <Card><img src={product.foto} alt={product.nome} width="304" height="167" loading="lazy" /><h2>{product.nome}</h2><p>{product.descricao}</p><Button $light $full onClick={() => onDetails(product)}>Mais detalhes</Button></Card>; }
