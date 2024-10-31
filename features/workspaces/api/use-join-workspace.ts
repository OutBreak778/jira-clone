import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.workspaces[":workspaceId"])["join"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces[":workspaceId"])["join"]["$post"]>;

export const useJoinWorkspaceMutation = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.workspaces[":workspaceId"] ["join"] ["$post"]({ param, json });
      if (!res.ok) {
        throw new Error("Failed to join the workspace");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Workspace joined successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, Workspace has not joined!");
    },
  });

  return mutation;
};
