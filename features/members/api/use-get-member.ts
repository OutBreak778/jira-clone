import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetMemeberProps {
    workspaceId: string
}

export const useGetMember = ({workspaceId}: useGetMemeberProps) => {
    const query = useQuery({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            const response = await client.api.members.$get({query: {workspaceId}})

            if(!response.ok) {
                throw new Error("Failed to fecth member features/workspace/api/useGetMember")
            }

            const { data } = await response.json()
            // console.log(data)
            return data
        }
    })

    return query
}