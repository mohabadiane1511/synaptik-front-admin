"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/auth";
import { LoginForm, LoginRequest, loginSchema } from "@/types/auth";

export default function LoginPage() {
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
            const token = await authService.login(data as LoginRequest);

            if (token.user_role !== "ADMIN") {
                toast.error("Accès réservé aux administrateurs");
                return;
            }

            toast.success("Connexion réussie");
            window.location.href = redirectPath;
        } catch (error: any) {
            console.error("[Login] Erreur:", error);

            if (error.response?.status === 401) {
                toast.error("Identifiants invalides");
            } else if (error.response?.status === 404) {
                toast.error("Tenant introuvable");
            } else {
                toast.error("Une erreur est survenue lors de la connexion");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Connexion</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Accédez à votre espace administrateur
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="tenant_slug" className="block text-sm font-medium">
                                Tenant
                            </label>
                            <input
                                {...form.register("tenant_slug")}
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                placeholder="tenant-slug"
                            />
                            {form.formState.errors.tenant_slug && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.tenant_slug.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                {...form.register("email")}
                                type="email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                placeholder="vous@exemple.com"
                            />
                            {form.formState.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Mot de passe
                            </label>
                            <input
                                {...form.register("password")}
                                type="password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            />
                            {form.formState.errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                        {form.formState.isSubmitting ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
} 