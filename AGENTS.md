<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deploying (Vercel)

Production is hosted on the **owner's** Vercel account (Antreas Kyriakou). The two
collaborators are **not** seats on that Vercel team, which has two consequences:

- **Preview deployments fail** on collaborator pushes/PRs (the red ❌ "not authorized").
  This is cosmetic — it does not affect production or block merging. Ignore it.
- **Production only auto-deploys when the tip commit's author email is the owner's
  Vercel-registered email: `zp.akyriakouu@protonmail.com`.** A commit authored by a
  collaborator's email (or a git `*.local` default) lands on `main` but does **not**
  trigger a production build.

So to commit a change that actually deploys (collaborators have the owner's OK to author
commits under his email for this purpose):

```bash
GIT_COMMITTER_NAME="Antreas Kyriakou" GIT_COMMITTER_EMAIL="zp.akyriakouu@protonmail.com" \
  git commit --author="Antreas Kyriakou <zp.akyriakouu@protonmail.com>" -m "…"
git push origin main
```

The push itself is authenticated as whoever runs it (you can't and needn't push *as* the
owner) — only the commit **author/committer email** matters for the deploy trigger. To
preserve a collaborator's authorship while still deploying, use a `--no-ff` merge whose
merge commit carries the owner's email.
