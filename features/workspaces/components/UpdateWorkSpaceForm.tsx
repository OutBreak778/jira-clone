"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../type";
import { updateWorkspace } from "../schema";
import { ArrowLeft, CopyIcon } from "lucide-react";
import { useUpdateWorkspaceMutation } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspaceMutation } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCodeWorkspaceMutation } from "../api/use-reset-invite-workspace";

interface UpdateWorkspaceFormProps {
  onCancel?: () => void;
  initialValue: Workspace;
}

const UpdateWorkspaceForm = ({
  onCancel,
  initialValue,
}: UpdateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspaceMutation();
  const { mutate: deleteWorkspace, isPending: isDeleteWorkspace } =
    useDeleteWorkspaceMutation();
  const { mutate: resetInviteCode, isPending: isResetInviteCode } =
    useResetInviteCodeWorkspaceMutation();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This actions is irreversible",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Link",
    "This actions is irreversible",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateWorkspace>>({
    resolver: zodResolver(updateWorkspace),
    defaultValues: {
      name: "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValue.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/dashboard";
        },
      }
    );

    console.log("deleted the workspace");
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode(
      {
        param: { workspaceId: initialValue.$id },
      },
      { onSuccess: () => {router.refresh()} }
    );

    console.log("deleted the workspace");
  };

  const onSubmit = (values: z.infer<typeof updateWorkspace>) => {
    mutate(
      { json: values, param: { workspaceId: initialValue.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValue.$id}/join/${initialValue.inviteCode}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite Link is copied"));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardTitle className="text-xl font-bold px-4 py-3 relative">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValue.$id}`)
            }
            className="mr-4 mb-2 absolute"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <p className="pl-14 mt-1.5">Edit your workspace here</p>
        </CardTitle>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={initialValue.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="border border-gray-200 my-3" />
              <div className="flex items-center justify-between space-x-2">
                <Button
                  type="submit"
                  onClick={onCancel}
                  disabled={isPending}
                  variant={"outline"}
                  size={"lg"}
                  className={cn(!onCancel ? "invisible" : "visible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"default"}
                  size={"lg"}
                  className="overflow-hidden"
                  disabled={isPending}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-col">
            <h3 className="font-bold text-primary">Invite the members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add member to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-3">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopy}
                  variant={"secondary"}
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <Button
              className="mt-6 w-fit ml-auto"
              variant={"default"}
              type="button"
              size={"lg"}
              disabled={isPending || isResetInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset Link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-col">
            <h3 className="font-bold text-destructive">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is permanent and will erase all associated
              data on our end.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              variant={"destructive"}
              type="button"
              size={"sm"}
              disabled={isPending || isDeleteWorkspace}
              onClick={handleDelete}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateWorkspaceForm;
