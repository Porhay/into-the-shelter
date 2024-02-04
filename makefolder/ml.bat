cd apps\shelter-ml
python -m venv .env
call .env\Scripts\activate
python -m pip install -q --upgrade pip
pip install -q -r requirements.txt
uvicorn main:app --port 8008 --reload
echo "shelter-ml is running..."