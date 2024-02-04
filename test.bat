if "%1" == "accounts" (
	call :accounts
	exit /b
)

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