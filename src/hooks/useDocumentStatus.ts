import { useState, useEffect } from "react";
import { DocumentStatus, DocumentStatusResponse } from "@/types/documents";
import { documentsService } from "@/lib/documents";

const POLLING_INTERVAL = 5000; // 5 secondes

export function useDocumentStatus(documentId: number) {
    const [status, setStatus] = useState<DocumentStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const response = await documentsService.getDocumentStatus(documentId);
                setStatus(response.status);
                setError(response.message);

                // Continuer le polling si le document est toujours en cours de traitement
                if (response.status === "PENDING" || response.status === "IN_PROGRESS") {
                    timeoutId = setTimeout(checkStatus, POLLING_INTERVAL);
                } else {
                    setIsPolling(false);
                }
            } catch (error) {
                setError("Erreur lors de la vérification du statut");
                setIsPolling(false);
            }
        };

        // Démarrer le polling
        checkStatus();

        // Cleanup
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [documentId]);

    return {
        status,
        error,
        isPolling
    };
} 