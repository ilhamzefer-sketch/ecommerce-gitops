export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Product = {
  id: number;
  shopId: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  conditionLabel: string;
  stockNote?: string;
  imageUrl: string;
  deliveryNote?: string;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductUpsert = Omit<Product, "id" | "slug" | "status" | "createdAt" | "updatedAt">;

export type Inquiry = {
  id: number;
  productId: number;
  shopId: number;
  buyerUserId: number;
  message: string;
  preferredContact: "PHONE" | "EMAIL" | "WHATSAPP";
  status: "OPEN" | "RESPONDED" | "CLOSED";
  createdAt: string;
};
