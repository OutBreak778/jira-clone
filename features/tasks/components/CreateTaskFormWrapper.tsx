import { Card, CardContent } from "@/components/ui/card";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader2 } from "lucide-react";
import React from "react";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskFormWrapperProps {
  onCancel?: () => void;
}

const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorksapceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMember } = useGetMember({
    workspaceId,
  });

  const projectOption = projects?.documents.map((item) => ({
    id: item.$id,
    name: item.name,
  }));

  const memberOption = members?.documents.map((item) => ({
    id: item.$id,
    name: item.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMember;

  if (isLoading) {
    return (
      <Card className="h-[740px] w-full border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-7 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  return (
    <div>
      <CreateTaskForm
        onCancel={onCancel}
        projectOptions={projectOption ?? []}
        memberOption={memberOption ?? []}
      />
    </div>
  );
};

export default CreateTaskFormWrapper;
