# CLAUDE.md

## Production server

The app is deployed to a DigitalOcean droplet. Reach it over SSH with the alias from the local SSH config:

```
ssh -o BatchMode=yes edwinbroce-claude "sudo -n /usr/bin/docker ps"
```

- Claude uses the `edwinbroce-claude` alias, which logs in as the read-only `claude` user. Do not use `edwinbroce-droplet` (the developer's own account) or root.
- The `claude` user is not in the `docker` or `sudo` groups. `sudo` allows only `/usr/bin/docker ps`, `docker logs`, and `docker images`, and you must call them as `sudo -n /usr/bin/docker ...`. Anything else is denied, including `docker inspect`, which would print the `.env` secrets.
- If a task needs more access (deploy, restart, editing files), give the user the command to run as their own account. Do not ask them to widen the `claude` permissions.
- The aliases are defined in the developer's local SSH config (`~/.ssh/edwinbroce.com/config`). Do not write the IP, user names, or key paths in this repo.
- The developer's own user is in the `docker` group, so run `docker` without `sudo` there.
- The app runs in one container named `weather-application`. The image is `ghcr.io/edwinb24/weather-application:<git-sha>`.
- The container publishes `127.0.0.1:3000:3000` only. Apache sits in front of it and handles HTTPS. Never publish port 3000 without `127.0.0.1:`.
- Environment variables are in `/opt/weather-application/.env` on the server.
- Do not use the GitHub Actions deploy key for interactive access. It is only for CI.

### Rules for working on the server

- Read-only commands are fine to run when asked, such as `sudo -n /usr/bin/docker logs --tail 200 weather-application`.
- Ask the user before any command that changes state, such as pulling or removing images, `docker rm`, `docker run`, restarts, editing files, or package installs.
- For deploys and rollbacks, follow the procedures in [README.md](README.md). Normal deploys run from [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on push.
- To find out which version is live, look at the image tag in `docker ps --format '{{.Image}}'`. The tag is the short git SHA of the deployed commit.
