"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Tasks } from "../features/tasks/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CalendarIcon, MoreVerticalIcon } from "lucide-react";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import MemberAvatar from "@/features/members/components/MembersAvatar";
import TaskDate from "../features/tasks/components/TaskDate";
import { format } from "date-fns";

export const columnsDashboard: ColumnDef<Tasks>[] = [
 
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Task Name
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1 ">{name}</p>;
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
          >
            Assignee
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
        >
          Due Date
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return(
        <div className="flex gap-x-2 items-center">
          <CalendarIcon className="mr-2 size-" />
          <p className="text-muted-foreground">{
              format(dueDate, "PPP")
            }</p>
        </div>
      )
    },
  },
 
];
