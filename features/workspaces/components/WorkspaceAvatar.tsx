import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import React from 'react'

interface WorkspaceAvatarProps {
    name: string
    className?: string
}

const WorkspaceAvatar = ({name, className}: WorkspaceAvatarProps) => {
     
  return (
    <Avatar className={cn("size-7", className)}>
        <AvatarFallback className='text-black bg-gray-400/60 font-semibold text-md uppercase'>
            {name[0]}
        </AvatarFallback>
    </Avatar>
  )
}

export default WorkspaceAvatar