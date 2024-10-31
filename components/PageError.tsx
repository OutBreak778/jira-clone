import { AlertTriangleIcon } from "lucide-react"

interface PageErrorProps {
    message: string
}

export const PageError = ({message}: PageErrorProps) => {
    return(
        <div className="flex items-center flec-col justify-center h-full">
            <AlertTriangleIcon className="size-8 text-muted-foreground mb-3" />
            <div className="text-sm font-medium text-muted-foreground">
                {message}
            </div>
        </div>
    )
}