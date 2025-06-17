export type DocumentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ERROR";

export interface DocumentResponse {
    id: number;
    filename: string;
    content_type: string | null;
    tenant_id: number;
    file_path: string;
    status: DocumentStatus;
    created_at: string;
    updated_at: string;
}

export interface DocumentStatusResponse {
    id: number;
    status: DocumentStatus;
    message: string | null;
}

export interface DocumentListResponse {
    items: DocumentResponse[];
    total: number;
    skip: number;
    limit: number;
} 