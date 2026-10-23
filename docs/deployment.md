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

The actual deployment includes untracked `.deployment/` files with the public hostname, its proxy configuration backup, and a targeted removal script. These operational files are excluded from the public repository. The previous static demo remains available as a rollback artifact until explicitly removed.

## Remove

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
