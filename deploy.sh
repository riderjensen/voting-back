#!/bin/bash

docker image prune -f

docker network inspect dota >/dev/null 2>&1 || docker network create --driver dota

docker build -f Dockerfile -t api:latest .

docker-compose up -d --remove-orphans