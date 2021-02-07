if [[ $1 != "--no-migrate" ]]; then
    yarn knex migrate:latest
fi
yarn clean
tsc
node dist/src/index.js