import { cn } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import React from 'react'

interface TaskDateProps {
    value: string
    className?: string
}

const TaskDate = ({value, className}: TaskDateProps) => {
    const today = new Date();
    const endDate = new Date(value)
    const difference = differenceInDays(endDate, today)

    let textColor = "text-muted-foreground"
    if(difference <=3) {
        textColor = "text-orange-600"
    } else if(difference <=7) {
        textColor = "text-yellow-400"
    } else {
        textColor = "text-emerald-500"
    }

  return (
    <div className={textColor}>
        <span className={cn("truncate", className)}>
            {format(value, "PPP")}
        </span>
    </div>
  )
}

export default TaskDate