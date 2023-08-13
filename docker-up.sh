#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Please provide the image name and tag in the format 'name:tag'."
    exit 1
fi

IFS=':' read -ra IMAGE <<< "$1"
IMAGE_NAME="${IMAGE[0]}"
IMAGE_TAG="${IMAGE[1]}"

USERNAME="thisisnothappening"

docker build -t "$IMAGE_NAME:$IMAGE_TAG" -f Dockerfile.start .

docker tag "$IMAGE_NAME:$IMAGE_TAG" "$USERNAME/$IMAGE_NAME:$IMAGE_TAG"

docker push "$USERNAME/$IMAGE_NAME:$IMAGE_TAG"
