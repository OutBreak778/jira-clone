import { getCurrent } from '@/features/auth/actions'
import SignInCard from '@/features/auth/components/SignInCard'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const user = await getCurrent()
  if(user) {
    redirect("/dashboard")
  }

  return (
    <SignInCard />
  )
}

export default page