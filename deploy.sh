#!/bin/bash

docker image prune -f

docker network create dota 

docker build -f Dockerfile -t api:latest .

docker-compose up -d --remove-orphans