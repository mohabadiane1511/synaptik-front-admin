"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageSquare, Activity } from "lucide-react";

const stats = [
    {
        name: "Utilisateurs totaux",
        value: "1,234",
        icon: Users,
        description: "↗ 12% depuis le mois dernier",
    },
    {
        name: "Documents",
        value: "456",
        icon: FileText,
        description: "↗ 8% depuis le mois dernier",
    },
    {
        name: "Conversations",
        value: "789",
        icon: MessageSquare,
        description: "↗ 24% depuis le mois dernier",
    },
    {
        name: "Taux d'utilisation",
        value: "98.5%",
        icon: Activity,
        description: "↗ 2% depuis le mois dernier",
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de bord</h1>
                <p className="text-muted-foreground">
                    Vue d'ensemble de votre espace Synaptik
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.name}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* TODO: Ajouter des graphiques avec Recharts */}
        </div>
    );
} 