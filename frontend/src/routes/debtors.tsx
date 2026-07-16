import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { DebtorsView } from "@/components/views/debtors-view";
import { useApp } from "@/store/app-context";

function DebtorsPage() {
  const { debtors, openSettleConfirm, openCollectDebt, setActiveModal } = useApp();

  return (
    <DebtorsView
      debtors={debtors}
      onOpenLogDebt={() => setActiveModal("log-debt")}
      onCollectDebt={openCollectDebt}
      onMarkPaid={openSettleConfirm}
    />
  );
}

const debtorsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/debtors",
  component: DebtorsPage,
});

export const Route = debtorsRoute;
