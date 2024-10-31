"use client"

import ResponsiveModal from '@/components/ResponsiveModal'
import React from 'react'
import useCreateProjectModal from '../hooks/use-create-project-modal'
import CreatePorjectForm from './CreateProjectForm'

const CreateProjectModal = () => {
    const {isOpen, setIsOpen, close} = useCreateProjectModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreatePorjectForm onCancel={close} />
    </ResponsiveModal>
  )
}

export default CreateProjectModal