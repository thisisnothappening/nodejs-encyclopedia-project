#!/bin/bash

if [ "$#" -lt 1 ]; then
    echo "Please provide the image name and tag in the format 'name:tag'. 
Also, if your Dockerfile has an extension, such as Dockerfile.start, 
then the format has to be 'name:tag .extension', 
if not, then don't write anything after tag."
    exit 1
fi

IFS=':' read -ra IMAGE <<< "$1"
IMAGE_NAME="${IMAGE[0]}"
IMAGE_TAG="${IMAGE[1]}"
DOCKERFILE_EXT=""

if [ "$#" -gt 1 ]; then
    DOCKERFILE_EXT="${@:2}"
fi

USERNAME="thisisnothappening"
DOCKERFILE="Dockerfile${DOCKERFILE_EXT}"

docker buildx build -t "$IMAGE_NAME:$IMAGE_TAG" -f "$DOCKERFILE" .

docker tag "$IMAGE_NAME:$IMAGE_TAG" "$USERNAME/$IMAGE_NAME:$IMAGE_TAG"

docker push "$USERNAME/$IMAGE_NAME:$IMAGE_TAG"
