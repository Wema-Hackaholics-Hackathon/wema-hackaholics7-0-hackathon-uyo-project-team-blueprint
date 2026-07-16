import { useState } from "react";
import { X, CurrencyNgn } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
} from "@/components/ui/drawer";
import type { InventoryItem } from "@/store/types";

interface CashSaleModalProps {
  open: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onConfirm: (prodId: number, qty: number) => void;
}

export function CashSaleModal({ open, onClose, inventory, onConfirm }: CashSaleModalProps) {
  const [prodId, setProdId] = useState(inventory[0]?.id ?? 0);
  const [qty, setQty] = useState(1);

  const handleConfirm = () => {
    onConfirm(prodId, qty);
    setQty(1);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <CurrencyNgn weight="fill" className="h-4 w-4" />
              Record Manual Cash Sale
            </span>
          </DrawerTitle>
          <DrawerClose>
            <X weight="bold" className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        <DrawerBody>
          <div className="space-y-4 text-xs">
            <div>
              <label className="mb-1.5 block font-semibold text-muted-foreground">Select Sold Product</label>
              <Select value={String(prodId)} onValueChange={(v) => setProdId(parseInt(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((i) => (
                    <SelectItem key={i.id} value={String(i.id)}>
                      {i.name} (Stock: {i.qty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block font-semibold text-muted-foreground">Quantity Dispatched</label>
              <Input
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>
          </div>
        </DrawerBody>
        <div className="border-t border-border px-5 py-4 pb-8">
          <Button
            onClick={handleConfirm}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider"
          >
            Confirm Cash Sale
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
