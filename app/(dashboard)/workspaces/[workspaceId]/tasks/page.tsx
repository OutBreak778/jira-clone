import Analytics from "@/components/Analytics";
import Heading from "@/components/Heading";
import { getCurrent } from "@/features/auth/actions";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { CircleCheck } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  const user = getCurrent()
  if(!user) redirect("/sign-in")
  return (
    <div className="flex flex-col justify-between w-full ">
      <Heading
        title="Your Tasks"
        description="manage your task from here"
        icon={CircleCheck}
        bgColor="bg-gray-300/40"
        iconColor="text-gray-800"
      />
      <Analytics />
      <TaskViewSwitcher />
    </div>
  );
};

export default page;
