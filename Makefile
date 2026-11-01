.PHONY: run stop logs restart

run:
	docker compose up -d --build

stop:
	docker compose down

logs:
	docker compose logs -f

restart:
	docker compose up -d --build --force-recreate
