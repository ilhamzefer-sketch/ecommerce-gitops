export type ShopStatus = "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "REJECTED" | "SUSPENDED" | "CLOSED";
export type ShopType = "INDIVIDUAL" | "BUSINESS";

export type SellerContext = {
  hasShop: boolean;
  shopId?: number;
  shopName?: string;
  status?: ShopStatus;
  action: string;
  reason?: string;
};

export type ShopApplication = {
  name: string;
  type: ShopType;
  description: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  category: string;
  companyName?: string;
  taxId?: string;
  termsAccepted: boolean;
};

export type Shop = ShopApplication & {
  id: number;
  slug: string;
  status: ShopStatus;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
};

export type ShopDecision = "APPROVE" | "REJECT" | "SUSPEND" | "REACTIVATE" | "CLOSE";
