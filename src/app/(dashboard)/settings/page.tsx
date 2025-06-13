"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Cpu, Database, Palette } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Paramètres</h1>
                <p className="text-muted-foreground">
                    Configurez votre espace Synaptik
                </p>
            </div>

            <Tabs defaultValue="tenant" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tenant" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Tenant
                    </TabsTrigger>
                    <TabsTrigger value="interface" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Interface
                    </TabsTrigger>
                    <TabsTrigger value="quotas" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Quotas
                    </TabsTrigger>
                    <TabsTrigger value="ia" className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        Modèles IA
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tenant">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du tenant</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: Ajouter le formulaire avec :
                - Nom du tenant
                - Description
                - Logo
                - Domaine personnalisé
                - Contact administrateur
              */}
                            <div className="text-muted-foreground">
                                Configuration des informations du tenant à venir...
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="interface">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personnalisation de l'interface</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: Ajouter les options :
                - Couleurs principales
                - Logo dans l'interface
                - Messages personnalisés
                - Langue par défaut
              */}
                            <div className="text-muted-foreground">
                                Options de personnalisation à venir...
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="quotas">
                    <Card>
                        <CardHeader>
                            <CardTitle>Limites et quotas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: Ajouter les paramètres :
                - Nombre max d'utilisateurs
                - Espace de stockage
                - Limite de requêtes API
                - Rétention des données
              */}
                            <div className="text-muted-foreground">
                                Configuration des quotas à venir...
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ia">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuration des modèles IA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: Ajouter les paramètres :
                - Sélection des modèles
                - Paramètres de génération
                - Filtres de contenu
                - Logs et monitoring
              */}
                            <div className="text-muted-foreground">
                                Configuration des modèles IA à venir...
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 