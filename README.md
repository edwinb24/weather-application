This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Here are the steps to get started:
1. Clone the repo `git clone https://github.com/edwinb24/weather-application.git`
2. Run `yarn`
3. Run `yarn dev`
4. Check port [3000](http://localhost:3000/)

## Server Access
For server access, you need an invitation to our DigitalOcean server. Reach out to edwinbroce@gmail.com to get one. Once you have an invitation to the server, follow the steps found in the documentation below:

[Server Access Documentation](https://broceedwin.atlassian.net/wiki/external/MWRlYTcxNjBjZDA5NDUxN2I2NTAzODJhZTJiZTA3ZDk)

## Production Application
The production application lives at [weather.edwinbroce.com](weather.edwinbroce.com) behind a VPN. For step-by-step instructions on how to access the application, follow the documentation below:

[Usage Instructions](https://broceedwin.atlassian.net/wiki/external/MjgyMjA0ZjM2NTUyNDg2ZGJlMDM5NjQ3ZTQxOTdlNjc) - Instructions on how to access the application

**Note: You'll need a client (an `.ovpn` file) provided by the development team in order to get access to the application**

## About the Development Process

To learn more about the Weather App development process, take a look at the following resources:

- [Programming Logs and AI Usage](https://broceedwin.atlassian.net/wiki/external/ZGM0MDQxNzcwNmM0NDRiZmFhNTc3ZGNhMmQyODU0ODM) - Logs of the development done on the server and the project setup in Ubuntu. Also includes a breakdown of when I used AI and samples of the prompts I ran.
- [UX Design Document](https://broceedwin.atlassian.net/wiki/external/Y2YzOWNlYzFmZTIyNDNmNzg0ZDU3ZGI4NWRiYWJjYjQ) - Design documents.

## Deploying On Digital Ocean

The application runs in a Docker container on the Ubuntu server, behind an Apache reverse proxy on `127.0.0.1:3000`. Each image in GitHub Container Registry (GHCR) has the short commit SHA as its tag, so you can deploy or roll back to any commit.

### Deploy a new commit to production

#### Your computer

Run these steps in **Git Bash**, in the project root (the folder with `Dockerfile` and `package.json`).

1. Start Docker Desktop and wait until it shows **Engine running**.
2. Build the standalone app:
   ```
   yarn build:standalone
   ```
3. Commit the changes, including the `.next/standalone` folder, and push to `main`.

   > **CAUTION:** The image copies the `.next/standalone` folder as it is. If you do not run step 2, the old build goes to production again.

4. Save the short SHA of the new commit:
   ```
   sha=$(git rev-parse --short HEAD)
   echo $sha
   ```
   Record the value, because you use it on the server.

   > **NOTE:** Do this step after the commit in step 3. Otherwise the tag points to the previous commit. Do not put spaces around `=`. In PowerShell, use `$sha = git rev-parse --short HEAD`.

5. Build the image with two tags:
   ```
   docker build --platform linux/amd64 -t ghcr.io/edwinb24/weather-application:$sha -t ghcr.io/edwinb24/weather-application:latest .
   ```
   Do not forget the `.` at the end.
6. Make sure that both tags exist:
   ```
   docker images ghcr.io/edwinb24/weather-application
   ```
7. Push both tags:
   ```
   docker push ghcr.io/edwinb24/weather-application:$sha
   docker push ghcr.io/edwinb24/weather-application:latest
   ```

#### The Linux server

1. Connect to the server with SSH as your own user, not root.
2. Record the SHA that runs now. You need it if you must roll back:
   ```
   docker ps --format '{{.Image}}'
   ```
3. Set the new SHA from step 4 on your computer:
   ```
   sha=<sha>
   ```
4. Pull the new image:
   ```
   docker pull ghcr.io/edwinb24/weather-application:$sha
   ```
5. Remove the old container. The site is down until step 6 finishes, usually for a few seconds:
   ```
   docker rm -f weather-application
   ```
6. Start the new container:
   ```
   docker run -d --name weather-application --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file /opt/weather-application/.env ghcr.io/edwinb24/weather-application:$sha
   ```
7. Delete old images that no container uses:
   ```
   docker image prune -f
   ```
8. Do the steps in [Verify production](#verify-production).

> **WARNING:** Do not run `docker` commands with `sudo`. Always keep `127.0.0.1:` in the `-p` option. Without it, port 3000 is open to the internet and users can bypass Apache and HTTPS.

### Roll back a bad version

Use this procedure if the version in production does not work. You do not build anything, because GHCR keeps every image that was pushed.

#### Your computer

1. Find the SHA of the last version that worked. Use one of these sources:
   - The SHA you recorded in step 2 of the server deployment.
   - The output of `git log --oneline`.
   - The tags at https://github.com/edwinb24?tab=packages → **weather-application**.

#### The Linux server

1. Connect to the server with SSH as your own user, not root.
2. Set the SHA of the version that worked:
   ```
   sha=<last-good-sha>
   ```
3. Pull that image. If it is still on the server, this step is fast:
   ```
   docker pull ghcr.io/edwinb24/weather-application:$sha
   ```
4. Remove the bad container:
   ```
   docker rm -f weather-application
   ```
5. Start the version that worked:
   ```
   docker run -d --name weather-application --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file /opt/weather-application/.env ghcr.io/edwinb24/weather-application:$sha
   ```
6. Do the steps in [Verify production](#verify-production).

> **CAUTION:** A rollback changes only the server. The `main` branch and the `latest` tag still point to the bad commit. Before the next deployment, fix the problem or undo the commit with `git revert <bad-sha>`. Then do [Deploy a new commit to production](#deploy-a-new-commit-to-production) again.

### Verify production

#### The Linux server

1. Make sure that the container status is `Up` and that the tag is the SHA you expect:
   ```
   docker ps
   ```
2. Make sure that the app responds with `200`:
   ```
   curl -I http://127.0.0.1:3000
   ```
3. Make sure that the logs show no errors:
   ```
   docker logs weather-application
   ```

#### Your computer

4. Connect to the VPN.
5. Open [weather.edwinbroce.com](https://weather.edwinbroce.com).
6. Search for a city and a ZIP code, and make sure that weather data shows.

### Common errors

| Where | Error | Fix |
|---|---|---|
| Your computer | `failed to connect to the docker API` | Start Docker Desktop and wait for **Engine running** |
| Your computer | `bash: =: command not found` | You used PowerShell syntax in Git Bash. Use `sha=$(git rev-parse --short HEAD)` |
| Your computer | `tag does not exist` on `docker push` | The build did not make that tag. Run `docker build` again |
| Both | `denied` or `unauthorized` | Run `docker login ghcr.io -u edwinb24` again. Your token may have expired |
| The Linux server | `syntax error near unexpected token 'newline'` | You typed a placeholder such as `<sha>`. Use the real value |
| The Linux server | `.env: permission denied` | Your user does not own `/opt/weather-application/.env`. Do not use `sudo`. Fix the owner with `chown` |
| The Linux server | `container name "/weather-application" is already in use` | Run `docker rm -f weather-application`, then `docker run` again |
