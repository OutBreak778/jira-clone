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
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { taskSchema } from "../schema";
import { useCreateTaskMutation } from "../api/use-create-task";
import DatePicker from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemberAvatar from "@/features/members/components/MembersAvatar";
import { Tasks, TaskStatus } from "../types";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { useUpdateTaskMutation } from "../api/use-update-task";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string }[];
  memberOption: { id: string; name: string }[];
  initialValue: Tasks
}

const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOption,
  initialValue
}: EditTaskFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateTaskMutation();
  const workspaceId = useWorksapceId();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema.omit({ workspaceId: true, description: true })),
    defaultValues: {
      ...initialValue,
      dueDate: initialValue.dueDate ? new Date(initialValue.dueDate) : undefined,

    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    mutate(
      { json: values, param: {taskId: initialValue.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.()
          // router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardTitle className="text-xl font-bold"></CardTitle>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasks Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your Tasks name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dueDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="assigneeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="bg-gray-100">
                          {memberOption.map((item) => (
                            <SelectItem key={item.id} value={item.name} className="cursor-pointer my-3">
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  className="size-6"
                                  name={item.name}
                                />
                                {item.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="bg-gray-100">
                           <SelectItem className="cursor-pointer" value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                           <SelectItem className="cursor-pointer" value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                           <SelectItem className="cursor-pointer" value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                           <SelectItem className="cursor-pointer" value={TaskStatus.TODO}>Todo</SelectItem>
                           <SelectItem className="cursor-pointer" value={TaskStatus.DONE}>Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="projectId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Assigned</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="bg-gray-100">
                          {projectOptions.map((item) => (
                            <SelectItem key={item.id} value={item.name} className="cursor-pointer my-3">
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar
                                  className="size-6"
                                  name={item.name}
                                />
                                {item.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
  );
};

export default EditTaskForm;
