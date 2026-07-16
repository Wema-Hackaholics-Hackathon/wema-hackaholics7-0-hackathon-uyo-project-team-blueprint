import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { InventoryView } from "@/components/views/inventory-view";
import { useApp } from "@/store/app-context";

function InventoryPage() {
  const { inventory, stagedProducts, activeStagedIdx, setActiveStagedIdx, triggerBatchScan, updateStagedField, commitBatch, discardBatch } = useApp();

  return (
    <InventoryView
      inventory={inventory}
      stagedProducts={stagedProducts}
      activeStagedIdx={activeStagedIdx}
      onBatchScan={triggerBatchScan}
      onSelectStaged={setActiveStagedIdx}
      onUpdateStagedField={updateStagedField}
      onCommitBatch={commitBatch}
      onDiscardBatch={discardBatch}
    />
  );
}

const inventoryRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/inventory",
  component: InventoryPage,
});

export const Route = inventoryRoute;
