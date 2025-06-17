import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { documentsService } from "@/lib/documents";
import { DocumentResponse } from "@/types/documents";
import { toast } from "sonner";

interface DocumentUploadProps {
    onUploadSuccess?: (document: DocumentResponse) => void;
    onUploadError?: (error: Error) => void;
}

export function DocumentUpload({ onUploadSuccess, onUploadError }: DocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        try {
            const file = acceptedFiles[0];
            const document = await documentsService.uploadDocument(file);
            toast.success("Document importé avec succès");
            onUploadSuccess?.(document);
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            toast.error("Erreur lors de l'import du document");
            onUploadError?.(error as Error);
        } finally {
            setIsUploading(false);
        }
    }, [onUploadSuccess, onUploadError]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200 ease-in-out
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
                ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                {isDragActive ? (
                    <p className="text-primary">Déposez le fichier ici...</p>
                ) : (
                    <>
                        <p className="text-muted-foreground">
                            Glissez-déposez un fichier ici, ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PDF, TXT, DOC, DOCX (max 20MB)
                        </p>
                    </>
                )}
                {isDragReject && (
                    <div className="flex items-center gap-2 text-destructive">
                        <X className="h-4 w-4" />
                        <span>Type de fichier non supporté</span>
                    </div>
                )}
            </div>
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span>Import en cours...</span>
                    </div>
                </div>
            )}
        </div>
    );
} 