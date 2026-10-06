This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Here are the steps to get started:
1. Clone the repo `git clone https://github.com/edwinb24/weather-application.git`
2. Run `yarn`
3. Run `yarn dev`
4. Check port [3000](http://localhost:3000/)

## Production Application
The production application lives at [weather.edwinbroce.com](weather.edwinbroce.com) behind a VPN. For step-by-step instructions on how to access the application, follow the documentation below:

[Usage Instructions](https://broceedwin.atlassian.net/wiki/external/MjgyMjA0ZjM2NTUyNDg2ZGJlMDM5NjQ3ZTQxOTdlNjc) - Instructions on how to access the application

**Note: You'll need a client (an `.ovpn` file) provided by the development team in order to get access to the application**

## About the Development Process

To learn more about the Weather App development process, take a look at the following resources:

- [Programming Logs and AI Usage](https://broceedwin.atlassian.net/wiki/external/ZGM0MDQxNzcwNmM0NDRiZmFhNTc3ZGNhMmQyODU0ODM) - Logs of the development done on the server and the project setup in Ubuntu. Also includes a breakdown of when I used AI and samples of the prompts I ran.
- [UX Design Document](https://broceedwin.atlassian.net/wiki/external/Y2YzOWNlYzFmZTIyNDNmNzg0ZDU3ZGI4NWRiYWJjYjQ) - Design documents.

## Deploying On Digital Ocean

These are the steps to deploy the application:
1. Run the standalone build command locally:
```
yarn build:standalone
```
2. Commit and push changes into main (this will include the `.next/standalone` directory which contains the built application)
3. Log in to the Ubuntu server
4. Navigate to `/var/www/weather-application`
  ```
  cd ~/../../var/www/weather-application/
  ```
6. Pull the changes
   ```
   git fetch origin
   git status
   git pull
   git status
   ```
   *Note: Important to remember the repository doesn't contain the .env file. If we ever need to remove the weather-application directory, this file will need to be added manually to the weather-application directory.*
7. restart PM2:
  ```
  pm2 restart weather-application
  ```
8. Connect to the VPN and verify the application is running by navigating to [weather.edwinbroce.com](https://weather.edwinbroce.com)
