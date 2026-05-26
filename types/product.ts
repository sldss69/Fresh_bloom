export type ProductCategory = "ramos" | "jarron" | "jarrones" | "plantas" | "macetas" | "extras";

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
  imagePosition?: string;
  imageClassName?: string;
  /** Override del fondo del área de imagen (ej: para productos blancos/cerámica). Default: #F0E5DD */
  imageBg?: string;
  /** Activa sombra ovalada radial debajo del producto + filtro de contraste sutil al PNG. Útil para cerámica blanca. */
  imageShadow?: boolean;
  /** Override del CSS filter aplicado al PNG (contrast/brightness/saturate/drop-shadow). Si no se define y imageShadow=true, se aplica el filtro default de cerámica. */
  imageFilter?: string;
};
