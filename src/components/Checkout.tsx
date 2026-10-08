import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useFormik } from "formik";
import styled from "styled-components";
import { Button, colors } from "../styles";
import {
  clearCart,
  formatPrice,
  selectTotal,
  useAppDispatch,
  useAppSelector,
} from "../store";
import {
  deliverySchema,
  digits,
  initialValues,
  maskCard,
  maskZip,
  paymentSchema,
  placeOrder,
  type CheckoutValues,
} from "../checkout";

const Form = styled.form`
  h2 {
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 16px;
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }
  fieldset:disabled {
    opacity: 0.75;
  }
`;
const Field = styled.div`
  min-width: 0;
  margin-bottom: 8px;
  label {
    display: block;
    font-size: 14px;
    line-height: 16px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  input {
    display: block;
    width: 100%;
    min-width: 0;
    height: 32px;
    border: 1px solid transparent;
    padding: 8px;
    color: ${colors.text};
    background: ${colors.cream};
    font-size: 14px;
    font-weight: 700;
    border-radius: 0;
  }
  input[aria-invalid="true"] {
    border: 2px solid #7a1818;
  }
  p {
    color: ${colors.cream};
    font-size: 12px;
    line-height: 16px;
    margin-top: 4px;
  }
  @media (pointer: coarse) {
    input {
      font-size: 16px;
      min-height: 40px;
    }
  }
`;
const Row = styled.div<{ $card?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$card ? "minmax(0, 228fr) minmax(0, 87fr)" : "repeat(2, minmax(0, 1fr))")};
  gap: ${(p) => (p.$card ? "30px" : "34px")};
