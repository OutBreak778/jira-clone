import React from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none outline-none px-4 pb-5 overflow-y-auto hide-scrollbar max-h-[85vh]">
          <DialogHeader className="flex px-3 py-3">
            <DialogTitle className="text-xl font-bold">
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
 
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none outline-none px-4 pb-5 overflow-y-auto hide-scrollbar max-h-[85vh]">
          <DialogHeader className="flex px-3 py-3">
            <DialogTitle className="text-xl font-bold">
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
  );
};

export default ResponsiveModal;
