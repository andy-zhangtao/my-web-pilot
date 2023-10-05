# Makefile

# Target: build-base-image
build-base-image:
	@docker buildx build --platform linux/amd64,linux/arm64 --push -t vikings/my-web-pilot:base-image .

build-run:
	@docker buildx build --platform linux/amd64,linux/arm64 --push -t vikings/my-web-pilot:run -f dockerfile.run .	