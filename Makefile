# Makefile

# Target: build-base-image
build-base-image:
	@docker buildx build --platform linux/amd64 --push -t vikings/my-web-pilot:base-image .
