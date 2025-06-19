import { useEffect, useState, useCallback, useMemo } from "react";
import { DocumentResponse, DocumentListResponse, DocumentStatus } from "@/types/documents";
import { documentsService } from "@/lib/documents";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { useDocumentsPolling } from "@/hooks/useDocumentsPolling";
import { parseISO, format, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { FileIcon, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentListProps {
    onDocumentDeleted?: () => void;
    onRefresh?: (refreshFn: () => void) => void;
}

export function DocumentList({ onDocumentDeleted, onRefresh }: DocumentListProps) {
    const [allDocuments, setAllDocuments] = useState<DocumentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | "ALL">("ALL");
    const [selectedContentType, setSelectedContentType] = useState<string | "ALL">("ALL");

    const ITEMS_PER_PAGE = 10;

    // Filtrer les documents en fonction de la recherche et des filtres
    const filteredDocuments = useMemo(() => {
        return allDocuments.filter(doc => {
            const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = selectedStatus === "ALL" || doc.status === selectedStatus;
            const matchesType = selectedContentType === "ALL" || doc.content_type === selectedContentType;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [allDocuments, searchQuery, selectedStatus, selectedContentType]);

    // Trier les documents par date de création décroissante
    const sortedDocuments = useMemo(() => {
        return [...filteredDocuments].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [filteredDocuments]);

    const totalPages = Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE);

    // Calculer les documents à afficher pour la page courante
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

    // Réinitialiser la page courante quand les filtres changent
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedStatus, selectedContentType]);

    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await documentsService.listDocuments();
            console.log("Réponse de l'API:", response);
            setAllDocuments(response.items || []);
            setTotalItems(response.total || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des documents:", error);
            toast.error("Erreur lors du chargement des documents");
            setAllDocuments([]);
            setTotalItems(0);
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

    // Utiliser le hook de polling centralisé
    const documentStatuses = useDocumentsPolling(allDocuments);

    const handleDelete = async (documentId: number) => {
        try {
            await documentsService.deleteDocument(documentId);
            toast.success("Document supprimé avec succès");
            onDocumentDeleted?.();
            await loadDocuments();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast.error("Erreur lors de la suppression du document");
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Rechercher par nom de fichier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value as DocumentStatus | "ALL")}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                        <SelectItem value="ERROR">Erreur</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={selectedContentType}
                    onValueChange={setSelectedContentType}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les types</SelectItem>
                        <SelectItem value="application/pdf">PDF</SelectItem>
                        <SelectItem value="text/plain">TXT</SelectItem>
                        <SelectItem value="application/msword">DOC</SelectItem>
                        <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">DOCX</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {!currentDocuments || currentDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {allDocuments.length === 0 ? (
                        "Aucun document importé"
                    ) : (
                        "Aucun document ne correspond aux critères de recherche"
                    )}
                </div>
            ) : (
                <>
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
                            {currentDocuments.map((document) => (
                                <DocumentRow
                                    key={document.id}
                                    document={document}
                                    currentStatus={documentStatuses[document.id] || document.status}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-2">
                        <div className="text-sm text-muted-foreground">
                            {totalItems > 0 ? (
                                <>
                                    Page {currentPage} sur {totalPages} ({totalItems} document{totalItems > 1 ? 's' : ''})
                                </>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-4">
                            {totalPages > 1 && (
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === currentPage ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Précédent
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

interface DocumentRowProps {
    document: DocumentResponse;
    currentStatus: DocumentStatus;
    onDelete: (id: number) => void;
}

function DocumentRow({ document, currentStatus, onDelete }: DocumentRowProps) {
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