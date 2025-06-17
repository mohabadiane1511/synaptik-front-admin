import { useEffect, useState, useCallback } from "react";
import { DocumentResponse } from "@/types/documents";
import { documentsService } from "@/lib/documents";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { useDocumentStatus } from "@/hooks/useDocumentStatus";
import { parseISO, format, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { FileIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface DocumentListProps {
    onDocumentDeleted?: () => void;
    onRefresh?: (refreshFn: () => void) => void;
}

export function DocumentList({ onDocumentDeleted, onRefresh }: DocumentListProps) {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Trier les documents du plus récent au plus ancien en utilisant parseISO pour une comparaison correcte
    const sortedDocuments = [...documents].sort((a, b) =>
        parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime()
    );

    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await documentsService.listDocuments();
            setDocuments(response.items);
        } catch (error) {
            console.error("Erreur lors du chargement des documents:", error);
            toast.error("Erreur lors du chargement des documents");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (onRefresh) {
            onRefresh(loadDocuments);
        }
    }, [onRefresh, loadDocuments]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const handleDelete = async (documentId: number) => {
        try {
            await documentsService.deleteDocument(documentId);
            toast.success("Document supprimé avec succès");
            onDocumentDeleted?.();
            await loadDocuments(); // Recharger la liste
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression du document");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucun document importé
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'import</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedDocuments.map((document) => (
                    <DocumentRow
                        key={document.id}
                        document={document}
                        onDelete={handleDelete}
                    />
                ))}
            </TableBody>
        </Table>
    );
}

interface DocumentRowProps {
    document: DocumentResponse;
    onDelete: (id: number) => void;
}

function DocumentRow({ document, onDelete }: DocumentRowProps) {
    const { status } = useDocumentStatus(document.id);
    const currentStatus = status || document.status;

    // Formater la date en local
    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);
        // Ajouter 2 heures car le backend envoie en UTC
        const localDate = addHours(date, 2);
        return format(localDate, "dd/MM/yyyy HH:mm", { locale: fr });
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    {document.filename}
                </div>
            </TableCell>
            <TableCell>
                <DocumentStatusBadge status={currentStatus} />
            </TableCell>
            <TableCell className="text-muted-foreground">
                {formatDate(document.created_at)}
            </TableCell>
            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(document.id)}
                >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
            </TableCell>
        </TableRow>
    );
} 