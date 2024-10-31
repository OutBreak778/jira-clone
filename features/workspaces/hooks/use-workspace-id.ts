"use client"

import { useParams } from "next/navigation"

export const useWorksapceId = () => {
    const params = useParams()
    return params.workspaceId as string
}
 