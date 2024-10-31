import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

interface useGetProjectsAnalyticsProps {
  projectId: string;
}

export type AnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

export const useGetProjectsAnalytics = ({
  projectId,
}: useGetProjectsAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["projects-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({ param: { projectId } });

      if (!response.ok) {
        throw new Error(
          "Failed to fecth projects features/project/api/useGetProjectsAnalytics"
        );
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
