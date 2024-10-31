import { Loader2 } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='flex items-center justify-center h-full'>
        <Loader2 className='size-7 animate-spin text-muted-foreground' />
    </div>
  )
}

export default PageLoader