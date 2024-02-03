from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse

from io import BytesIO
from PIL import Image

import utils.background as background

app = FastAPI()



@app.post("/update_background/")
async def update_background(file: UploadFile = File(...)):
    try:
        # Read the uploaded image file
        contents = await file.read()
        img = Image.open(BytesIO(contents))
        
        # Process image
        processed_img = background.process(img)
        processed_img = Image.fromarray(processed_img)

        # Save the backgrounded image to a byte stream
        output = BytesIO()
        processed_img.save(output, format="JPEG")
        output.seek(0)
        
        # Return the backgrounded image as a response
        return StreamingResponse(output, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
