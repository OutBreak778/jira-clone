import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import React from 'react'

interface ProjectAvatarProps {
    name: string
    className?: string
}

const ProjectAvatar = ({name, className}: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("size-7", className)}>
        <AvatarFallback className='text-black bg-gray-400/60 font-semibold text-md uppercase'>
            {name[0]}
        </AvatarFallback>
    </Avatar>
  )
}

export default ProjectAvatar