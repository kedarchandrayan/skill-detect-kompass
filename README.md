# Smart Talent Rover APIs

## Connect to local RabbitMQ using web console

Once the RabbitMQ container is running, you can access the RabbitMQ web console by opening a web browser and navigating to:
```shell script
http://localhost:15672/
```

Use the following credentials to log in:

- Username: admin
- Password: rootPassword

You should now have access to the RabbitMQ web console and be able to manage your RabbitMQ server running inside the Docker container.

## Connect to Node console

```shell script
docker-compose exec api bash
```

