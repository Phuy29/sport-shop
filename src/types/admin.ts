import { PRODUCT_STATUS } from "@prisma/client";

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
