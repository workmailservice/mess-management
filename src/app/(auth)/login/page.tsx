import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentSession } from "@/lib/auth/permissions";

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to access the mess management system.</p>
      </div>
      <LoginForm />
    </>
  );
}
