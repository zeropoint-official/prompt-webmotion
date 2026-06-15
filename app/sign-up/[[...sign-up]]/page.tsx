import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-abyss px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-2xl text-frost">Create your account</h1>
        <p className="mt-2 max-w-sm text-sm text-frost-dim">
          Use the <span className="text-orchid">same email</span> you joined Skool
          with — that&apos;s how we confirm your membership.
        </p>
      </div>
      <SignUp />
    </main>
  );
}
