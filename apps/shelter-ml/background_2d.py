import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_selfie_segmentation = mp.solutions.selfie_segmentation

# Load a background image
background_image = cv2.imread('apps/shelter-ml/resources/background-of-burned-streets-with-burned-buildings.jpg')

# Initialize MediaPipe Selfie Segmentation model
with mp_selfie_segmentation.SelfieSegmentation(
    model_selection=0) as selfie_segmentation:
    
    # Initialize VideoCapture object
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Error: Couldn't capture frame")
            break
        
        # Flip the frame horizontally for a later selfie-view display
        frame = cv2.flip(frame, 1)
        
        # Convert the BGR image to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Use MediaPipe Selfie Segmentation to segment the person from the background
        results = selfie_segmentation.process(frame_rgb)
        
        # Get the segmentation mask
        mask = np.expand_dims(results.segmentation_mask, axis=-1)
        
        # Resize frame and background image to match the mask size
        frame = cv2.resize(frame, (mask.shape[1], mask.shape[0]), interpolation=cv2.INTER_AREA)
        background_image = cv2.resize(background_image, (mask.shape[1], mask.shape[0]), interpolation=cv2.INTER_AREA)

        # Use the mask to extract the person
        person = frame * mask
        
        # Use the inverse mask to extract the background
        background = background_image * (1 - mask)
        
        # Combine the person and background
        result = (person + background).astype(np.uint8)
        
        # Display the result
        cv2.imshow('Virtual Background', result)
        
        # Check for 'q' key press to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Release the VideoCapture object and close all windows
    cap.release()
    cv2.destroyAllWindows()
