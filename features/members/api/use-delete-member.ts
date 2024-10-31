import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.members[":memberId"])["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.members[":memberId"])["$delete"]>;

export const useDeleteMemberMutation = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.members[":memberId"]["$delete"]({ param });
      if (!res.ok) {
        throw new Error("Failed to delete member");
      }
      console.log(res)
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, member not deleted !");
    },
  });

  return mutation;
};
