import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface ToolbarProps {
    date: Date,
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
}

const Toolbar = ({date, onNavigate}: ToolbarProps ) => {
  return (
    <div className='flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start'>
        <Button onClick={() => onNavigate("PREV")} variant={"secondary"} size={"icon"} className='flex items-center'>
            <ChevronLeft className='size-5' />
        </Button>
        <div className='flex items-center border border-input rounded-md px-2 py-3 h-10 justify-center w-full lg:w-auto'>
            <CalendarIcon className='size-5' />
            <p className='text-sm'>{format(date, "MMMM yyyy")}</p>
        </div>
        <Button onClick={() => onNavigate("NEXT")} variant={"secondary"} size={"icon"} className='flex items-center'>
            <ChevronRight className='size-5' />
        </Button>
    </div>
  )
}

export default Toolbar