@echo off

echo "Starting postgresql db..."
start cmd /c "call db.bat"

echo "Starting shelter-gateway..."
start cmd /c "call gateway.bat"

echo "Starting shelter-accounts..."
start cmd /c "call accounts.bat"

echo "Starting shelter-client..."
start cmd /c "call ml.bat"

echo "Starting shelter-client..."
start cmd /c "call cs.bat"
