import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { InventoryView } from "@/components/views/inventory-view";
import { useApp } from "@/store/app-context";

function InventoryPage() {
  const { inventory, stagedProducts, activeStagedIdx, scanning, setActiveStagedIdx, triggerBatchScan, updateStagedField, commitBatch, discardBatch, openEditProduct } = useApp();

  return (
    <InventoryView
      inventory={inventory}
      stagedProducts={stagedProducts}
      activeStagedIdx={activeStagedIdx}
      scanning={scanning}
      onBatchScan={triggerBatchScan}
      onSelectStaged={setActiveStagedIdx}
      onUpdateStagedField={updateStagedField}
      onCommitBatch={commitBatch}
      onDiscardBatch={discardBatch}
      onOpenEdit={openEditProduct}
    />
  );
}

const inventoryRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/inventory",
  component: InventoryPage,
});

export const Route = inventoryRoute;
