# DB Migrations

Following are the important commands exposed by the migration module.

## Seed Database

To create the main database and to create `schema_migrations` table, run the following command.

```sh
 > node db/seed.js
```

## Generate Migration

To generate a migration file with bare minimum content, run the following command by giving the name of the migration file, as a parameter. Note that the migration file name is prefixed with the current timestamp by the migration module.

```sh
 > node db/migrate.js --generate <migration-file-name>
```

## Run Pending Migrations

To run all the pending migrations, run the following command.

```sh
 > node db/migrate.js
```

## Run Specific Migration

To run a specific migration version, run the following command. Replace `<migration-version>` with the actual migration version which is the timestamp which appears in the migration file name.

```sh
 > node db/migrate.js --up <migration-version>
```

## Bring Down Specific Migration

To bring down a specific migration version, run the following command. Replace `<migration-version>` with the actual migration version which is the timestamp which appears in the migration file name.

```sh
 > node db/migrate.js --down <migration-version>
```
