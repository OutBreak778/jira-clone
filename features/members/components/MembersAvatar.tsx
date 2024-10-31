import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import React from 'react'

interface MemberAvatarProps {
    name: string
    className?: string
    fallbackString?: string
}

const MemberAvatar = ({name, className, fallbackString}: MemberAvatarProps) => {
     
  return (
    <Avatar className={cn("size-5 transition-all border-2 border-gray-300/50 rounded-full", className)}>
        <AvatarFallback className={cn('text-black p-2 bg-gray-400/60 font-semibold flex items-center justify-center text-md uppercase', fallbackString)}>
            {name.charAt(0).toUpperCase()}
        </AvatarFallback>
    </Avatar>
  )
}

export default MemberAvatar