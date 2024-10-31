"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createWorkspace } from "../schema";
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
import { useCreateWorkspaceMutation } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useCreateWorkspaceMutation();

  const form = useForm<z.infer<typeof createWorkspace>>({
    resolver: zodResolver(createWorkspace),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspace>) => {
    mutate({ json: values }, {
      onSuccess: ({data}) => {
        form.reset();
        router.push(`/workspaces/${data.$id}`)
      }
    });
  };
 

  return (
    <Card className="w-full h-full border-none shadow-none">
        <CardTitle className="text-xl ml-3 mt-2 font-bold">
        Create your Workspace here

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
                        placeholder="Enter your workspace name"
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
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateWorkspaceForm;
