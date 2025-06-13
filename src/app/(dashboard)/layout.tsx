"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
} 