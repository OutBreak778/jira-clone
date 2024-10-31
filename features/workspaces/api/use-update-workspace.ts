import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.workspaces[":workspaceId"])["$patch"],200>;
type RequestType = InferRequestType<(typeof client.api.workspaces[":workspaceId"])["$patch"]>;

export const useUpdateWorkspaceMutation = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.workspaces[":workspaceId"]["$patch"]({ json, param });
      if (!res.ok) {
        throw new Error("Failed to update workspace");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, Workspace not updated !");
    },
  });

  return mutation;
};
