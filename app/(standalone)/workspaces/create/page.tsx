import { getCurrent } from '@/features/auth/actions'
import CreateWorkspaceForm from '@/features/workspaces/components/CreateWorkSpaceForm'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {
    
    const user = await getCurrent()
    if(!user) {
      redirect("/sign-in")
    }
    
    return (
    <div className='w-full lg:max-w-xl border-2 rounded-md mt-5'>
        <CreateWorkspaceForm />
    </div>
  )
}

export default page