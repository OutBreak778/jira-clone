import { Project } from "@/features/projects/type";
import React from "react";
import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import MemberAvatar from "@/features/members/components/MembersAvatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useRouter } from "next/navigation";

interface EventCardProps {
  title: string;
  assignee: any;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColor: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500 bg-pink-200",
  [TaskStatus.DONE]: "border-l-emerald-500 bg-emerald-200",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500 bg-yellow-200",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500 bg-blue-200",
  [TaskStatus.TODO]: "border-l-red-500 bg-red-200",
};

const EventCard = ({
  title,
  assignee,
  project,
  status,
  id,
}: EventCardProps) => {
    const workspaceId = useWorksapceId()
    const router = useRouter()

    const onClick = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation()
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }
    return (
    <div className="px-1">
      <div
      onClick={onClick}
        className={cn(
          "p-2 text-xs bg-white text-primary border- rounded-md border-l-4 flex flex-col gap-y-2 cursor-pointer hover:opacity-75 transition-all",
          statusColor[status]
        )}
      >
        <p className="font-medium py-12">{title}</p>
      </div>
    </div>
  );
};

export default EventCard;
