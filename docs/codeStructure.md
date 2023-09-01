# Code Structure

The codebase is organized as follows:

## APIs
- `index.js`: Starting point for the API execution.

- `routes/`: Contains router files for all the API routes. The routes are separated into admin and consumer API endpoints.

- `middlewares/`: Contains various middleware functions.

- `formatters/`: Includes the response formatters which convert the internal entities to API response.

## Core Logic
- `app/`: Contains the core application logic.

  - `models/`: Contains model files for database interactions.

    - `postgresql/`: Specific model files for PostgreSQL interactions.

  - `services/`: Contains service files that implement the business logic of the application. Admin and consumer services are segregated into different folders.

- `lib/`: Contains reusable libraries and utilities.

## Documentation
- `docs/`: Includes documentation.

## Migrations
- `db/`: Includes database migrations and DB seed file.

  - `migration/`: Sub-folder with individual database migration files, each representing a specific version of the database schema and includes necessary queries for table and structure creation/modification.

## Test Suite
- `test/`: Folder includes test cases written using Mocha and related data, scenarios, and fixture files.
  
## Miscellaneous
- `config/`: Contains configuration-related code, including methods to access environment variables and retrieve configuration settings.

- `set_env_vars.sh.sample`: Contains a list of required environment variables.

- `docker-compose.yml`, `Dockerfile.local`, and `start_local.sh`: Files used to set up the local development environment.
