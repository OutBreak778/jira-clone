"use client"

import Analytics from '@/components/Analytics'
import MemberListDashboard from '@/features/members/components/MemberListDashboard'
import ProjectListDashboard from '@/features/tasks/components/ProjectListDashboard'
import TaskViewSwitcherDashboard from '@/features/tasks/components/TaskViewSwitcherDashboard'
import React from 'react'

const WorkspaceIdClient = () => {

  return (
    <div className='flex flex-col'>
      <Analytics />
      <div className='flex mt-3 flex-col lg:flex-row gap-y-3 lg:space-x-2'>
      <ProjectListDashboard />
      <TaskViewSwitcherDashboard />
      </div>
      <MemberListDashboard />
    </div>
  )
}

export default WorkspaceIdClient