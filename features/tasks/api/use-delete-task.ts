import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[":taskId"]["$delete"]>;

export const useDeleteTaskMutation = () => {
  
  const queryClient = useQueryClient();
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.tasks[":taskId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete tasks");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Tasks deleted successfully");
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, tasks not created !");
    },
  });

  return mutation;
};
