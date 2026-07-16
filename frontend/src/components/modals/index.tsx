import { CashSaleModal } from "./cash-sale-modal";
import { LogDebtModal } from "./log-debt-modal";
import { IncomingTransferModal } from "./incoming-transfer-modal";
import { SettleDebtConfirmModal } from "./settle-debt-modal";
import { CollectDebtDrawer } from "./collect-debt-drawer";
import { useApp } from "@/store/app-context";

export function Modals() {
  const {
    activeModal,
    closeModal,
    inventory,
    manualCashSale,
    processTransfer,
    logDebt,
    settleDebt,
    settleTarget,
    collectTarget,
    incomingTransferAmount,
    accountName,
    accountNumber,
    bankName,
    pushNotification,
  } = useApp();

  return (
    <>
      <IncomingTransferModal
        open={activeModal === "incoming-transfer"}
        onClose={closeModal}
        inventory={inventory}
        incomingAmount={incomingTransferAmount}
        onConfirm={(basket) => {
          basket.forEach(({ prodId, qty }) => processTransfer(prodId, qty));
        }}
      />
      <CashSaleModal
        open={activeModal === "manual-cash"}
        onClose={closeModal}
        inventory={inventory}
        onConfirm={manualCashSale}
      />
      <LogDebtModal
        open={activeModal === "log-debt"}
        onClose={closeModal}
        onConfirm={logDebt}
        inventory={inventory}
      />
      <SettleDebtConfirmModal
        open={activeModal === "settle-debt"}
        onClose={closeModal}
        target={settleTarget}
        onConfirm={settleDebt}
      />
      <CollectDebtDrawer
        open={activeModal === "collect-debt"}
        onClose={closeModal}
        target={collectTarget}
        bankName={bankName}
        accountNumber={accountNumber}
        accountName={accountName}
        onRemind={(title, message) => pushNotification(title, message, "credit")}
      />
    </>
  );
}
