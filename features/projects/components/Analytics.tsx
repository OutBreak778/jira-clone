export interface AnalyticsProps {
    data?: {
        taskCount: number
        taskDifference: number
        assigneedTaskCount: number,
        assigneedTaskDifference: number,
        completeCount: number,
        comleteTaskDifference: number,
        incomleteTaskDifference?: number,
        incompleteCount?: number,
        overdueTaskCount: number,
        overdueTaskDifference: number,
        projectCount?: number
        projectDifference?:number
    }
}

 