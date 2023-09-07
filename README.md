# Smart Talent Rover APIs

APIs and asynchronous processes to serve the web functions of Smart Talent Rover.

## DB Schema

- You can find the DB schema DBML diagram [here](docs/dbSchema.dbml).
- To view the schema diagram in a user-friendly graphical format, use the [online editor](https://dbdiagram.io/d).

## OpenAPI Specifications

For visualizing the [OpenAPI specs](docs/openApiSpecs.yml), use this [editor](https://editor-next.swagger.io/).

## Sequence Diagrams

- Sequence diagrams are represented using mermaid files, and they are stored in the `docs/sequenceDiagrams` folder.
- You can use the [online mermaid editor](https://mermaid.live/) to create and edit sequence diagrams.

Following is a brief description for each sequence diagram:
- [Create Mission API](docs/sequenceDiagrams/api/createMission.mermaid): Creates a mission and enqueues task for Task Splitter Async Process.
- [Task Splitter Async Process](docs/sequenceDiagrams/asyncProcess/taskSplitter.mermaid): Splits the task of processing files of a folder in to multiple tasks, one for each file and enqueues task for Rover Async Process.
- [Rover Async Process](docs/sequenceDiagrams/asyncProcess/rover.mermaid): Reads the content of resume file and using 

To see a compiled list of sequence diagrams along with brief descriptions, visit this [Confluence page](https://modolabs.jira.com/wiki/spaces/KTRUESPARROW/pages/3266576441/Sequence+Diagrams).

## Local Environment

Refer [here](docs/localEnvironmentSetup.md) for:
- Pre-requisites for local setup
- Steps for running API server and Async processes
- Connect to PostgreSQL via pgAdmin
- Connect to RabbitMQ web console

