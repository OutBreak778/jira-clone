"use client";

import React, { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";

const ProjectListDashboard = () => {
  
  const workspaceId = useWorksapceId();
  const { data: projects } = useGetProjects({workspaceId})

  return (
    <Card className="w-full lg:w-1/2  h-full border-none shadow-none">
      <CardHeader className="flex gap-x-4 p-6 space-y-1">
        <CardTitle className="flex items-start text-xl font-bold -mt-3">
          Projects List &nbsp;  ({projects?.total} )
        </CardTitle>
      </CardHeader>
      <Separator className="border border-gray-200 " />
      <CardContent className="p-5 mb-8">
        {projects?.documents.slice(0, 4).map((item, index) => (
          <Fragment key={index}>
            <div className="flex bg-white py-1 rounded-lg items-center gap-3 px-4">
              <div className="flex flex-row justify-between w-full">
                <p className="text-md mb-2 font-medium">{item.name}</p>
              </div>
              <ProjectAvatar name={item.name} className="size-8 mb-1" />
            </div>
            {index < projects.documents.length - 1 && (
              <Separator className="border border-gray-200/70 my-3" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectListDashboard;
