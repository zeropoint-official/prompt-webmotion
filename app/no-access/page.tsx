import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

export default async function NoAccessPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-abyss px-6 py-16 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-2xl text-frost">
          We couldn&apos;t find your membership
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-frost-dim">
          You&apos;re signed in
          {email ? (
            <>
              {" "}
              as <span className="text-orchid">{email}</span>
            </>
          ) : null}
          , but that email isn&apos;t on our Skool member list.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-frost-dim">
          Make sure you sign in with the <span className="text-frost">same
          email you used to join the Skool community</span>. If you just joined,
          give it a minute and try again.
        </p>
      </div>

      <SignOutButton redirectUrl="/sign-in">
        <button className="rounded-md border border-veil bg-raised px-4 py-2 text-sm text-frost transition-colors hover:border-orchid">
          Sign out &amp; try another email
        </button>
      </SignOutButton>

      <p className="text-xs text-frost-faint">
        Still stuck? Reach out in the Skool community and we&apos;ll sort it out.
      </p>
    </main>
  );
}
