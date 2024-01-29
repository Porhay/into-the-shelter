import cv2
import mediapipe as mp
import numpy as np

def overlay_mask(image, mask, landmarks):
    image_height, image_width, _ = image.shape
    mask_height, mask_width, _ = mask.shape

    # Define mask offsets
    horiz_offset = 0.1, 0.9 # left, right 
    vert_offset = 0.2, 0.95 # top, bottom

    # Define source and destination points for perspective transformation
    src_pts = np.array([
        [horiz_offset[0] * mask_width, vert_offset[0] * mask_height],
        [horiz_offset[1] * mask_width, vert_offset[0] * mask_height],
        [horiz_offset[1] * mask_width, vert_offset[1] * mask_height],
        [horiz_offset[0] * mask_width, vert_offset[1] * mask_height]
    ], dtype=np.float32) # Clockwise from top left

    # Use landmarks from about the corners of the face for destination
    topLeft = [landmarks[54].x * image_width, landmarks[54].y * image_height]
    topRight = [landmarks[284].x * image_width, landmarks[284].y * image_height]
    bottomRight = [landmarks[365].x * image_width, landmarks[152].y * image_height]
    bottomLeft = [landmarks[136].x * image_width, landmarks[152].y * image_height]
    dst_pts = np.array([topLeft, topRight, bottomRight, bottomLeft], dtype=np.float32)
    
    # Calculate perspective transformation matrix
    M = cv2.getPerspectiveTransform(src_pts, dst_pts)

    # Apply perspective transformation to mask
    mask_warped = cv2.warpPerspective(mask, M, (image_width, image_height))

    # Split out the transparency mask from the color info
    overlay_img = mask_warped[:, :, :3]  # BRG
    overlay_mask = mask_warped[:, :, 3]  # alpha

    # Overlay the mask onto the face region
    overlay = image.copy()
    overlay[overlay_mask > 0] = overlay_img[overlay_mask > 0]
    
    return overlay

def show_camera_feed():
    # Initialize MediaPipe face detection and landmark models
    mp_face_mesh = mp.solutions.face_mesh
    mp_drawing = mp.solutions.drawing_utils
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5, min_tracking_confidence=0.5)

    # Load the mask image
    mask_image = cv2.imread('apps/shelter-ml/resources/filter1.png', cv2.IMREAD_UNCHANGED)

    # Open the default camera (usually the first camera found)
    cap = cv2.VideoCapture(0)

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        
        # Convert the image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect face landmarks in the frame
        results = face_mesh.process(rgb_frame)
        
        # Overlay mask on the face
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                overlay = overlay_mask(frame, mask_image, face_landmarks.landmark)
                frame = overlay

        # Display the resulting frame
        cv2.imshow('Camera Feed', frame)

        # Exit the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    show_camera_feed()
