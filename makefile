IMAGE ?= tp-devops-api
VERSION ?= dev

.PHONY: install lint test check up up-prod down logs image

install:
	npm ci

lint:
	npm run lint:check

test:
	npm test && npm run test:e2e

# lo mismo que corre el CI
check: lint test
	npm run build

up:
	docker compose up --build

up-prod:
	docker compose --profile prod up --build api-prod

down:
	docker compose --profile prod down

logs:
	docker compose logs -f

image:
	docker build --target prod --build-arg APP_VERSION=$(VERSION) -t $(IMAGE):$(VERSION) .
