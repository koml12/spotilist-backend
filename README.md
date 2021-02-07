# spotilist-backend

Backend for the Spotilist application. Functions as an abstraction layer around the Spotify API for now.

## Setting up the project

- Clone the project
- Make a copy of `.env.template`, called `.env`.
  - Fill in `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` to whatever values you want
  - Use the Spotify developer dashboard to create an app, and put your client ID, client secret, and a single callback URI in for the remaining properties
- Run `chmod +x ./scripts/*.sh` from the project root directory. This will set up the scripts needed to start up the project.

## Running the project

- To start the database, run `docker-compose up` from the project directory
- To start the project:
  - Using TypeScript directly, run `yarn start`
  - Using transpiled JavaScript, run `yarn start:dist`
- Starting the project will apply any unapplied migrations (found in `db/migrations`) by default. Pass in `--no-migrate` to run the project as is, with no migrations applied.

## Testing

- This project uses `jest-runner-groups` to divide up testing environments between unit tests (pure tests) and integration tests (which need a database to run)
- There are 2 groups configured for testing as of now: `unit` and `integration`.
- You can pass in any arguments after the test command to change the way Jest runs the tests.
- Available testing commands:
  - `yarn test` to run all tests in `watchAll` mode.
  - `yarn test:unit` to only run unit tests in `watchAll` mode.
  - `yarn test:integration` to only run integration tests in `watchAll` mode.
  - `yarn test:coverage` for test coverage. This command does NOT use watch mode.
