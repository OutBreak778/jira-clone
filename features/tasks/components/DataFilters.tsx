import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import React from "react";
import { TaskStatus } from "../types";
import { useTaskFilter } from "../hooks/use-task-filters";
import DatePicker from "@/components/DatePicker";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

const DataFilters = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorksapceId();
  const { data: projects, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    workspaceId,
  });
  const isLoading = isLoadingMember || isLoadingProject;

  const projectOptions = projects?.documents.map((item) => ({
    value: item.$id,
    label: item.name,
  }));
  const memberOptions = member?.documents.map((item) => ({
    value: item.$id,
    label: item.name,
  }));

  const [{ status, assigneeId, dueDate, projectId, search }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };
  //   const onAssigneeChange = (value: string) => {
  //     if (value === "all") {
  //       setFilters({ assigneeId: null });
  //     } else {
  //       setFilters({ assigneeId: value as string });
  //     }
  //   };
  //   const onProjectChange = (value: string) => {
  //     if (value === "all") {
  //       setFilters({ projectId: null });
  //     } else {
  //       setFilters({ projectId: value as string });
  //     }
  //   };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-x-3 gap-y-3">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="bg-gray-100 text-black w-full lg:w-auto h-10">
          <div className="flex items-center gap-y-3">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-100 text-black">
          <SelectItem value="all" className="outline-none">
            All Status
          </SelectItem>
          <Separator className="border border-gray-200 my-3" />

          <SelectItem
            className="cursor-pointer border-none"
            value={TaskStatus.BACKLOG}
          >
            Backlog
          </SelectItem>
          <SelectItem
            className="cursor-pointer border-none"
            value={TaskStatus.IN_PROGRESS}
          >
            In Progress
          </SelectItem>
          <SelectItem
            className="cursor-pointer border-none"
            value={TaskStatus.IN_REVIEW}
          >
            In Review
          </SelectItem>
          <SelectItem
            className="cursor-pointer border-none"
            value={TaskStatus.TODO}
          >
            Todo
          </SelectItem>
          <SelectItem
            className="cursor-pointer border-none"
            value={TaskStatus.DONE}
          >
            Done
          </SelectItem>
        </SelectContent>
      </Select>
      <DatePicker
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        placeholder="Due Date"
        onChange={(item) => {
          setFilters({ dueDate: item ? item.toISOString() : null });
        }}
      />
      {/* <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="bg-gray-100 text-black w-full lg:w-auto h-10">
          <div className="flex items-center gap-y-3">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Assignee" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-100 text-black">
          <SelectItem value="all" className="outline-none">
            All Assignee
          </SelectItem>
          <Separator className="border border-gray-200 my-3" />
          {memberOptions?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={(value) => onProjectChange(value)}
      >
        <SelectTrigger className="bg-gray-100 text-black w-full lg:w-auto h-10">
          <div className="flex items-center gap-y-3">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Projects" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-100 text-black">
          <SelectItem value="all" className="outline-none">
            All Projects
          </SelectItem>
          <Separator className="border border-gray-200 my-3" />
          {projectOptions?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
    </div>
  );
};

export default DataFilters;
