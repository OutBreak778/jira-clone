import { getCurrent } from "@/features/auth/actions";
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm";
import { redirect } from "next/navigation";
import React from "react";

interface workspaceJoinProps {
  params: {
    workspaceId: string;
    inviteCode: string
  };
}

const page = async ({ params }: workspaceJoinProps) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if(!initialValues) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default page;
