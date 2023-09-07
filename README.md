# Smart Talent Rover APIs

APIs and asynchronous processes to serve the web functions of Smart Talent Rover.

## High-Level Architecture Diagram

![High-Level Architecture Diagram](https://github.com/kedarchandrayan/talent-rover-be/assets/7627517/b1e02bca-a421-4ca2-8abc-dcbfc7beceb6)

To edit the Architecture diagram, open [`docs/architectureDiagram.xml`](docs/architectureDiagram.xml) in [draw.io](https://app.diagrams.net/).

## DB Schema

- You can find the DB schema DBML diagram [here](docs/dbSchema.dbml).
- To view the schema diagram in a user-friendly graphical format, use the [online editor](https://dbdiagram.io/d).

## OpenAPI Specifications

For visualizing the [OpenAPI specs](docs/openApiSpecs.yml), use this [editor](https://editor-next.swagger.io/).

## Postman Collection
To help with API integration, we've shared the [Postman environment](docs/postman/Hackathon%20Local.postman_environment.json) export and [Postman collection](docs/postman/Mission%20CRUD%20APIs.postman_collection.json) files.

## Sequence Diagrams

- Sequence diagrams are represented using mermaid files, and they are stored in the `docs/sequenceDiagrams` folder.
- You can use the [online mermaid editor](https://mermaid.live/) to create and edit sequence diagrams.

Following is a brief description for each sequence diagram:
- [Create Mission API](docs/sequenceDiagrams/api/createMission.mermaid): Creates a mission and enqueues task for Task Splitter Async Process.
- [Task Splitter Async Process](docs/sequenceDiagrams/asyncProcess/taskSplitter.mermaid): Splits the task of processing files of a folder in to multiple tasks, one for each file and enqueues task for Rover Async Process.
- [Rover Async Process](docs/sequenceDiagrams/asyncProcess/rover.mermaid): Reads the content of resume file and using OpenAI chat completion API extracts matches and personal info from Resume.

## Code Structure

To know more about the folder structure and important files in the repository, please refer to [`codeStructure.md`](docs/codeStructure.md).

## DB Migrations

To read about the migration module, please refer to [DB Migrations](db/help.md).

## Environment Variables

For the list of required environment variables, please refer to the `set_env_vars.sh.sample` file.

## Local Environment

Refer [here](docs/localEnvironmentSetup.md) for:
- Pre-requisites for local setup
- Steps for running API server and Async processes
- Connect to PostgreSQL via pgAdmin
- Connect to RabbitMQ web console
