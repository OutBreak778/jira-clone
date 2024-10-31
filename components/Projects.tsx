"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { PlusCircleIcon } from "lucide-react";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useCreateProjectModal from "@/features/projects/hooks/use-create-project-modal";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const Projects = () => {
  const workspaceId = useWorksapceId();
  const { data } = useGetProjects({ workspaceId });
  const path = usePathname();
  const projectId = null;
  const { open } = useCreateProjectModal();

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase text-gray-700">Projects</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <PlusCircleIcon
                onClick={open}
                className="size-5 text-gray-700 cursor-pointer hover:opacity-80"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to create projects</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="border-2 border-gray-200/40 rounded-lg w-full whitespace-nowrap shrink-0 overflow-hidden h-44">

      {
        data?.total === 0 && (
          <div className="text-md text-muted-foreground flex items-center justify-center border-dashed border-2 border-gray-400/30 shadow-sm h-[20vh] mt-3 rounded-md">
            No project created yet
          </div>
        )
      }
      {data?.documents.map((item) => {
        const href = `/workspaces/${workspaceId}/projects/${item.$id}`;
        const isActive = path === href;
        return (
          <Link key={item.$id} href={href}>
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-md opacity-85 hover:opacity-100 cursor-pointer transition-all text-gray-700",
                isActive &&
                  "bg-white rounded-md shadow-sm hover:opacity-100 text-primary"
              )}
            >
                <ProjectAvatar name={item.name} />
              <span className="truncate text-sm">{item.name}</span>
            </div>
          </Link>
        );
      })}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default Projects;
