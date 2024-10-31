import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.workspaces[":workspaceId"])["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces[":workspaceId"])["reset-invite-code"]["$post"]>;

export const useResetInviteCodeWorkspaceMutation = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"] ["reset-invite-code"] ["$post"]({ param });
      if (!res.ok) {
        throw new Error("Failed to reset the invite code workspace");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Workspace reset the code successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, Workspace has not reseted the invite code!");
    },
  });

  return mutation;
};
