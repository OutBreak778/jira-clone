import Analytics from "@/components/Analytics";
import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/actions";
import { getProjects } from "@/features/projects/actions";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectIdProps {
  params: {
    projectId: string;
  };
}

const page = async ({ params }: ProjectIdProps) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const initialValue = await getProjects({ projectId: params.projectId });

  if(!initialValue) {
    throw new Error("Project not found.")
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <ProjectAvatar name={initialValue.name} />
          <p className="text-lg capitalize font-medium">
          {initialValue.name}
          </p>
        </div>
        <div>
          <Button className="text-sm rounded-lg" variant={"secondary"} size={"sm"} asChild>
            <Link href={`/workspaces/${initialValue.workspaceId}/projects/${initialValue.$id}/settings`}>
            <PencilIcon className="size-4 mr-2" />
            Edit Project

            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};

export default page;
