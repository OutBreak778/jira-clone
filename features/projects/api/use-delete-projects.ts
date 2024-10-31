import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[":projectId"]["$delete"]>;

export const useDeleteProjectsMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.projects[":projectId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete projects");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Projects deleted successfully");
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, projects not deleted !");
    },
  });

  return mutation;
};
