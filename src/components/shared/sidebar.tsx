"use client";

import { cn } from "@/lib/utils";
import {
    BarChart,
    FileText,
    Settings,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    {
        name: "Tableau de bord",
        href: "/dashboard",
        icon: BarChart,
    },
    {
        name: "Utilisateurs",
        href: "/users",
        icon: Users,
    },
    {
        name: "Documents",
        href: "/documents",
        icon: FileText,
    },
    {
        name: "Paramètres",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-background">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="font-semibold">
                    Synaptik Admin
                </Link>
            </div>
            <nav className="space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
} 