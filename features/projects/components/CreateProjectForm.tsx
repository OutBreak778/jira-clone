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
import { useCreateProjectsMutation } from "../api/use-create-projects";
import { createProjectSchema } from "../schema";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreatePorjectFormProps {
  onCancel?: () => void;
}

const CreatePorjectForm = ({ onCancel }: CreatePorjectFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useCreateProjectsMutation();
  const workspaceId = useWorksapceId()

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({workspaceId: true})),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId
    }
    mutate({ json: finalValues }, {
      onSuccess: ({data}) => {
        form.reset();
        router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
      }
    });
  };
 

  return (
    <Card className="w-full h-full border-none shadow-none">
        <CardTitle className="text-xl font-bold ml-3 mt-2">Create your Project</CardTitle>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
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
                Create project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePorjectForm;
