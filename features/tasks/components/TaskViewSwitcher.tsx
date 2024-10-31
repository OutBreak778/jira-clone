"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ListChecksIcon, Loader2, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetTask } from "../api/use-get-tasks";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import DataFilters from "./DataFilters";
 
import useCreateTaskstModal from "../hooks/use-create-tasks-modal";
import { useTaskFilter } from "../hooks/use-task-filters";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";
import DateCalendar from "./DateCalendar";

const TaskViewSwitcher = () => {
  const workspaceId = useWorksapceId();
  const { open } = useCreateTaskstModal();
  
  const [{ status, assigneeId, dueDate, projectId }] = useTaskFilter();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const { data: tasks, isLoading: isLoadingTask } = useGetTask({
    workspaceId,
    projectId,
    assigneeId,
    dueDate,
    status,
  });

  return (
    <Tabs
      className="flex-1 w-full rounded-lg border"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-3" /> New
          </Button>
        </div>
        <Separator className="border border-gray-200 my-3" />

        <div className="w-full">
          <DataFilters />
        </div>
        <Separator className="border border-gray-200 my-3" />
        {isLoadingTask ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-1">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
 
            <TabsContent value="calendar" className="mt-1 h-full pb-2">
              <DateCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
