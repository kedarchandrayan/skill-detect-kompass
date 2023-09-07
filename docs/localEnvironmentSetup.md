# Local Development Setup

To set up your local development environment, follow these steps:

## Pre-requisites

Ensure you have the following installed on your system:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://formulae.brew.sh/formula/docker-compose)
- [Node.js v18+](https://nodejs.org/)

## Environment Variables

Next, create a new file named `set_env_vars.sh` in the root directory and paste the following code:

```sh
#!/usr/bin/env bash

export STR_ENVIRONMENT='local'

# Database details.
export STR_DB_SUFFIX='local'
export STR_DB_CONNECTION_POOL_SIZE='10'
export STR_DB_HOST='postgres'
export STR_DB_PORT='5432'
export STR_DB_USER='admin'
export STR_DB_PASSWORD='rootPassword'
export STR_DEFAULT_DB=''

# memcached details
export STR_MEMCACHED_SERVER_ADDRESS="127.0.0.1:11211"
export STR_CACHE_KEY_PREFIX='local'

# RabbitMQ details
export STR_RABBITMQ_HOST='rabbitmq'
export STR_RABBITMQ_PORT=5672
export STR_RABBITMQ_USERNAME='admin'
export STR_RABBITMQ_PASSWORD='rootPassword'

# Google Drive
export STR_GOOGLE_AUTH_CREDS='JSON stringify the JSON credential file and then escape it.'

# OpenAI
export STR_OPENAI_KEY=''

# API Base URL
export STR_API_BASE_URL='localhost:3000'
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

Start a bash shell inside the `api` docker container:
```shell script
docker-compose exec api bash
```

Start the async processor:
```shell script
source set_env_vars.sh
node lib/messageBroker/SubscriberFactory.js
```

## Connect to PostgreSQL using a client
To connect to PostgreSQL, use the credentials provided in the `docker-compose.yml` file, and set the PostgreSQL Host to `127.0.0.1`.

## Connect to local RabbitMQ using web console

Once the RabbitMQ container is running, you can access the RabbitMQ web console by opening a web browser and navigating to:
```shell script
http://localhost:15672/
```

Use the following credentials to log in:

- Username: admin
- Password: rootPassword

You should now have access to the RabbitMQ web console and be able to manage your RabbitMQ server running inside the Docker container.
