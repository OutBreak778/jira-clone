import { z } from "zod";

export const createWorkspace = z.object({
    name: z.string().trim().min(3, "Required"),

})

export const updateWorkspace = z.object({
    name: z.string().trim().min(2, "Minumum 2 characters is required").optional()
})