import { useState, useEffect } from "react";
import { DocumentResponse, DocumentStatus } from "@/types/documents";
import { documentsService } from "@/lib/documents";

const POLLING_INTERVAL = 5000; // 5 secondes

export function useDocumentsPolling(documents: DocumentResponse[]) {
    const [documentStatuses, setDocumentStatuses] = useState<Record<number, DocumentStatus>>({});

    useEffect(() => {
        // Filtrer uniquement les documents qui nécessitent un polling
        const documentsToPool = documents.filter(
            doc => doc.status === "PENDING" || doc.status === "IN_PROGRESS"
        );

        if (documentsToPool.length === 0) {
            return;
        }

        const checkStatuses = async () => {
            try {
                // Vérifier le statut de chaque document en cours de traitement
                const statusPromises = documentsToPool.map(doc =>
                    documentsService.getDocumentStatus(doc.id)
                );
                const statuses = await Promise.all(statusPromises);

                // Mettre à jour les statuts
                const newStatuses = { ...documentStatuses };
                statuses.forEach(status => {
                    newStatuses[status.id] = status.status;
                });
                setDocumentStatuses(newStatuses);

                // Continuer le polling si au moins un document est toujours en traitement
                const hasDocumentsInProgress = statuses.some(
                    status => status.status === "PENDING" || status.status === "IN_PROGRESS"
                );

                if (hasDocumentsInProgress) {
                    setTimeout(checkStatuses, POLLING_INTERVAL);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification des statuts:", error);
            }
        };

        // Démarrer le polling
        checkStatuses();

        // Cleanup
        return () => {
            // Le timeout sera nettoyé automatiquement grâce à la closure
        };
    }, [documents]); // Se relancer si la liste des documents change

    return documentStatuses;
} 