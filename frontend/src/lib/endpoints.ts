import { api } from "./api";

/* ─── Types matching openapi.json ─── */

export interface AccountCreate {
  business_name: string;
  phone_number: string;
  nin: string;
  pin: string;
}

export interface AccountLogin {
  phone_number: string;
  pin: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  virtual_account_number: string;
}

export interface AccountResponse {
  id: string;
  business_name: string;
  phone_number: string;
  virtual_account_number: string;
  is_verified: boolean;
}

export interface ProductResponse {
  id: string;
  account_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  low_stock_threshold: number;
  created_at: string;
}

export interface ProductCreate {
  name: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  low_stock_threshold?: number;
}

export interface ProductUpdate {
  name?: string;
  cost_price?: number;
  selling_price?: number;
  quantity?: number;
  low_stock_threshold?: number;
}

export interface CashSaleRequest {
  sender_name: string;
  items: Array<{ product_id: string; quantity: number }>;
}

export interface DebtorCreate {
  name: string;
  amount: number;
  items_summary: string;
  due_date?: string;
  items: DebtorItemCreate[];
}

export interface DebtorItemCreate {
  product_name: string;
  qty: number;
  price: number;
}

export interface DebtorResponse {
  id: string;
  account_id: string;
  name: string;
  amount: number;
  items_summary: string;
  due_date: string | null;
  status: string;
  created_at: string;
  items: DebtorItemResponse[];
}

export interface DebtorItemResponse {
  id: number;
  debtor_id: string;
  product_name: string;
  qty: number;
  price: number;
}

export interface DebtorLinkResponse {
  link: string;
}

export interface DebtorsSummaryResponse {
  total_outstanding: number;
  debtors: DebtorResponse[];
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WeeklyReportResponse {
  total_revenue: number;
  total_profit: number;
  total_sales: number;
  fastest_selling: FastestSellingProduct[];
  low_stock: LowStockItem[];
  daily_sales: DailySalesEntry[];
}

export interface FastestSellingProduct {
  product_id: string;
  name: string;
  quantity_sold: number;
}

export interface LowStockItem {
  product_id: string;
  name: string;
  quantity: number;
  threshold: number;
}

export interface DailySalesEntry {
  date: string;
  revenue: number;
  profit: number;
  transaction_count: number;
}

export interface UnallocatedTransactionResponse {
  id: string;
  amount: number;
  sender: string;
  session_id: string;
  created_at: string;
}

export interface ReconcileRequest {
  transaction_id: string;
  product_id: string;
  quantity: number;
}

export interface TriggerTransferPayload {
  product_name: string;
  quantity: number;
  amount: number;
}

export interface ProductExtractionResponse {
  names: string[];
}

export interface BasketItem {
  product_id: string;
  name: string;
  selling_price: number;
  quantity: number;
}

/* ─── Accounts ─── */

export interface AccountMeResponse {
  id: string;
  business_name: string;
  phone_number: string;
  virtual_account_number: string;
}

export const accountsApi = {
  signup: (data: AccountCreate) =>
    api.post<TokenResponse>("/accounts/signup", data).then((r) => r.data),

  login: (data: AccountLogin) =>
    api.post<TokenResponse>("/accounts/login", data).then((r) => r.data),

  me: () =>
    api.get<AccountMeResponse>("/accounts/me").then((r) => r.data),
};

/* ─── Inventory / Products ─── */

export const inventoryApi = {
  list: () =>
    api.get<ProductResponse[]>("/inventory").then((r) => r.data),

  get: (id: string) =>
    api.get<ProductResponse>(`/inventory/${id}`).then((r) => r.data),

  create: (data: ProductCreate) =>
    api.post<ProductResponse>("/inventory", data).then((r) => r.data),

  update: (id: string, data: ProductUpdate) =>
    api.put<ProductResponse>(`/inventory/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/inventory/${id}`).then((r) => r.data),

  extractProduct: (files: File[]) => {
    const form = new FormData();
    files.slice(0, 3).forEach((f) => form.append("images", f));
    return api
      .post<ProductExtractionResponse>("/inventory/extract-product", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

/* ─── Transactions ─── */

export const transactionsApi = {
  list: () =>
    api.get<BasketItem[]>("/transactions").then((r) => r.data),

  cashSale: (data: CashSaleRequest) =>
    api.post("/transactions/cash-sale", data).then((r) => r.data),

  triggerTransfer: (data: TriggerTransferPayload) =>
    api.post("/simulation/trigger-transfer", data).then((r) => r.data),

  unallocated: () =>
    api.get<UnallocatedTransactionResponse[]>("/transactions/unallocated").then((r) => r.data),

  reconcile: (data: ReconcileRequest) =>
    api.post("/transactions/reconcile-unallocated", data).then((r) => r.data),
};

/* ─── Debtors ─── */

export const debtorsApi = {
  list: () =>
    api.get<DebtorsSummaryResponse>("/debtors/all").then((r) => r.data),

  create: (data: DebtorCreate) =>
    api.post<DebtorResponse>("/debtors/new", data).then((r) => r.data),

  settle: (debtorId: string, data?: { payment_method: string }) =>
    api.post<{ message: string }>(`/debtors/${debtorId}/settle`, data).then((r) => r.data),
};

/* ─── Notifications ─── */

export const notificationsApi = {
  list: () =>
    api.get<NotificationResponse[]>("/notifications").then((r) => r.data),
};

/* ─── Activity ─── */

export interface ActivityResponse {
  id: number;
  account_id: string;
  activity_type: string;
  title: string;
  description: string;
  event_metadata: string;
  created_at: string;
}

export const activityApi = {
  recent: () =>
    api.get<ActivityResponse[]>("/activity/recent").then((r) => r.data),
};

/* ─── Reports ─── */

export const reportsApi = {
  weekly: () =>
    api.get<WeeklyReportResponse>("/reports/weekly").then((r) => r.data),
};

/* ─── Voice / AI Advisor ─── */

export type AiLanguage = "en" | "yo" | "ha" | "pidgin";

export interface AdvisorResponse {
  transcript: string;
  language_detected: string;
  reply: string;
}

export const voiceApi = {
  askText: (question: string, language: AiLanguage) =>
    api
      .post<AdvisorResponse>("/voice/ask/text", { question, language })
      .then((r) => r.data),

  askVoice: (audio: Blob, context?: string) => {
    const form = new FormData();
    form.append("audio", audio, "recording.webm");
    if (context) form.append("context", context);
    return api
      .post<AdvisorResponse>("/voice/ask/voice", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

/* ─── Webhooks ─── */

export const webhooksApi = {
  bankSettlement: (data: TriggerTransferPayload) =>
    api.post("/webhooks/bank-settlement", data).then((r) => r.data),
};
