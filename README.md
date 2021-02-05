# spotilist-backend
Backend for the Spotilist application. Functions as an abstraction layer around the Spotify API for now.

## Running the project
* Clone the project
* Make a copy of `.env.template`, called `.env`.
  * Fill in `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` to whatever values you want
  * Use the Spotify developer dashboard to create an app, and put your client ID, client secret, and a single callback URI in for the remaining properties
* To start the database, run `docker-compose up` from the project directory
* Run `yarn knex migrate:latest` to populate the database schema
* To start the application using TypeScript directly, run `yarn start`
* To start with transpiled JavaScript, run `yarn start:dist`
* The application will NOT work without a database! Make sure you start up the database first and apply migrations to configure it properly

## Testing
* This project uses `jest-runner-groups` to divide up testing environments between unit tests (pure tests) and integration tests (which need a database to run)
* There are 2 groups configured for testing as of now: `unit` and `integration`
* Available testing commands:
  * `yarn test` to run all tests
  * `yarn test:unit` to only run unit tests
  * `yarn test:integration` to only run integration tests
  * `yarn test:coverage` for test coverage
  
 ## Quality of Life Improvements (for easier development)
 * Make seed files to start up the DB with some data
 * Commands to clean up the `dist` folder after it is generated
 * Running tests in watch mode
 * Auto applying migrations when starting up the project, or asking the user if they want to apply migrations before starting alternatively
