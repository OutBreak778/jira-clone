"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-worspaces";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import WorkspaceAvatar from "@/features/workspaces/components/WorkspaceAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useRouter } from "next/navigation";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import useCreateWorkspaceModal from "@/features/workspaces/hooks/use-create-worksapce-modal";

const WorkspaceSwitcher = () => {
  const WorkspaceId = useWorksapceId();
  const { data: workspaces } = useGetWorkspaces();
  const router = useRouter();
  const { Modalopen } = useCreateWorkspaceModal();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-gray-700">Workspace</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <PlusCircleIcon
                onClick={Modalopen}
                className="size-5 text-gray-700 cursor-pointer hover:opacity-80"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to create worksapce</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select onValueChange={onSelect} value={WorkspaceId}>
        <SelectTrigger className="w-full bg-gray-200 font-medium p-2">
          <SelectValue placeholder="Select your workspaces" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((item) => (
            <SelectItem
              className="cursor-pointer hover:bg-white"
              value={item.$id}
              key={item.$id}
            >
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar name={item.name} />
                <span>{item.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
