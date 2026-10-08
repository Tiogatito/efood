import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Product } from '../models';
import { Button, colors } from '../styles';
import { formatPrice } from '../store';

const Dialog = styled.dialog`
  width: min(1024px, calc(100% - 32px)); max-height: calc(100dvh - 32px);
  padding: 32px; background: ${colors.coral}; color: white;
  > div { display: grid; grid-template-columns: 280px minmax(0,1fr); gap: 24px; }
  .product-image { width: 280px; height: 280px; object-fit: cover; }
  h2 { font-size: 18px; font-weight: 900; margin-bottom: 16px; }
  p { font-size: 14px; line-height: 22px; margin-bottom: 16px; }
  @media(max-width: 650px) {
    padding: 32px 16px 16px;
    > div { grid-template-columns: 1fr; gap: 16px; }
    .product-image { width: 100%; height: 200px; }
  }
`;
export const CloseButton = styled.button`
  position: absolute; top: 0; right: 0; padding: 8px; width: 32px; height: 32px;
  border: 0; background: transparent; display: grid; place-items: center;
  img { width: 16px; height: 16px; }
  @media(pointer: coarse) { width: 44px; height: 44px; }
`;
export function ProductModal({ product, onClose, onAdd }: {
  product: Product; onClose: () => void; onAdd: (product: Product) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);
  return <Dialog ref={ref} aria-labelledby="product-title" onCancel={(event) => {
    event.preventDefault(); onClose();
  }} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <CloseButton type="button" aria-label="Fechar detalhes" onClick={onClose}>
      <img src="/assets/fechar.png" alt="" />
    </CloseButton>
    <div>
      <img className="product-image" src={product.foto} alt={product.nome} width="280" height="280" />
      <section><h2 id="product-title">{product.nome}</h2><p>{product.descricao}</p><p>Serve: {product.porcao}</p>
        <Button $light type="button" onClick={() => onAdd(product)}>Adicionar ao carrinho - {formatPrice(product.preco)}</Button>
      </section>
    </div>
  </Dialog>;
}
