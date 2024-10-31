import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.members[":memberId"])["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.members[":memberId"])["$patch"]>;

export const useUpdateMemberMutation = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.members[":memberId"]["$patch"]({ param, json });
      if (!res.ok) {
        throw new Error("Failed to update member");
      }
      return await res.json();
    },
    onSuccess: ({data}) => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", data.$id] });
    },
    onError: () => {
      toast.error("Something went wrong, member not updated !");
    },
  });

  return mutation;
};
