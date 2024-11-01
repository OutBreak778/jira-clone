import z from "zod"

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, "Requried"),
    workspaceId: z.string()
})
export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, "Requried").optional()
})