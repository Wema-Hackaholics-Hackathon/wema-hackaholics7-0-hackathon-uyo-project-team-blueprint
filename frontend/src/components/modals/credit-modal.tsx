import { X, ShieldCheck, Bank, Camera, Coin } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
} from "@/components/ui/drawer";

interface CreditModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreditModal({ open, onClose }: CreditModalProps) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Credit Profile</DrawerTitle>
          <DrawerClose>
            <X weight="bold" className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        <DrawerBody>
          <div className="bg-foreground p-6 rounded-2xl text-center relative overflow-hidden">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
              Traka Score
            </p>
            <h2 className="text-5xl font-black text-background mb-2">
              742 <span className="text-sm text-muted-foreground">/ 850</span>
            </h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold">
              <ShieldCheck weight="fill" />
              Tier 1 Prime
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Parameters
            </h4>
            <ParamRow icon={Coin} label="Cash Flow" value="Excellent" valueColor="text-primary" />
            <ParamRow icon={Camera} label="Inventory Sync" value="Active" valueColor="text-primary" />
            <ParamRow icon={Bank} label="Receiving Account (ALAT)" value="8123456789" />
          </div>
        </DrawerBody>
        <div className="border-t border-border px-5 py-4 pb-8">
          <Button className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2">
            <Coin weight="fill" className="text-yellow-500 h-5 w-5" />
            Apply for ₦250k Loan
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ParamRow({ icon: Icon, label, value, valueColor }: { icon: React.ElementType; label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-3">
        <Icon weight="fill" className="h-5 w-5 text-primary" />
        <span className="text-xs font-bold text-foreground">{label}</span>
      </div>
      <span className={cn("text-[10px] font-bold", valueColor || "text-muted-foreground")}>{value}</span>
    </div>
  );
}
