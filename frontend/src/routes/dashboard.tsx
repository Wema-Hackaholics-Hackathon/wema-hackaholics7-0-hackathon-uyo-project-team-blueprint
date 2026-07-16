import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { DashboardView } from "@/components/views/dashboard-view";
import { useApp } from "@/store/app-context";

function DashboardPage() {
  const { revenue, profit, inventory, accountName, accountNumber, openIncomingTransfer, setActiveModal } = useApp();
  const navigate = useNavigate();

  return (
    <DashboardView
      revenue={revenue}
      profit={profit}
      inventory={inventory}
      accountName={accountName}
      accountNumber={accountNumber}
      onSimulateTransfer={openIncomingTransfer}
      onOpenCashModal={() => setActiveModal("manual-cash")}
      onNavigateInventory={() => navigate({ to: "/inventory" })}
    />
  );
}

const dashboardRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

export const Route = dashboardRoute;
