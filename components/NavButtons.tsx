"use client";

import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { CheckCircle2, Home, Settings, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const routes = [
  {
    id: 1,
    label: "Home",
    href: "/dashboard",
    icon: Home
  },
  {
    id: 2,
    label: "My Tasks",
    href: "/tasks",
    icon: CheckCircle2
  },
  {
    id: 3,
    label: "Members",
    href: "/members",
    icon: UserCircle2
  },
];

const NavButtons = () => {
  const path = usePathname();
  const workspaceId = useWorksapceId()

  return (
    <nav className="lg:flex items-center px-4 hidden">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}/${item.href}`
        const isActive = path === fullHref
         return (
        
          <Link className={cn("mr-5 hover:bg-gray-100/60 rounded-lg px-3 py-2",isActive, path === item.href && "underline underline-offset-4")} href={item.href} key={item.id}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  );
};

export default NavButtons;
