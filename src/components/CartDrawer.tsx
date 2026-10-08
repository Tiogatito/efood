import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, colors } from "../styles";
import {
  closeCart,
  formatPrice,
  removeProduct,
  selectTotal,
  useAppDispatch,
  useAppSelector,
} from "../store";
import { Checkout } from "./Checkout";
import { CloseButton } from "./ProductModal";

const Drawer = styled.dialog`
  position: fixed;
  inset: 0 0 0 auto;
  margin: 0;
  width: min(360px, 100%);
  max-width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  padding: 32px 8px;
  overflow-y: auto;
  background: ${colors.coral};
  color: ${colors.cream};
`;
const Items = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  gap: 16px;
`;
const Item = styled.li`
  position: relative;
  background: ${colors.cream};
  color: ${colors.coral};
  min-height: 100px;
  padding: 8px;
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: 8px;
  > img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  h3 {
    font-size: 18px;
    font-weight: 900;
    padding-right: 16px;
    overflow-wrap: anywhere;
  }
  p {
    margin-top: 16px;
    font-size: 14px;
    padding-bottom: 20px;
  }
  button {
    position: absolute;
    bottom: 0;
    right: 0;
    border: 0;
    background: transparent;
    padding: 8px;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
  }
  button img {
    width: 16px;
    height: 16px;
  }
  @media (pointer: coarse) {
    button {
      width: 44px;
      height: 44px;
    }
  }
`;
const Total = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0 16px;
  font-size: 14px;
  font-weight: 700;
`;
const Empty = styled.div`
  text-align: center;
  padding: 24px 16px;
  h2 {
    font-size: 18px;
    margin-bottom: 16px;
  }
  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 24px;
  }
`;
export function CartDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const [checkout, setCheckout] = useState(false);
  const [busy, setBusy] = useState(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const total = useAppSelector(selectTotal);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.getElementById("cart-trigger")?.focus();
    };
  }, []);
  function close() {
    if (!busy) dispatch(closeCart());
  }
  return (
    <Drawer
      ref={ref}
      aria-label={checkout ? "Finalizar pedido" : "Carrinho de compras"}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left) close();
      }}
    >
      <CloseButton
        aria-label="Fechar carrinho"
        type="button"
        disabled={busy}
        onClick={close}
      >
        <img src="/assets/fechar.png" alt="" />
      </CloseButton>
      {checkout ? (
        <Checkout
          onBack={() => setCheckout(false)}
          onComplete={close}
          onBusy={setBusy}
        />
      ) : items.length ? (
        <>
          <h2 className="sr-only">Carrinho de compras</h2>
          <Items>
            {items.map((item) => (
              <Item key={item.lineId}>
                <img src={item.foto} alt={item.nome} width="80" height="80" />
                <div>
                  <h3>{item.nome}</h3>
                  <p>{formatPrice(item.preco)}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remover ${item.nome} do carrinho`}
                  onClick={() => dispatch(removeProduct(item.lineId))}
                >
                  <img src="/assets/lixeira.png" alt="" />
                </button>
              </Item>
            ))}
          </Items>
          <Total aria-live="polite">
            <span>Valor total</span>
            <span>{formatPrice(total)}</span>
          </Total>
          <Button $light $full onClick={() => setCheckout(true)}>
            Continuar com a entrega
          </Button>
        </>
      ) : (
        <Empty>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione um prato do cardápio para continuar.</p>
          <Button $light $full onClick={close}>
            Voltar ao cardápio
          </Button>
        </Empty>
      )}
    </Drawer>
  );
}
