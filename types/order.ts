export type PaymentMethod = "mercadopago" | "cash_whatsapp";

export type OrderStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "cash_pending";

export type OrderCustomer = {
  name: string;
  phone: string;
  address: string;
  postalCode: string;
  notes?: string;
  marketingOptIn?: boolean;
};

export type OrderDeliverySchedule = {
  date: string;
  timeWindow: string;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type OrderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  deliverySchedule: OrderDeliverySchedule;
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: "MXN";
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  mercadoPagoPreferenceId?: string;
  mercadoPagoPaymentId?: string;
  whatsappStatus?: "pending" | "sent" | "skipped" | "failed";
};

export type CheckoutCartItem = {
  id: string;
  quantity: number;
  name?: string;
  unitPrice?: number;
  customRecipe?: {
    ingredients: string[];
  };
};
