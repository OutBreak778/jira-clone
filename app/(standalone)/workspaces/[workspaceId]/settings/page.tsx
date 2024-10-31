import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import UpdateWorkspaceForm from "@/features/workspaces/components/UpdateWorkSpaceForm";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceIdSettings {
  params: {
    workspaceId: string;
  };
}

const page = async ({ params }: WorkspaceIdSettings) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValue = await getWorkspace({ workspaceId: params.workspaceId });
  if (!initialValue) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValue={initialValue} />
    </div>
  );
};

export default page;
