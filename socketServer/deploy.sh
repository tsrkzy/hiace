#!/usr/bin/env bash

docker build -t asia.gcr.io/hiace-50544/socket .
docker push asia.gcr.io/hiace-50544/socket
gcloud compute instances update-container socket \
    --container-image asia.gcr.io/hiace-50544/socket:latest