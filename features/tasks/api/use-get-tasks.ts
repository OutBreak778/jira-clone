import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskStatus } from "../types";

interface useGetTaskProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTask = ({
  workspaceId,
  assigneeId,
  dueDate,
  projectId,
  status,
  search,
}: useGetTaskProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
        },
      });
      
      if (!response.ok) {
        throw new Error(
          "Failed to fecth projects features/project/api/useGetTask"
        );
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
