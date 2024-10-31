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
import { ArrowLeft, CopyIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { updateProjectSchema } from "../schema";
import { Project } from "../type";
import { useUpdateProjectsMutation } from "../api/use-update-projects";
import { useDeleteProjectsMutation } from "../api/use-delete-projects";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

const EditProjectForm = ({
  onCancel,
  initialValues,
}: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProjectsMutation();
  const { mutate: deleteProject, isPending: isDeleteProject } =
    useDeleteProjectsMutation();
 
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This actions is irreversible",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteProject(
      {
        param: { projectId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href =  `/workspaces/${initialValues.workspaceId}`;
        },
      }
    );

    console.log("deleted the workspace");
  };


  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    mutate(
      { json: values, param: { projectId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${initialValues.workspaceId}/projects/${data.$id}`);
          router.refresh()
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardTitle className="text-xl font-bold px-4 py-3 relative">
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)
            }
            className="mr-4 mb-2 absolute"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <p className="pl-14 mt-1.5">Edit your project here</p>
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
                      <FormLabel>Project name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={initialValues.name}
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
              disabled={isPending }
              onClick={handleDelete}
            >
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectForm;
