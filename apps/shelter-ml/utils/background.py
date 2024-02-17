import cv2
import numpy as np
import mediapipe as mp


def process(frame):
    frame = np.array(frame)

    # Load a background image
    background_image = cv2.imread('resources/background-of-burned-streets-with-burned-buildings.jpg')

    mp_selfie_segmentation = mp.solutions.selfie_segmentation

    # Initialize MediaPipe Selfie Segmentation model
    with mp_selfie_segmentation.SelfieSegmentation(
        model_selection=0) as selfie_segmentation:

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
        
        return result
    