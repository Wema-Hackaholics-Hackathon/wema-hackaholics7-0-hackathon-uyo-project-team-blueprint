import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import type { InventoryItem, DebtorEntry, DebtorItem, PaidDebt, Notification, StagedProduct, ModalId } from "./types";
import { debtorsApi, inventoryApi, voiceApi, type AiLanguage } from "@/lib/endpoints";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useInventory, useDebtors, useNotifications, useWeeklyReport, useMe } from "@/lib/query-hooks";
import { queryClient } from "@/lib/query-client";

interface AppContextValue {
  authenticated: boolean;
  accountName: string;
  accountNumber: string;
  bankName: string;
  revenue: number;
  profit: number;
  inventory: InventoryItem[];
  debtors: DebtorEntry[];
  paidDebts: PaidDebt[];
  notifications: Notification[];
  stagedProducts: StagedProduct[];
  activeStagedIdx: number;
  scanning: boolean;
  chatLogs: string[];
  aiChips: string[];
  aiLang: AiLanguage;
  aiLoading: boolean;
  activeModal: ModalId;
  incomingTransferAmount: number;
  incomingTransferSender: string;
  incomingTransferBank: string;
  settleTarget: DebtorEntry | null;
  collectTarget: DebtorEntry | null;
  setAuthenticated: (v: boolean) => void;
  setActiveStagedIdx: (v: number) => void;
  setAiLang: (v: AiLanguage) => void;
  setActiveModal: (v: ModalId) => void;
  closeModal: () => void;
  pushNotification: (title: string, desc: string, type: Notification["type"]) => void;
  handleAuth: () => void;
  simulateTransfer: () => void;
  manualCashSale: (prodId: string, qty: number) => void;
  processTransfer: (prodId: string, qty: number) => void;
  logDebt: (name: string, amount: number, date: string, items: DebtorItem[]) => void;
  settleDebt: (id: string) => void;
  openSettleConfirm: (id: string) => void;
  openCollectDebt: (id: string) => void;
  openIncomingTransfer: () => void;
  receiveIncomingTransfer: (payload: { amount: number; sender: string; bank: string }) => void;
  triggerBatchScan: (files: FileList | null) => void;
  addStagedProduct: (name?: string) => void;
  updateStagedField: (idx: number, field: keyof StagedProduct, value: string | number) => void;
  commitBatch: () => void;
  discardBatch: () => void;
  submitAiQuery: (text: string) => void;
  submitAiVoice: (audio: Blob) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(() => {
    return !!localStorage.getItem("traka_user");
  });

  const { data: meData, isError: meError } = useMe(authenticated);
  const { data: inventoryData } = useInventory(authenticated);
  const { data: debtorsData } = useDebtors(authenticated);
  const { data: notificationsData } = useNotifications(authenticated);
  const { data: weeklyData } = useWeeklyReport(authenticated);

  useEffect(() => {
    if (meError) setAuthenticated(false);
  }, [meError]);

