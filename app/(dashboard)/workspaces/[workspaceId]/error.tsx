'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from 'next/link'

export default function Error() {
  return (
    <div className="h-[65vh] flex items-center justify-center ">
      <Card className="w-[380px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle>Something went wrong!</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {"An unexpected error occurred. Please try again later."}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant={"default"} className="w-full flex items-center justify-center">
            <ArrowLeft className='size-5 mr-3' />
            <Link href={"/"}>
                Back to home page
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}