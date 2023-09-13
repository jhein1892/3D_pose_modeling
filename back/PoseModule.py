import cv2
import mediapipe as mp
import time


class PoseDetector:
    def __init__(self, mode = False, upBody = False, smooth = True, detectionCon = True, trackCon = 0.5):
        self.mode = mode
        self.upBody = upBody
        self.smooth = smooth
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpDraw = mp.solutions.drawing_utils
        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(self.mode, self.upBody, self.smooth, self.detectionCon, self.trackCon)
        


    # Identifies and creates a visual representation of the pose-landmarks
    def findPose(self, img, draw = True):
        # imgRBG = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(img)

        if self.results.pose_landmarks:
            if draw:
                self.mpDraw.draw_landmarks(img, self.results.pose_landmarks, self.mpPose.POSE_CONNECTIONS)
            
        return img


    # This is used to actually get the coordinates of the landmarks. In future will store these values and hopefully be able to generate a movement based off them to compare to live video footage
    def getPosition(self, img, draw = True): 
        lmList = []
        if self.results.pose_landmarks:
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                h,w,c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx,cy), 5, (255,0,0), cv2.FILLED)
        
        return lmList
    
