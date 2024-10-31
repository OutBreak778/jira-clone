"use client"

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

const MobileSidebar = () => {
    
    const [isOpen, setIsOpen] = useState(false)
    const path = usePathname()

    useEffect(() => {
        setIsOpen(false)
    }, [path])

  return (
    <Sheet modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"secondary"} size={"icon"} className="flex lg:hidden">
          <MenuIcon className="size-4 font-bold" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64 md:w-80" side="left">
        <SheetTitle></SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
