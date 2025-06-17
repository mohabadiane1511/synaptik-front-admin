"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import { useState, useCallback } from "react";
import { DocumentResponse } from "@/types/documents";

export default function DocumentsPage() {
    const [showUpload, setShowUpload] = useState(false);
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
                <DocumentList onRefresh={handleRefresh} />
            </Card>
        </div>
    );
} 