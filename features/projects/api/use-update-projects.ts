import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[":projectId"]["$patch"]>;

export const useUpdateProjectsMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.projects[":projectId"]["$patch"]({ json, param });
      if (!res.ok) {
        throw new Error("Failed to update projects");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Projects updated successfully");
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, projects not updated !");
    },
  });

  return mutation;
};
