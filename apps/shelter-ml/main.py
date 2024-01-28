from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image
from io import BytesIO
# import os; os.chdir('apps/shelter-ml')
import utils.background as background

app = FastAPI()

@app.post("/update-background/")
async def flip_image(file: UploadFile = File(...)):
    try:
        # Read the uploaded image file
        contents = await file.read()
        img = Image.open(BytesIO(contents))
        
        # Process image
        processed_img = background.process(img)
        processed_img = Image.fromarray(processed_img)

        # Save the flipped image to a byte stream
        output = BytesIO()
        processed_img.save(output, format="JPEG")
        output.seek(0)
        
        # Return the flipped image as a response
        return StreamingResponse(output, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
