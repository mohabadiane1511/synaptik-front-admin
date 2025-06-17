"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Tags } from "lucide-react";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import { useState, useCallback } from "react";
import { DocumentResponse } from "@/types/documents";

export default function DocumentsPage() {
    const [showUpload, setShowUpload] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshDocuments, setRefreshDocuments] = useState<() => void>(() => { });

    const handleUploadSuccess = useCallback((document: DocumentResponse) => {
        setShowUpload(false);
        refreshDocuments(); // Rafraîchir la liste après l'upload
    }, [refreshDocuments]);

    const handleRefresh = useCallback((refreshFn: () => void) => {
        setRefreshDocuments(() => refreshFn);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Documents</h1>
                    <p className="text-muted-foreground">
                        Gérez les documents de votre base de connaissances
                    </p>
                </div>
                <Button onClick={() => setShowUpload(true)}>
                    Importer des documents
                </Button>
            </div>

            {showUpload && (
                <Card className="p-6">
                    <DocumentUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={() => { }}
                    />
                </Card>
            )}

            <Card className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un document..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline">
                        <Tags className="mr-2 h-4 w-4" />
                        Catégories
                    </Button>
                    <Button variant="outline">Filtres</Button>
                </div>

                <DocumentList onRefresh={handleRefresh} />
            </Card>
        </div>
    );
} 