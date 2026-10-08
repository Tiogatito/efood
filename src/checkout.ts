import * as Yup from "yup";

export interface CheckoutValues {
  receiver: string;
  address: string;
  city: string;
  zipCode: string;
  houseNumber: string;
  complement: string;
  cardName: string;
  cardNumber: string;
  cardCode: string;
  month: string;
  year: string;
}
export const initialValues: CheckoutValues = {
  receiver: "",
  address: "",
  city: "",
  zipCode: "",
  houseNumber: "",
  complement: "",
  cardName: "",
  cardNumber: "",
  cardCode: "",
  month: "",
  year: "",
};
export const digits = (value: string) => value.replace(/\D/g, "");
export const maskZip = (value: string) =>
  digits(value)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
export const maskCard = (value: string) =>
  digits(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
const requiredName = (label: string) =>
  Yup.string()
    .trim()
    .min(3, `${label} deve ter pelo menos 3 caracteres.`)
    .max(100, "Use até 100 caracteres.")
    .required(`Informe ${label.toLowerCase()}.`);
export const deliverySchema = Yup.object({
  receiver: requiredName("O nome"),
  address: Yup.string()
    .trim()
    .min(3, "Informe um endereço completo.")
    .max(200)
    .required("Informe o endereço."),
  city: Yup.string()
    .trim()
    .min(2, "Informe a cidade.")
    .max(100)
    .required("Informe a cidade."),
  zipCode: Yup.string()
    .required("Informe o CEP.")
    .test(
      "zip",
      "O CEP deve ter 8 números.",
      (value) => digits(value || "").length === 8,
    ),
  houseNumber: Yup.string()
    .required("Informe o número.")
    .matches(/^\d{1,7}$/, "Informe um número válido.")
    .test(
      "positive",
      "O número deve ser maior que zero.",
      (value) => Number(value) > 0,
    ),
  complement: Yup.string().trim().max(100, "Use até 100 caracteres."),
});
function validCard(value: string) {
  const number = digits(value);
  if (!/^\d{13,19}$/.test(number) || /^(\d)\1+$/.test(number)) return false;
  let total = 0;
  for (
    let i = number.length - 1, double = false;
    i >= 0;
    i--, double = !double
  ) {
    let digit = Number(number[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    total += digit;
  }
  return total % 10 === 0;
}
export const paymentSchema = Yup.object({
  cardName: requiredName("O nome no cartão"),
  cardNumber: Yup.string()
    .required("Informe o número do cartão.")
    .test("card", "Informe um número de cartão válido.", (value) =>
      validCard(value || ""),
    ),
  cardCode: Yup.string()
    .required("Informe o CVV.")
    .matches(/^\d{3,4}$/, "O CVV deve ter 3 ou 4 números."),
  month: Yup.string()
    .required("Informe o mês.")
    .matches(/^\d{1,2}$/, "Informe o mês de 1 a 12.")
    .test(
      "month",
      "Informe o mês de 1 a 12.",
      (value) => Number(value) >= 1 && Number(value) <= 12,
    ),
  year: Yup.string()
    .required("Informe o ano.")
    .matches(/^\d{4}$/, "Informe o ano com 4 números.")
    .test("expiration", "O cartão está vencido.", function (value) {
      const now = new Date();
      const year = Number(value),
        month = Number(this.parent.month);
      return (
        year > now.getFullYear() ||
        (year === now.getFullYear() && month >= now.getMonth() + 1)
      );
    }),
});
export interface CheckoutPayload {
  products: { id: number; price: number }[];
  delivery: {
    receiver: string;
    address: {
      description: string;
      city: string;
      zipCode: string;
      number: number;
      complement: string;
    };
  };
  payment: {
    card: {
      name: string;
      number: string;
      code: number;
      expires: { month: number; year: number };
    };
  };
}
export async function placeOrder(payload: CheckoutPayload): Promise<string> {
  const response = await fetch(
    "https://api-ebac.vercel.app/api/efood/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!response.ok)
    throw new Error("Não foi possível concluir o pedido. Tente novamente.");
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("orderId" in result) ||
    (typeof result.orderId !== "string" &&
      typeof result.orderId !== "number") ||
    !String(result.orderId).trim()
  ) {
    throw new Error(
      "A confirmação do pedido não foi recebida. Tente novamente em instantes.",
    );
  }
  return String(result.orderId);
}
