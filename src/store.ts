import {
  configureStore,
  createSlice,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useDispatch, useSelector } from "react-redux";
import type { Product, Restaurant } from "./models";

function imageUrl(value: string) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/{2,}/g, "/");
  return url.href;
}

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api-ebac.vercel.app/api/efood/",
    timeout: 20000,
  }),
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => "restaurantes",
      transformResponse: (restaurants: Restaurant[]) =>
        restaurants.map((restaurant) => ({
          ...restaurant,
          capa: imageUrl(restaurant.capa),
          cardapio: restaurant.cardapio.map((product) => ({
            ...product,
            foto: imageUrl(product.foto),
          })),
        })),
    }),
  }),
});

interface CartItem extends Product {
  lineId: string;
}
interface CartState {
  items: CartItem[];
  open: boolean;
}
const initialState: CartState = { items: [], open: false };
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: {
      reducer(state, action: PayloadAction<CartItem>) {
        state.items.push(action.payload);
      },
      prepare(product: Product) {
        return { payload: { ...product, lineId: nanoid() } };
      },
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.lineId !== action.payload,
      );
    },
    openCart(state) {
      state.open = true;
    },
    closeCart(state) {
      state.open = false;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});
export const { addProduct, removeProduct, openCart, closeCart, clearCart } =
  cartSlice.actions;
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    [restaurantsApi.reducerPath]: restaurantsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restaurantsApi.middleware),
  devTools: import.meta.env.DEV,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const { useGetRestaurantsQuery } = restaurantsApi;
export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const selectTotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + Math.round(item.preco * 100),
    0,
  ) / 100;
