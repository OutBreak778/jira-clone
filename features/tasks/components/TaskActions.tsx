import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTaskMutation } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";

  interface TaskActionsProps {
    id: string
    projectId: string
    children: React.ReactNode
  }

  export const TaskActions = ({id, projectId, children}: TaskActionsProps) => {
    const {mutate, isPending} = useDeleteTaskMutation()
    const router = useRouter()
    const workspaceId = useWorksapceId()

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Task",
        "This actions is irreversible and cannot be undone",
        "destructive"
    )

    const onDelete = async () => {
        const ok = await confirm()
        if(!ok) return

        mutate({param: {taskId: id}})
    }

    const openTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }

    // const openProject = () => {
    //     router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    // }
     
    return(
        <div className="flex jutify-end">
            <ConfirmDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={openTask} className="font-medium p-3 cursor-pointer">
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={openProject} className="font-medium p-3 cursor-pointer">
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Open Projects
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={onDelete} className="font-medium p-3 cursor-pointer text-amber-600 focus:text-amber-700" disabled={isPending}>
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
  }