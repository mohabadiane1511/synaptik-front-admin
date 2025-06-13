"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Utilisateurs</h1>
                    <p className="text-muted-foreground">
                        Gérez les utilisateurs de votre espace Synaptik
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel utilisateur
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un utilisateur..." className="pl-8" />
                    </div>
                    <Button variant="outline">Filtres</Button>
                    <Button variant="outline">Exporter</Button>
                </div>

                {/* TODO: Implémenter le DataTable avec les colonnes :
          - Email
          - Nom
          - Rôle
          - Statut
          - Date de création
          - Actions (éditer, désactiver, supprimer)
        */}
                <div className="rounded-md border">
                    <div className="p-4 text-center text-muted-foreground">
                        Chargement de la liste des utilisateurs...
                    </div>
                </div>
            </Card>
        </div>
    );
} 