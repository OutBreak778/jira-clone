import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/actions";
import { Home } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import React from "react";
import WorkspaceIdClient from "./Client";

const page = async ({ params }: { params: { workspaceId: string } }) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <Heading
        title="Home"
        description="Monitor all your project and workspace here."
        icon={Home}
        bgColor="bg-gray-300/40"
        iconColor="text-gray-800"
      />
      
      <WorkspaceIdClient />
    </div>
  );
};

export default page;
