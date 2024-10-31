"use client"

import ResponsiveModal from '@/components/ResponsiveModal'
import React from 'react'
import CreateTaskFormWrapper from './CreateTaskFormWrapper'
import useCreateTaskstModal from '../hooks/use-create-tasks-modal'

const CreateTasksModal = () => {
    const {isOpen, setIsOpen, close} = useCreateTaskstModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  )
}

export default CreateTasksModal