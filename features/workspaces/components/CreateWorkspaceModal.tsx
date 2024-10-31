"use client"

import ResponsiveModal from '@/components/ResponsiveModal'
import React from 'react'
import CreateWorkspaceForm from './CreateWorkSpaceForm'
import useCreateWorkspaceModal from '../hooks/use-create-worksapce-modal'

const CreateWorkspaceModal = () => {
    const {ModalisOpen, ModalsetIsOpen, Modalclose} = useCreateWorkspaceModal()
  return (
    <ResponsiveModal open={ModalisOpen} onOpenChange={ModalsetIsOpen}>
        <CreateWorkspaceForm onCancel={Modalclose} />
    </ResponsiveModal>
  )
}

export default CreateWorkspaceModal