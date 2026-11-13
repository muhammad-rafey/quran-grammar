# Docker deployment

The Docker image builds the web frontend and Node API together. The production process serves `/` and `/api` on port 8080. It runs as a non-root user with a read-only filesystem. No database, credentials or external source-site access is needed for study.

## Standalone

```sh
docker compose up -d --build --wait
docker compose ps
docker compose logs --tail 30
```

Open http://localhost:8080. `WEB_PORT` changes the localhost binding. For a different browser origin, set `ALLOWED_ORIGINS` to the comma-separated allowed origins before starting the container.

## Existing home server with Caddy / Portainer

Place this repository in `~/quran-grammar`. Set `ALLOWED_ORIGINS` in an untracked root `.env` file to the public HTTPS origin, then run:

```sh
docker compose -f compose.yaml -f compose.homeserver.yaml up -d --build --wait
```

The override attaches the `quran-grammar` container to the existing external `apps` network. Add a dedicated hostname in the shared Caddyfile, forwarding to `quran-grammar:8080`, validate it, and reload Caddy. Preserve all existing routes. A Compose project created by CLI is visible in Portainer; Portainer may label it as externally created.

The actual deployment includes untracked `.deployment/` files with the public hostname, its proxy configuration backup, and a targeted removal script. These operational files are excluded from the public repository. The previous static demo is retained separately as `~/quran-grammar-prototype`, with its Compose project, container and image using that same name. It has no public proxy route. Its removal script is scoped to that prototype. Previously shared lesson-specific hostnames redirect to the Quran Grammar hostname.

## Content and database updates

The web/API image and native bundle share the core study registry. The API serves
that registry; PostgreSQL and SQLite are verified relational copies, not independent
content sources. Updating one database alone does not change the deployed API.

After updating the repository and running `npm ci`, regenerate the SQLite copy
with `npm run db:sqlite`. Use the existing deployment's private `QG_PSQL` command
with `npm run db:sync` to update PostgreSQL transactionally and verify every row.
Back up the dedicated `quran_grammar` schema before updating it; other application
schemas must remain untouched. `npm run db:verify` compares both copies against
the same registry, including the content checksum, roots and verb paradigms.

The current release has 40 Surahs, 1,281 ayahs and 14,405 words. The 29 owner-authorized
drafts carry scholarly-review-pending notices. The expanded API loads more content at
startup, and the Compose service allows 768 MiB for the process and concurrent responses.

## Remove the deployment

On the configured home server, use:

```sh
bash ~/quran-grammar/.deployment/remove.sh
```

That script removes this deployment's proxy route, container and image while preserving the shared proxy and other applications. After it succeeds, `~/quran-grammar` may be deleted.

For a standalone deployment without a proxy route:

```sh
docker compose down --rmi all
```

The home server currently uses an IP-based sslip.io hostname. If its public IP changes, the hostname and Caddy route must be updated. Deployment credentials, addresses and environment files are not committed to the public repository.
