# Smart Talent Rover APIs

These APIs and asynchronous processes serve the web functions of Smart Talent Rover.

## DB Schema

- You can find the DB schema DBML diagram [here](docs/dbSchema.dbml).
- To view the schema diagram in a user-friendly graphical format, use the [online editor](https://dbdiagram.io/d).

## OpenAPI Specifications

For visualizing the [OpenAPI specs](docs/openApiSpecs.yml), use this [editor](https://editor-next.swagger.io/).

## Run Async Processes

Run following commands:
```shell script
docker-compose exec api bash
source set_env_vars.sh
node lib/messageBroker/SubscriberFactory.js
```

## Connect to local RabbitMQ using web console

Once the RabbitMQ container is running, you can access the RabbitMQ web console by opening a web browser and navigating to:
```shell script
http://localhost:15672/
```

Use the following credentials to log in:

- Username: admin
- Password: rootPassword

You should now have access to the RabbitMQ web console and be able to manage your RabbitMQ server running inside the Docker container.