  const prevAuth = useRef(authenticated);
  useEffect(() => {
    if (authenticated && !prevAuth.current) {
      queryClient.invalidateQueries();
    }
    prevAuth.current = authenticated;
  }, [authenticated]);
  const accountName = meData?.business_name ?? "";
  const accountNumber = meData?.virtual_account_number ?? "";
  const bankName = "Wema Bank";
  const revenue = weeklyData?.total_revenue ?? 0;
  const profit = weeklyData?.total_profit ?? 0;

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [debtors, setDebtors] = useState<DebtorEntry[]>([]);
  const [paidDebts, setPaidDebts] = useState<PaidDebt[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (inventoryData) {
      setInventory(inventoryData.map((p) => ({
        id: p.id,
        name: p.name,
        qty: p.quantity,
        cost: p.cost_price,
        selling: p.selling_price,
      })));
    }
  }, [inventoryData]);

  useEffect(() => {
    if (debtorsData) {
      setDebtors(debtorsData.debtors.map((d) => ({
        id: d.id,
        name: d.name,
        amount: d.amount,
        date: d.created_at.split("T")[0]!,
        items: d.items.map((i) => ({
          product_name: i.product_name,
          qty: i.qty,
          price: i.price,
        })),
      })));
    }
  }, [debtorsData]);

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.map((n) => ({
        id: n.id,
        title: n.title,
        desc: n.message,
        type: "system" as Notification["type"],
        time: n.created_at,
      })));
    }
  }, [notificationsData]);

  const [stagedProducts, setStagedProducts] = useState<StagedProduct[]>([]);
  const [activeStagedIdx, setActiveStagedIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [chatLogs, setChatLogs] = useState<string[]>([]);
  const [aiLang, setAiLang] = useState<AiLanguage>("en");
  const aiChips = useMemo<string[]>(() => {
    const map: Record<AiLanguage, string[]> = {
      en: ["Who is owing me?", "How much profit today?", "Inventory Summary"],
      yo: ["Ta l'o je mi?", "Elo ni ere mi loni?", "Akojopo oja"],
      ha: ["Wane ne yake bina?", "Nawa riba a yau?", "Takaitaccen kaya"],
      pidgin: ["Who dey owe me?", "How much profit I make today?", "Inventory wey remain"],
    };
    return map[aiLang] ?? map.en;
  }, [aiLang]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalId>(null);
  const [incomingTransferAmount, setIncomingTransferAmount] = useState(0);
  const [incomingTransferSender, setIncomingTransferSender] = useState("");
  const [incomingTransferBank, setIncomingTransferBank] = useState("");
  const [settleTarget, setSettleTarget] = useState<DebtorEntry | null>(null);
  const [collectTarget, setCollectTarget] = useState<DebtorEntry | null>(null);

  const pushNotification = useCallback((title: string, desc: string, type: Notification["type"]) => {
    setNotifications((prev) => [
      { id: Date.now(), title, desc, type, time: "Just Now" },
      ...prev,
    ]);
  }, []);

  const handleAuth = useCallback(() => {
    setAuthenticated(true);
    pushNotification("Session Active", "Merchant authenticated secure ledger session parameters.", "system");
  }, [pushNotification]);

  const simulateTransfer = useCallback(() => {
    if (inventory.length === 0) return;
    const idx = Math.floor(Math.random() * inventory.length);
    const item = inventory[idx];
    if (!item || item.qty <= 0) return;
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, qty: i.qty - 1 } : i,
      ),
    );
    pushNotification("Transfer Received", `₦${item.selling} transfer cleared for 1 unit of ${item.name}.`, "sale");
  }, [inventory, pushNotification]);

  const manualCashSale = useCallback(async (prodId: string, qty: number) => {
    const { api } = await import("@/lib/api");
    try {
      await api.post("/transactions/cash-sale", {
        sender_name: "Cash",
        items: [{ product_id: prodId, quantity: qty }],
      });
    } catch (err) {
      toast({ title: "Sale Failed", description: getErrorMessage(err, "Could not record cash sale with server. Saved locally."), variant: "destructive" });
    }
    setInventory((prev) => {
      const item = prev.find((i) => i.id === prodId);
      if (!item || item.qty < qty) return prev;
      pushNotification("Cash Sale Recorded", `Manually logged cash payment of ₦${item.selling * qty} for ${qty}x ${item.name}.`, "sale");
      return prev.map((i) =>
        i.id === prodId ? { ...i, qty: i.qty - qty } : i,
      );
    });
  }, [pushNotification, toast]);

  const processTransfer = useCallback(async (prodId: string, qty: number) => {
    const { api } = await import("@/lib/api");
    try {
      await api.post("/transactions/cash-sale", {
        sender_name: incomingTransferSender || "Transfer",
        items: [{ product_id: prodId, quantity: qty }],
      });
    } catch (err) {
      toast({ title: "Transfer Failed", description: getErrorMessage(err, "Could not record transfer with server. Saved locally."), variant: "destructive" });
    }
    setInventory((prev) => {
      const item = prev.find((i) => i.id === prodId);
      if (!item || item.qty < qty) return prev;
      pushNotification("Transfer Received", `₦${item.selling * qty} transfer cleared for ${qty}x ${item.name}.`, "sale");
      return prev.map((i) =>
        i.id === prodId ? { ...i, qty: i.qty - qty } : i,
      );
    });
  }, [incomingTransferSender, pushNotification, toast]);

  const logDebt = useCallback(async (name: string, amount: number, date: string, items: DebtorItem[]) => {
    try {
      await debtorsApi.create({
        name,
        amount,
        items_summary: items.map((i) => `${i.qty}× ${i.product_name}`).join(", "),
        items: items.map((i) => ({
          product_name: i.product_name,
          qty: i.qty,
          price: i.price,
        })),
      });
    } catch (err) {
      toast({ title: "Debt Log Failed", description: getErrorMessage(err, "Could not save debt to server. Saved locally."), variant: "destructive" });
    }
    setDebtors((prev) => [...prev, { id: String(Date.now()), name, amount, date, items }]);
    pushNotification("Credit Logged", `Logged ₦${amount} pending payment debt balance for ${name}.`, "credit");
  }, [pushNotification, toast]);

  const settleDebt = useCallback(async (id: string) => {
    try {
      await debtorsApi.settle(id, { payment_method: "CASH" });
    } catch (err) {
      toast({ title: "Settlement Failed", description: getErrorMessage(err, "Could not record settlement with server. Saved locally."), variant: "destructive" });
    }
    setDebtors((prev) => {
      const target = prev.find((d) => d.id === id);
      if (!target) return prev;
      setPaidDebts((p) => [{ name: target.name, amount: target.amount, time: "Just Now" }, ...p]);
      pushNotification("Debt Fully Settled", `${target.name} cleared balance of ₦${target.amount.toLocaleString()}.`, "system");
      return prev.filter((d) => d.id !== id);
    });
  }, [pushNotification, toast]);

  const openSettleConfirm = useCallback((id: string) => {
    const target = debtors.find((d) => d.id === id);
    if (target) {
      setSettleTarget(target);
      setActiveModal("settle-debt");
    }
  }, [debtors]);

  const openCollectDebt = useCallback((id: string) => {
    const target = debtors.find((d) => d.id === id);
    if (target) {
      setCollectTarget(target);
      setActiveModal("collect-debt");
    }
  }, [debtors]);

  const openIncomingTransfer = useCallback(() => {
    if (inventory.length === 0) return;
    const idx = Math.floor(Math.random() * inventory.length);
    const item = inventory[idx];
    if (!item) return;
    const multipliers = [1, 2, 3, 5];
    const m = multipliers[Math.floor(Math.random() * multipliers.length)] ?? 1;
    setIncomingTransferSender("");
    setIncomingTransferBank("");
    setIncomingTransferAmount(item.selling * m);
    setActiveModal("incoming-transfer");
  }, [inventory]);

  const receiveIncomingTransfer = useCallback(
    ({ amount, sender, bank }: { amount: number; sender: string; bank: string }) => {
      setIncomingTransferSender(sender);
      setIncomingTransferBank(bank);
      setIncomingTransferAmount(amount);
      setActiveModal("incoming-transfer");
    },
    [],
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setIncomingTransferAmount(0);
    setIncomingTransferSender("");
    setIncomingTransferBank("");
    setSettleTarget(null);
    setCollectTarget(null);
  }, []);

  const triggerBatchScan = useCallback(async (_files: FileList | null) => {
    if (!_files || _files.length === 0) return;
    setScanning(true);
    pushNotification("Processing Batch Upload", `Analyzing ${_files.length} product images.`, "system");
    let names: string[] = [];
    try {
      const res = await inventoryApi.extractProduct(Array.from(_files));
      names = res.names;
    } catch {
      pushNotification("Scan Note", "Could not reach product recognition. Using generic names.", "system");
    }
    const files = Array.from(_files);
    const newStaged: StagedProduct[] = files.map((f, i) => ({
      name: names[i] || `AI Parsed Item #${i + 1}`,
      qty: 0,
      cost: 0,
      selling: 0,
      img: URL.createObjectURL(f),
    }));
    setStagedProducts(newStaged);
    setActiveStagedIdx(0);
    setScanning(false);
  }, [pushNotification]);

  const addStagedProduct = useCallback((name = "") => {
    const placeholderImg = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60";
    const idx = stagedProducts.length;
    setStagedProducts((prev) => [
      ...prev,
      { name, qty: 1, cost: 0, selling: 0, img: placeholderImg },
    ]);
    setActiveStagedIdx(idx);
  }, [stagedProducts]);

  const updateStagedField = useCallback((idx: number, field: keyof StagedProduct, value: string | number) => {
    setStagedProducts((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    );
  }, []);

  const commitBatch = useCallback(async () => {
    if (stagedProducts.length === 0) return;
    try {
      for (const s of stagedProducts) {
        await inventoryApi.create({
          name: s.name,
          cost_price: s.cost,
          selling_price: s.selling,
          quantity: s.qty,
        });
      }
    } catch (err) {
      toast({ title: "Batch Save Failed", description: getErrorMessage(err, "Could not save products to server. Saved locally."), variant: "destructive" });
    }
    setInventory((prev) => {
      const maxNum = prev.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0);
      return [
        ...prev,
        ...stagedProducts.map((s, i) => ({
          id: `p-local-${maxNum + i + 1}`,
          name: s.name,
          qty: s.qty,
          cost: s.cost,
          selling: s.selling,
        })),
      ];
    });
    pushNotification("Batch Saved Successfully", `Appended ${stagedProducts.length} new items into verified smart inventory frameworks.`, "sale");
    setStagedProducts([]);
  }, [stagedProducts, pushNotification, toast]);

  const discardBatch = useCallback(() => {
    setStagedProducts([]);
    setActiveStagedIdx(0);
  }, []);

  const submitAiQuery = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;
    const productList = inventory.map((i) => `${i.name} (stock: ${i.qty}, price: ₦${i.selling})`).join("; ");
    const debtorList = debtors.map((d) => `${d.name} (owes: ₦${d.amount})`).join("; ");
    const ctxParts: string[] = [];
    if (productList) ctxParts.push(`Products in stock: ${productList}.`);
    if (debtorList) ctxParts.push(`Debtors: ${debtorList}.`);
    const context = ctxParts.length > 0 ? ctxParts.join(" ") + "\n\n" : "";
    const query = context + q;
    setChatLogs((prev) => [...prev, `user:${q}`]);
    setAiLoading(true);
    try {
      const res = await voiceApi.askText(query, aiLang);
      setChatLogs((prev) => [...prev, `bot:${res.reply}`]);
    } catch (err) {
      toast({
        title: "Assistant Unavailable",
        description: getErrorMessage(err, "Could not reach the AI advisor. Please try again."),
        variant: "destructive",
      });
      setChatLogs((prev) => [
        ...prev,
        "bot:Sorry, I could not reach the advisor right now. Please try again.",
      ]);
    } finally {
      setAiLoading(false);
    }
  }, [aiLang, inventory, debtors, toast]);

  const submitAiVoice = useCallback(async (audio: Blob) => {
    if (audio.size === 0) return;
    setAiLoading(true);
    try {
      const productList = inventory.map((i) => `${i.name} (stock: ${i.qty}, price: ₦${i.selling})`).join("; ");
      const debtorList = debtors.map((d) => `${d.name} (owes: ₦${d.amount})`).join("; ");
      const ctxParts: string[] = [];
      if (productList) ctxParts.push(`Products in stock: ${productList}.`);
      if (debtorList) ctxParts.push(`Debtors: ${debtorList}.`);
      const context = ctxParts.length > 0 ? ctxParts.join(" ") : "";
      const res = await voiceApi.askVoice(audio, context);
      setChatLogs((prev) => [...prev, `user:${res.transcript}`]);
      setChatLogs((prev) => [...prev, `bot:${res.reply}`]);
      const detected = res.language_detected as AiLanguage;
      if (["en", "yo", "ha", "pidgin"].includes(detected)) {
        setAiLang(detected);
      }
    } catch (err) {
      toast({
        title: "Voice Note Failed",
        description: getErrorMessage(err, "Could not process the voice note. Please try again."),
        variant: "destructive",
      });
      setChatLogs((prev) => [
        ...prev,
        "bot:Sorry, I could not understand that voice note. Please try again.",
      ]);
    } finally {
      setAiLoading(false);
    }
  }, [inventory, debtors, toast]);

  return (
    <AppContext.Provider value={{
      authenticated, accountName, accountNumber, bankName, revenue, profit,
      inventory, debtors, paidDebts, notifications, stagedProducts,
      activeStagedIdx, scanning, chatLogs, aiChips, aiLang, aiLoading, activeModal,
      incomingTransferAmount, incomingTransferSender, incomingTransferBank,
      settleTarget, collectTarget,
      setAuthenticated, setActiveStagedIdx, setAiLang, setActiveModal, closeModal,
      pushNotification, handleAuth, simulateTransfer, manualCashSale, processTransfer,
      logDebt, settleDebt, openSettleConfirm, openCollectDebt, openIncomingTransfer,
      receiveIncomingTransfer,
      triggerBatchScan, addStagedProduct, updateStagedField,
      commitBatch, discardBatch, submitAiQuery, submitAiVoice,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
