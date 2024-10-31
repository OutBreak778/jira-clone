import { Loader2 } from "lucide-react"

const DashboardLoading = () => {
    return(
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="size-10 animate-spin text-muted-foreground" />
        </div>
    )
}

export default DashboardLoading