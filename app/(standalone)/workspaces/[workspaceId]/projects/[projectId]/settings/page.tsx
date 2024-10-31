import { getCurrent } from "@/features/auth/actions";
import { getProjects } from "@/features/projects/actions";
import EditProjectForm from "@/features/projects/components/EditProjectForm";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectSettingsPageProps {
  params: {
    projectId: string;
  };
}

const page = async ({ params }: ProjectSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProjects({ projectId: params.projectId });
  if(!initialValues) {
    throw new Error("Project not found")
  }
  return (
      <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default page;
