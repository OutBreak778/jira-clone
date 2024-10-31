import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import ResponsiveModal from "@/components/ResponsiveModal";

export const useConfirm = (
  title: string,
  message: string,
  variantButton: ButtonProps["variant"] = "outline"
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };
  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  
  const confirmDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="pt-6">
          <CardHeader className="pt-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="w-full flex flex-col gap-4 lg:flex-row items-center justify-end gap-y-2">
            <Button
              onClick={handleCancel}
              variant={"outline"}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variantButton}
              className="w-full"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [confirmDialog, confirm];
};