`;
const Actions = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 24px;
`;
const ErrorBox = styled.div`
  background: ${colors.cream};
  color: #7a1818;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 20px;
  ul {
    padding-left: 18px;
    margin: 8px 0 0;
  }
`;
const Confirmation = styled.section`
  h2 {
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 16px;
    overflow-wrap: anywhere;
  }
  p {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 22px;
  }
  button {
    margin-top: 2px;
  }
`;
interface Props {
  active: boolean;
  onBack: () => void;
  onComplete: () => void;
  onBusy: (busy: boolean) => void;
}
const labels: Partial<Record<keyof CheckoutValues, string>> = {
  receiver: "Quem irá receber",
  address: "Endereço",
  city: "Cidade",
  zipCode: "CEP",
  houseNumber: "Número",
  complement: "Complemento (opcional)",
  cardName: "Nome no cartão",
  cardNumber: "Número do cartão",
  cardCode: "CVV",
  month: "Mês de vencimento",
  year: "Ano de vencimento",
};
export function Checkout({ active, onBack, onComplete, onBusy }: Props) {
  const [step, setStep] = useState<"delivery" | "payment" | "confirmation">(
    "delivery",
  );
  const [orderId, setOrderId] = useState("");
  const [requestError, setRequestError] = useState("");
  const summary = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const lastFocusedSubmit = useRef(0);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const total = useAppSelector(selectTotal);
  const formik = useFormik<CheckoutValues>({
    initialValues,
    validationSchema: step === "delivery" ? deliverySchema : paymentSchema,
    onSubmit: async (values, helpers) => {
      if (step === "delivery") {
        helpers.setErrors({});
        helpers.setTouched({}, false);
        setStep("payment");
        return;
      }
      if (!items.length) {
        setRequestError("Adicione um produto antes de finalizar o pedido.");
        return;
      }
      setRequestError("");
      onBusy(true);
      try {
        const id = await placeOrder({
          products: items.map((item) => ({ id: item.id, price: item.preco })),
          delivery: {
            receiver: values.receiver.trim(),
            address: {
              description: values.address.trim(),
              city: values.city.trim(),
              zipCode: digits(values.zipCode),
              number: Number(values.houseNumber),
              complement: values.complement.trim(),
            },
          },
          payment: {
            card: {
              name: values.cardName.trim(),
              number: digits(values.cardNumber),
              code: Number(values.cardCode),
              expires: {
                month: Number(values.month),
                year: Number(values.year),
              },
            },
          },
        });
        setOrderId(id);
        setStep("confirmation");
        helpers.resetForm();
        dispatch(clearCart());
      } catch (error) {
        setRequestError(
          error instanceof Error && error.name === "TimeoutError"
            ? "O envio demorou mais que o esperado. Confira sua conexão e tente novamente."
            : error instanceof TypeError
              ? "Não foi possível conectar ao serviço de pedidos. Confira sua conexão e tente novamente."
              : error instanceof Error
                ? error.message
                : "Não foi possível concluir o pedido. Tente novamente.",
        );
      } finally {
        onBusy(false);
      }
    },
  });
  const errors = Object.entries(formik.errors).filter(
    ([key]) => formik.touched[key as keyof CheckoutValues],
  );
  useEffect(() => {
    if (active) heading.current?.focus();
  }, [step, active]);
  useEffect(() => {
    if (
      formik.isValidating ||
      formik.isSubmitting ||
      formik.submitCount <= lastFocusedSubmit.current
    )
      return;
    if (errors.length) summary.current?.focus();
    lastFocusedSubmit.current = formik.submitCount;
  }, [
    formik.submitCount,
    formik.isValidating,
    formik.isSubmitting,
    errors.length,
  ]);
  function field(
    name: keyof CheckoutValues,
    attributes: ComponentProps<"input"> = {},
  ) {
    const error = formik.touched[name] && formik.errors[name];
    return (
      <Field>
        <label htmlFor={name}>{labels[name]}</label>
        <input
          {...formik.getFieldProps(name)}
          {...attributes}
          id={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onChange={(event) => {
            const value = event.target.value;
            void formik.setFieldValue(
              name,
              name === "zipCode"
                ? maskZip(value)
                : name === "cardNumber"
                  ? maskCard(value)
                  : ["houseNumber", "cardCode", "month", "year"].includes(name)
                    ? digits(value)
                    : value,
            );
          }}
        />
        {error && <p id={`${name}-error`}>{error}</p>}
      </Field>
    );
  }
  if (step === "confirmation")
    return (
      <Confirmation aria-live="polite">
        <h2 ref={heading} tabIndex={-1}>
          Pedido realizado - {orderId}
        </h2>
        <p>
          Estamos felizes em informar que seu pedido já está em processo de
          preparação e, em breve, será entregue no endereço fornecido.
        </p>
        <p>
          Gostaríamos de ressaltar que nossos entregadores não estão autorizados
          a realizar cobranças extras.
        </p>
        <p>
          Lembre-se da importância de higienizar as mãos após o recebimento do
          pedido, garantindo assim sua segurança e bem-estar durante a refeição.
        </p>
        <p>
          Esperamos que desfrute de uma deliciosa e agradável experiência
          gastronômica. Bom apetite!
        </p>
        <Button $light $full type="button" onClick={onComplete}>
          Concluir
        </Button>
      </Confirmation>
    );
  return (
    <Form
      noValidate
      onSubmit={formik.handleSubmit}
      aria-busy={formik.isSubmitting}
    >
      <h2 ref={heading} tabIndex={-1}>
        {step === "delivery"
          ? "Entrega"
          : `Pagamento - Valor a pagar ${formatPrice(total)}`}
      </h2>
      {errors.length > 0 && (
        <ErrorBox ref={summary} tabIndex={-1} role="alert">
          <strong>Confira os campos abaixo:</strong>
          <ul>
            {errors.map(([key, message]) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(key)?.focus();
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </ErrorBox>
      )}
      {requestError && <ErrorBox role="alert">{requestError}</ErrorBox>}
      <fieldset disabled={formik.isSubmitting}>
        <legend className="sr-only">
          {step === "delivery" ? "Dados de entrega" : "Dados do pagamento"}
        </legend>
        {step === "delivery" ? (
          <>
            {field("receiver", {
              autoComplete: "shipping name",
              maxLength: 100,
            })}
            {field("address", {
              autoComplete: "shipping address-line1",
              maxLength: 200,
            })}
            {field("city", {
              autoComplete: "shipping address-level2",
              maxLength: 100,
            })}
            <Row>
              {field("zipCode", {
                autoComplete: "shipping postal-code",
                inputMode: "numeric",
                maxLength: 9,
              })}
              {field("houseNumber", {
                autoComplete: "off",
                inputMode: "numeric",
                maxLength: 7,
              })}
            </Row>
            {field("complement", {
              autoComplete: "shipping address-line2",
              maxLength: 100,
            })}
          </>
        ) : (
          <>
            {field("cardName", { autoComplete: "cc-name", maxLength: 100 })}
            <Row $card>
              {field("cardNumber", {
                autoComplete: "cc-number",
                inputMode: "numeric",
                maxLength: 23,
              })}
              {field("cardCode", {
                autoComplete: "cc-csc",
                inputMode: "numeric",
                maxLength: 4,
              })}
            </Row>
            <Row>
              {field("month", {
                autoComplete: "cc-exp-month",
                inputMode: "numeric",
                maxLength: 2,
              })}
              {field("year", {
                autoComplete: "cc-exp-year",
                inputMode: "numeric",
                maxLength: 4,
              })}
            </Row>
          </>
        )}
        <Actions>
          <Button $light $full type="submit">
            {formik.isSubmitting
              ? "Enviando pedido..."
              : step === "delivery"
                ? "Continuar com o pagamento"
                : "Finalizar pagamento"}
          </Button>
          <Button
            $light
            $full
            type="button"
            onClick={() => {
              if (step === "delivery") {
                onBack();
                return;
              }
              formik.setErrors({});
              void formik.setTouched({}, false);
              setRequestError("");
              setStep("delivery");
            }}
          >
            {step === "delivery"
              ? "Voltar para o carrinho"
              : "Voltar para a edição de endereço"}
          </Button>
        </Actions>
      </fieldset>
      {formik.isSubmitting && (
        <p role="status" className="sr-only">
          Enviando pedido. Aguarde a confirmação.
        </p>
      )}
    </Form>
  );
}
