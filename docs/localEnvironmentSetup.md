# Local Development Setup

To set up your local development environment, follow these steps:

## Pre-requisites

Ensure you have the following installed on your system:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://formulae.brew.sh/formula/docker-compose)
- [Node.js v18+](https://nodejs.org/)

Next, create a new file named `set_env_vars.sh` in the root directory and paste the following code:

```sh
#!/usr/bin/env bash

# ENVs for local development setup

#Test specific

```

## API Server
After installing the prerequisites, run the following commands from the root directory of the project:

```sh
npm install
docker-compose up
```

During development, `nodemon` will automatically watch for code changes, so you won't need to rerun `docker-compose up` each time.
Note: If you install a new package, you'll need to run `npm install <package_name>` on your local setup.

## Async Processes

## Connect to PostgreSQL using a client
To connect to PostgreSQL, use the credentials provided in the `docker-compose.yml` file, and set the PostgreSQL Host to `127.0.0.1`.
