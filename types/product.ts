export type ProductCategory = "ramos" | "jarron" | "plantas" | "extras";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  category: ProductCategory;
  ingredients: string[];
  accentClass: string;
};
