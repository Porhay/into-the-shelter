@echo off

echo "Starting postgresql db..."
start cmd /c "call makefolder\db.bat"

echo "Starting shelter-gateway..."
start cmd /c "call makefolder\gateway.bat"

echo "Starting shelter-accounts..."
start cmd /c "call makefolder\accounts.bat"

echo "Starting shelter-client..."
start cmd /c "call makefolder\ml.bat"

echo "Starting shelter-client..."
start cmd /c "call makefolder\cs.bat"
