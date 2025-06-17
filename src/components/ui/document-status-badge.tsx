import { DocumentStatus } from "@/types/documents";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface DocumentStatusBadgeProps {
    status: DocumentStatus;
    className?: string;
}

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
    PENDING: {
        label: "En attente",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    },
    IN_PROGRESS: {
        label: "En cours",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    COMPLETED: {
        label: "Terminé",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    ERROR: {
        label: "Erreur",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
};

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge
            variant="secondary"
            className={cn("flex items-center gap-1", config.className, className)}
        >
            {(status === "PENDING" || status === "IN_PROGRESS") && (
                <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {config.label}
        </Badge>
    );
} 