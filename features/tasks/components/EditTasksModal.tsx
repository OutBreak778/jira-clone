"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import React from "react";
import useEditTaskModal from "../hooks/use-edit-tasks-modal";
import EditTaskFormWrapper from "./EditTaskFormWrapper";
const EditTasksModal = () => {
  const { taskId, close } = useEditTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};

export default EditTasksModal;
