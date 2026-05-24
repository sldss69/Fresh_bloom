'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types/product";

export type CartItem = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "image"
> & {
  quantity: number;
  customRecipe?: {
    ingredients: string[];
  };
};

export type GiftDetails = {
  occasion: string;
  otherOccasion?: string;
  message: string;
};

type CartState = {
  items: CartItem[];
  giftDetails: GiftDetails | null;
  addItem: (product: Product, quantity?: number) => void;
  addCustomItem: (recipe: {
    name: string;
    ingredients: string[];
    image: string;
    price?: number;
  }) => void;
  setGiftDetails: (giftDetails: GiftDetails) => void;
  clearGiftDetails: () => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      giftDetails: null,
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image,
                quantity,
              },
            ],
          };
        }),
      addCustomItem: (recipe) =>
        set((state) => {
          const recipeKey = recipe.ingredients
            .map((ingredient) => ingredient.toLowerCase().replace(/\s+/g, "-"))
            .sort()
            .join("-");
          const customId = `custom-bouquet-${recipeKey || "sin-seleccion"}`;
          const existingItem = state.items.find((item) => item.id === customId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === customId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: customId,
                name: recipe.name,
                slug: customId,
                price: recipe.price ?? 0,
                image: recipe.image,
                quantity: 1,
                customRecipe: {
                  ingredients: recipe.ingredients,
                },
              },
            ],
          };
        }),
      setGiftDetails: (giftDetails) => set({ giftDetails }),
      clearGiftDetails: () => set({ giftDetails: null }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== productId)
              : state.items.map((item) =>
                  item.id === productId ? { ...item, quantity } : item,
                ),
        })),
      clearCart: () => set({ items: [], giftDetails: null }),
    }),
    {
      name: "fresh-bloom-cart",
      partialize: (state) => ({
        items: state.items,
        giftDetails: state.giftDetails,
      }),
    },
  ),
);

export const getCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return { totalItems, subtotal };
};
