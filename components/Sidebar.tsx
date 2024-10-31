"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { CheckCircle2, Home, Settings, UserCircle2 } from "lucide-react";
import Projects from "./Projects";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const settingsRoute = [
  {
    id: 1,
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
const memberRoute = [
  {
    id: 3,
    label: "Members",
    href: "/members",
    icon: UserCircle2,
  },
];

const routes = [
  {
    id: 1,
    label: "Home",
    href: "",
    icon: Home,
  },
  {
    id: 2,
    label: "My Tasks",
    href: "/tasks",
    icon: CheckCircle2,
  },
];
const Sidebar = () => {
  const workspaceId = useWorksapceId();
  const path = usePathname();
  return (
    <ScrollArea className="h-full w-full p-4 bg-gray-100">
      <Link href="/" className="flex mt-1 items-center justify-center">
        <Image
          src="/logo.svg"
          className="text-gray-700"
          alt="logo"
          width={46}
          height={46}
        />
        <span className="text-xl font-bold ml-3 text-gray-800">OUTBREAK</span>
      </Link>
      <Separator className="border border-gray-200 mt-2" />
      <WorkspaceSwitcher />
      <Separator className="border border-gray-200 mt-2" />
      <p className="text-xs uppercase text-gray-700 mt-3">Projects</p>
      <div className="mt-2">
        {routes.map((item) => {
          const Icon = item.icon;
          const fullHref = `/workspaces/${workspaceId}/${item.href}`;
          const isActive = path === item.href

          return (
            <Link key={item.id} href={fullHref}>
              <div
                className={cn(
                  "flex px-4 py-3 border-2 border-gray-100/20 rounded-lg hover:bg-gray-300/30 hover:text-black transition-all items-center justify-start",
                  isActive && "bg-white rounded-lg"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 mr-3 text-gray-600",
                  )}
                />
                <p className={cn("text-gray-600 text-md")}>{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <Separator className="border border-gray-200 mt-4" />
      <p className="text-xs uppercase text-gray-700 mt-3">Standalone</p>
      {settingsRoute.map((item) => {
        const fullHref = `/workspaces/${workspaceId}/${item.href}`;
        const Icon = item.icon;
        return (
          <ul className={cn("my-2")} key={item.id}>
            <Link
              className={cn(
                "flex px-4 py-3 border-2 border-gray-100/20 rounded-lg hover:bg-gray-300/30 hover:text-black transition-all items-center justify-start",
                path === item.href &&
                  "bg-white shadow-sm border border-gray-300/20"
              )}
              href={fullHref}
            >
              <Icon
                className={cn(
                  "size-5 mr-3 text-gray-600",
                  path === item.href && "font-bold size-6"
                )}
              />
              <p className={cn("text-gray-600 text-md")}>{item.label}</p>
            </Link>
          </ul>
        );
      })}
      {memberRoute.map((item) => {
        const fullHref = `/workspaces/${workspaceId}/${item.href}`;
        const Icon = item.icon;

        return (
          <ul className="my-2" key={item.id}>
            <Link
              className={cn(
                "flex px-4 py-3 border-2 border-gray-100/20 rounded-lg hover:bg-gray-300/30 hover:text-black transition-all items-center justify-start",
                path === item.href &&
                  "bg-white shadow-sm border border-gray-300/20"
              )}
              href={fullHref}
            >
              <Icon
                className={cn(
                  "size-5 mr-3 text-gray-600",
                  path === item.href && "font-bold size-6"
                )}
              />
              <p className={cn("text-gray-600 text-md")}>{item.label}</p>
            </Link>
          </ul>
        );
      })}
      <Separator className="border border-gray-200 mt-2" />
      <Projects />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default Sidebar;
