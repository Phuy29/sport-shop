import { ORDER_STATUS, PRODUCT_STATUS } from "@prisma/client";

export interface Product {
  name: string;
  id: string;
  description: string | null;
  price: number;
  inventory: number;
  collectionId: string | null;
  collection: Collection | null;
  status: PRODUCT_STATUS;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  status: ORDER_STATUS;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  phone: string;
  address: string;
  userId: string | null;
  stripePaymentIntentId: string | null;
  stripePaymentIntentStatus: string | null;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderId: string | null;
  productId: string;
  product: Omit<Product, "images" | "collection">;
  quantity: number;
  productVariantId: string | null;
}
