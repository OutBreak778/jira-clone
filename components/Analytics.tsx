"use client";

import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import React from "react";
import AnalyticCard from "./AnalyticCard";
import { useGetTask } from "@/features/tasks/api/use-get-tasks";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const Analytics = () => {
  const workspaceId = useWorksapceId();
  const { data: project } = useGetProjects({ workspaceId });
  const { data: member } = useGetMember({ workspaceId });
  const { data: tasks } = useGetTask({ workspaceId });
  return (
    <ScrollArea className="border-none rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row space-x-3">
        <div className="flex items-center flex-1 space-x-2">
          <AnalyticCard
            title="Total Tasks"
            value={tasks?.total}
          />
          <AnalyticCard
            title="Total Projects"
            value={project?.total}
          />
          <AnalyticCard
            title="Total Members"
            value={member?.total}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Analytics;
