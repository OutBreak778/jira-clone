import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType, InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProjectsMutation = () => {
  
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.projects["$post"]({ json });
      if (!res.ok) {
        throw new Error("Failed to create projects");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Projects created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Something went wrong, projects not created !");
    },
  });

  return mutation;
};
