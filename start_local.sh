#!/usr/bin/env bash

. ./set_env_vars.sh;
node db/seed.js;
node db/migrate.js;
npm run start;
