# smarthire

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Getting Started

We develop all microservices in the same repository using monorepo concept. To setup the base of the project we are using [Lerna](https://github.com/lerna/lerna). Lerna is useful to manage monorepos.

## Steps to build code
1. From root directory execute lerna bootstrap.
2. configure .env file for packages/migrations folder and services/video-conf.
3. Configure environment variables for packages/ui/src/environments
4. Run Db migrations: Under packages/migrations execute npm run db:migrate
5. Start backend service: Under services/video-conf execute npm run start
6. Start frontend service: Under packages/ui execute npm run start
