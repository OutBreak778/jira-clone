import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[":taskId"]["$patch"]>;

export const useUpdateTaskMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.tasks[":taskId"]["$patch"]({ json, param });
      console.log(res)
      if (!res.ok) {
        throw new Error("Failed to update tasks");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Tasks updated successfully");
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, tasks not updated!");
    },
  });

  return mutation;
};
