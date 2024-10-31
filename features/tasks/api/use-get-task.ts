import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskStatus } from "../types";

interface useGetTaskProps {
  taskId: string
}

export const useGetTasks = ({
  taskId
}: useGetTaskProps) => {
  const query = useQuery({
    queryKey: [
      "task",
      taskId
    ],
    queryFn: async () => {
      try {
        const response = await client.api.tasks[":taskId"].$get({
          param: {taskId}
        });
  
        if (!response.ok) {
          throw new Error(
            "Failed to fecth task features/task/api/useGetTask"
          );
        }
  
        const { data } = await response.json();
        return data;
      } catch (error) {
        console.log("Error in use-get-tasks.ts:-", error)
      }
    },
  });

  return query;
};
