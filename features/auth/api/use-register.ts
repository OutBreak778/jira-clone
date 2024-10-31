import { AppType } from "@/app/api/[[...route]]/route";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegisterMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth.register.$post({ json });
      if(!res.ok) {
        throw new Error("Failed to register")
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Registered successfully")
      router.refresh()
      queryClient.invalidateQueries({queryKey: ["current"]})
      queryClient.invalidateQueries({queryKey: ["workspaces"]})

    },
    onError: () => {
      toast.error("Failed to register the user.")
    }
  });

  return mutation;
};
