"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Header = () => {
  const path = usePathname()
  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-x border-b border-gray-200 bg-white/15 backdrop-blur-lg transition-all">
      <div className="flex items-center justify-between px-3 lg:px-16 py-4 ">
        <Link href="/" className="flex">
          {" "}
          <Image
            className="mr-2"
            width={46}
            height={46}
            alt="Image"
            src="/logo.svg"
          />
          <span className="text-xl font-bold">OUTBREAK</span>
        </Link>
        <Button size={"sm"} variant={"outline"}>
          <Link href={path === "/sign-in" ? "/sign-up": "/sign-in"}>
            {path === "/sign-in" ? "sign-up" : "login"}
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Header;
