@echo off

if "%1" == "db" (
	call :db
	exit /b
)

if "%1" == "accounts" (
	call :accounts
	exit /b
)

if "%1" == "gateway" (
	call :gateway
	exit /b
)

if "%1" == "ml" (
	call :ml
	exit /b
)

if "%1" == "cs" (
	call :cs
	exit /b
)

if "%1" == "kill" (
	call :kill
	exit /b
)

echo Invalid target specified.
exit /b

:db
	mkdir persistent\imported-data
	mkdir persistent\image-data

	docker-compose -f docker-compose.yml down
	docker-compose -f docker-compose.yml up -d postgresql

	echo Waiting for PostgreSQL...
	:check_postgres
	timeout /t 5 /nobreak >nul
	netstat -an | find "5432" >nul
	if %errorlevel% neq 0 (
		goto check_postgres
	) else (
		echo Database started...
	)
	exit /b

:accounts
	npm run start:dev shelter-accounts
	echo "shelter-accounts is running..."
	exit /b

:gateway
	npm run start:dev shelter-gateway
	echo "shelter-gateway is running..."
	exit /b

:ml
	cd apps\shelter-ml
	python -m venv .env
	call .env\Scripts\activate
	python -m pip install -q --upgrade pip
	pip install -q -r requirements.txt
	uvicorn main:app --port 8008 --reload
	echo "shelter-ml is running..."
	exit /b

:cs
	if exist "apps\shelter-client\node_modules" (
		echo "[client] Node modules exist"
	) else (
		echo "Installing node_modules..."
		cd apps\shelter-client
		npm install
	)
	npm run start --prefix ./apps/shelter-client
	echo "[step 2] Client is running..."
	exit /b

:kill
	echo Killing all...
	npx kill-port 8000
	npx kill-port 8001
	npx kill-port 8008
	npx kill-port 3000
	exit /b
