import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  accountsApi,
  inventoryApi,
  transactionsApi,
  debtorsApi,
  notificationsApi,
  reportsApi,
  type ProductCreate,
  type ProductUpdate,
  type CashSaleRequest,
  type DebtorCreate,
  type AccountCreate,
  type AccountLogin,
  type ReconcileRequest,
} from "./endpoints";

/* ─── Keys ─── */

export const queryKeys = {
  me: ["me"] as const,
  inventory: { all: ["inventory"] as const, detail: (id: string) => ["inventory", id] as const },
  transactions: { all: ["transactions"] as const, unallocated: ["transactions", "unallocated"] as const },
  debtors: { all: ["debtors"] as const },
  notifications: { all: ["notifications"] as const },
  reports: { weekly: ["reports", "weekly"] as const },
};

/* ─── Account ─── */

export function useSignup() {
  return useMutation({
    mutationFn: (data: AccountCreate) => accountsApi.signup(data),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: AccountLogin) => accountsApi.login(data),
  });
}

/* ─── Inventory ─── */

export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory.all,
    queryFn: () => inventoryApi.list(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.inventory.detail(id),
    queryFn: () => inventoryApi.get(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductCreate) => inventoryApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory.all }),
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductUpdate) => inventoryApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventory.all }),
  });
}

export function useExtractProduct() {
  return useMutation({
    mutationFn: (files: File[]) => inventoryApi.extractProduct(files),
  });
}

/* ─── Transactions ─── */

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: () => transactionsApi.list(),
  });
}

export function useCashSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CashSaleRequest) => transactionsApi.cashSale(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useTriggerTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.triggerTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useUnallocatedTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.unallocated,
    queryFn: () => transactionsApi.unallocated(),
  });
}

/* ─── Debtors ─── */

export function useDebtors() {
  return useQuery({
    queryKey: queryKeys.debtors.all,
    queryFn: () => debtorsApi.list(),
  });
}

export function useCreateDebtor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DebtorCreate) => debtorsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.debtors.all }),
  });
}

export function useSettleDebtor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payment_method }: { id: string; payment_method: string }) =>
      debtorsApi.settle(id, { payment_method }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.debtors.all }),
  });
}

/* ─── Notifications ─── */

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => notificationsApi.list(),
  });
}

/* ─── Reports ─── */

export function useWeeklyReport() {
  return useQuery({
    queryKey: queryKeys.reports.weekly,
    queryFn: () => reportsApi.weekly(),
  });
}

/* ─── Reconcile ─── */

export function useReconcile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReconcileRequest) => transactionsApi.reconcile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.inventory.all });
      qc.invalidateQueries({ queryKey: queryKeys.transactions.unallocated });
    },
  });
}

/* ─── Me ─── */

export function useMe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => accountsApi.me(),
    enabled,
    retry: false,
  });
}
