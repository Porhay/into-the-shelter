if exist "apps\shelter-client\node_modules" (
    echo "[client] Node modules exist"
) else (
    echo "Installing node_modules..."
    cd apps\shelter-client
    npm install
)
npm run start --prefix ./apps/shelter-client
echo "[step 2] Client is running..."