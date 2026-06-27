import { LoginForm } from "@/features/auth/components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/config/authOptions";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 font-sans text-white sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}
