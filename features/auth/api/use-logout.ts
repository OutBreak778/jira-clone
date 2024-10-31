import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogoutMutation = () => {
  const router = useRouter()
    const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.auth.logout.$post()
      if(!res.ok) {
        throw new Error("Failed to logout")
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Logged out")
      router.refresh()
        queryClient.invalidateQueries({queryKey: ["current"]})
        queryClient.invalidateQueries({queryKey: ["workspaces"]})
    },
    onError: () => {
      toast.error("Failed to log out")
    }
  });

  return mutation;
};
