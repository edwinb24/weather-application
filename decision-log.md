# This document contains the details of the different trade-offs for this setup

The main requirement for this project is to work as a dummy test for other work we'll do in the future. As such, we use it to test setups and practice processes.

0. Why decide these instead of letting the agent decide?
   AI lacks the full context of what I'm familiar with and what I know to be true about my client and about myself as a developer. I could give it the context, but it would still not be enough, as it doesn't contain the full knowledge of what I can't express: things that I can't think of ahead of time and verbalize to it. It lacks the full real context of what I know of the real world, my future plans, my knowledge base, and my potential clients' profiles.

1. Why a standalone release with a local build instead of a build on the server on push?
   Building this way allows us to keep the load on the servers low. That way, the servers don't have to go through the effort of actually building the release, and this also allows us to use Docker for our releases.
2. Why Docker?
   While this application is public, has a single developer, and doesn't need any particular safety measures, providing containers allows us to provide consistency between builds and developer interfaces.
3. Why a private package?
   Having a private package is nonsensical for this project since the repo is public, but I wanted to practice setting up a private workflow with Docker, so I made it private for that reason. This way I have a better idea for future implementations.
4. Why DigitalOcean?
   A popular alternative would be using something like Vercel for hosting the Next.js application. I want to practice managing my own servers, play around with the different ways to set up the machine, and learn how to put the proper security measures in place for having an AI work with a remote server.
5. Why a Linux Ubuntu server?
   This one mainly comes down to preference and the ubiquity of Ubuntu. I have worked with Ubuntu servers for more than 10 years in one way or another. For a couple of years, an Ubuntu system was even my main day-to-day driver. In addition, it is the most popular one and the best documented, which helps a lot when trying to troubleshoot issues.
6. Why GitHub Actions?
   With the repositories already on GitHub, using Actions allows us to easily deploy them to our DigitalOcean servers. We don't need to reinvent the wheel; we just want secure, consistent Docker deployments.
7. Why use Next.js?
   I wanted to learn more about implementing Three.js and GSAP (in this case we went with GSAP), so I needed a React setup that would allow me to do that easily.
