"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth";
import { LoginRequest } from "@/types/auth";

const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    tenant_slug: z.string().min(1, "Le slug du tenant est requis"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            tenant_slug: "",
        },
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            console.log("[Login] Tentative de connexion avec:", data.email);
            const token = await authService.login(data as LoginRequest);
            console.log("[Login] Connexion réussie, role:", token.user_role);

            if (token.user_role !== "ADMIN") {
                console.log("[Login] Accès refusé - utilisateur non admin");
                toast.error("Accès réservé aux administrateurs");
                return;
            }

            toast.success("Connexion réussie");
            console.log("[Login] Redirection vers:", redirectPath);

            // Attendre un court instant pour s'assurer que le cookie est bien enregistré
            setTimeout(() => {
                console.log("[Login] Exécution de la redirection");
                window.location.href = redirectPath;
            }, 500);
        } catch (error: any) {
            console.error("Erreur de connexion:", error);

            if (error.response?.status === 401) {
                toast.error("Identifiants invalides");
            } else if (error.response?.status === 404) {
                toast.error("Tenant introuvable");
            } else {
                toast.error("Une erreur est survenue");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Connexion</CardTitle>
                    <CardDescription>
                        Connectez-vous à votre espace administrateur Synaptik
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="tenant_slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug du tenant</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="mon-entreprise"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="admin@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Connexion..." : "Se connecter"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 