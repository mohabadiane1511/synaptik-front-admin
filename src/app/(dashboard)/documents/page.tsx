"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Search, Tags } from "lucide-react";

export default function DocumentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Documents</h1>
                    <p className="text-muted-foreground">
                        Gérez les documents de votre base de connaissances
                    </p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer des documents
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un document..." className="pl-8" />
                    </div>
                    <Button variant="outline">
                        <Tags className="mr-2 h-4 w-4" />
                        Catégories
                    </Button>
                    <Button variant="outline">Filtres</Button>
                </div>

                {/* TODO: Implémenter la grille de documents avec :
          - Nom du fichier
          - Type
          - Taille
          - Statut d'indexation
          - Date d'upload
          - Tags/Catégories
          - Actions (prévisualiser, éditer tags, supprimer)
        */}
                <div className="rounded-md border">
                    <div className="p-4 text-center text-muted-foreground">
                        Chargement des documents...
                    </div>
                </div>
            </Card>

            {/* TODO: Ajouter :
        - Zone de drop pour l'upload
        - Modal de prévisualisation
        - Modal d'édition des tags
        - Indicateur de progression d'upload
      */}
        </div>
    );
} 