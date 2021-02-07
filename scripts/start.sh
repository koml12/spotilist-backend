if [[ $1 != "--no-migrate" ]]; then
    yarn knex migrate:latest
fi
nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts
