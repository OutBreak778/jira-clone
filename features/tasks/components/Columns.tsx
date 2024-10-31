"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Tasks } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import MemberAvatar from "@/features/members/components/MembersAvatar";
import TaskDate from "./TaskDate";
import { Badge } from "@/components/ui/badge";
import { SnakecaseToTitlecase } from "../../../lib/utils";
import { TaskActions } from "./TaskActions";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Tasks>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1 ">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({row}) => {
        const project = row.original.projectId

        return(
            <div className="flex items-center gap-x-2 text-sm font-medium">
                <ProjectAvatar name={project} className="size-7" />
                <p className="line-clamp-1">
                  {project}
                </p>
            </div>
        )
      }
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Assignee
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({row}) => {
        const assignee = row.original.assigneeId

        return(
            <div className="flex items-center gap-x-2 text-sm font-medium">
                <MemberAvatar name={assignee} fallbackString="text-xs" className="size-7" />
                <p className="line-clamp-1">
                  {assignee}
                </p>
            </div>
        )
      }
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge variant={status}>{SnakecaseToTitlecase(status)}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({row}) => {
      const id = row.original.$id
      const projectId = row.original.projectId

      return(
        <TaskActions id={id} projectId={projectId}>
          <Button variant={"secondary"} className="px-2" >
            <MoreVerticalIcon className="size-5 text-muted-foreground " />
          </Button>
        </TaskActions>
      )
    }
  }
];
