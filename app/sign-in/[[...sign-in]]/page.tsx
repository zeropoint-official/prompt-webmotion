import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-abyss px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-2xl text-frost">Welcome back</h1>
        <p className="mt-2 max-w-sm text-sm text-frost-dim">
          Sign in with the same email you used to join the Skool community.
        </p>
      </div>
      <SignIn />
    </main>
  );
}
