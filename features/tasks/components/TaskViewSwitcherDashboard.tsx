"use client";

import React, { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetTask } from "../api/use-get-tasks";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useTaskFilter } from "../hooks/use-task-filters";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import Link from "next/link";
import TaskDate from "./TaskDate";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const TaskViewSwitcherDashboard = () => {
  const workspaceId = useWorksapceId();

  const [{ status, assigneeId, dueDate, projectId }] = useTaskFilter();
 
  const { data: tasks } = useGetTask({
    workspaceId,
    projectId,
    assigneeId,
    dueDate,
    status,
  });

  return (
    <Card className="w-full lg:w-1/2 h-full border-none shadow-none">
      <CardHeader className="flex gap-x-4 p-6 space-y-1">
        <CardTitle className="flex items-start text-xl font-bold -mt-3">
          Tasks List &nbsp; ({tasks?.total})
        </CardTitle>
      </CardHeader>
      <Separator className="border border-gray-200 " />
      <CardContent className="p-5 ">
        {tasks?.documents.slice(0, 3).map((item, index) => (
          <Fragment key={index}>
            <div className="flex bg-white py-1 rounded-lg items-center gap-3 px-4">
              <div className="flex flex-col w-full">
                <p className="text-md font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground flex">
                    <CalendarIcon className="size-3 mr-2" />
                    {format(item.dueDate, "PPP")}
                </p>
              </div>
              <ProjectAvatar name={item.name} className="size-8 mb-1" />
            </div>
            {index < tasks.documents.length - 1 && (
              <Separator className="border border-gray-200/70 my-3" />
            )}
          </Fragment>
        ))}
      </CardContent>
      <Separator className="border border-gray-200/70 my-1" />
      <CardFooter className="flex items-center gap-x-2">
        <Button variant={"outline"} className="w-full mt-4">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show all</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskViewSwitcherDashboard;
