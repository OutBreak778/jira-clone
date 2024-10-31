import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavButtons from "./NavButtons";
import UserButton from "@/features/auth/components/UserButton";
import MobileSidebar from "./MobileSidebar";
import Heading from "./Heading";
import { Home } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <MobileSidebar />

      <div>
        <Link href="/" className="flex lg:hidden items-center justify-center">
          <Image
            src="/logo.svg"
            className="text-gray-700"
            alt="logo"
            width={46}
            height={46}
          />
          <span className="text-xl font-bold ml-3 text-gray-800">OUTBREAK</span>
        </Link>
      </div>
      {/* <div>
        <Heading
          title="Dashboard page"
          description="Monitor all your task and project here"
          icon={Home}
          bgColor="bg-gray-300/30"
          iconColor="text-gray-800"
          className="mt-4 absolute"
        />
      </div> */}
      <UserButton />
    </div>
  );
};

export default Navbar;
