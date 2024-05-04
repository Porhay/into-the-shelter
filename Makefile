# DATABASE
db:
	docker-compose -f docker-compose.yml down;
	docker-compose -f docker-compose.yml up -d postgresql;
	until nc -z -v -w30 localhost 5432; do echo "Waiting for postgresql...";  sleep 5; done
	@echo "Database started..."


# SERVER SIDE
accounts:
	npm run start:dev shelter-accounts
	@echo "shelter-accounts is running...";

gateway:
	npm run start:dev shelter-gateway
	@echo "shelter-gateway is running...";

# Python API with dependencies installed
ml:
	cd apps/shelter-ml && \
    python3 -m venv .env && \
    source .env/bin/activate && \
    python3 -m pip install -q --upgrade pip && \
    pip3 install -q -r requirements.txt && \
    uvicorn main:app --port 8008 --reload
	@echo "shelter-ml is running..."

# CLIENT SIDE
cs:
    # npm install
	@if [ -d "apps/shelter-client/node_modules" ]; then \
		echo "[client] Node modules is exist"; \
	else \
		echo "Installing node_modules..."; \
		cd apps/shelter-client && npm install; \
    fi

    # npm run start
	npm run start --prefix ./apps/shelter-client
	@echo "[step 2] Client is running...";


# GENERAL
all:
    # start postgres and shelter-gateway
	@echo "[0] Starting postgresql db"
	make db
	@echo "[1] Starting shelter-gateway"
	@osascript -e 'tell app "Terminal" to do script "cd $(CURDIR) && make gateway"'

    # shelter-accounts
	@echo "[2] Starting shelter-accounts"
	@osascript -e 'tell app "Terminal" to do script "cd $(CURDIR) && make accounts"'

    # shelter-ml
	@echo "[3] Starting shelter-ml"
	@osascript -e 'tell app "Terminal" to do script "cd $(CURDIR) && make ml"'

    # shelter-client
	@echo "[4] Starting shelter-client"
	@osascript -e 'tell app "Terminal" to do script "cd $(CURDIR) && make cs"'


kill:
	@echo "Killing all...";
	npx kill-port 8000
	npx kill-port 8001
	npx kill-port 8008
	npx kill-port 3000

test:
	npx ts-node test.ts