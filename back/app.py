from flask import Flask, make_response, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import cv2
from flask_cors import CORS
from PoseModule import PoseDetector

app = Flask(__name__)

UPLOAD_FOLDER  = 'uploads'
ANNOTATED_FOLDER = 'annotated'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ANNOTATED_FOLDER'] = ANNOTATED_FOLDER




CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@app.route('/')
def hello():
    print("HERE")
    return make_response({"response" : "Hello World"})

@app.route('/upload', methods=["POST"])
def uploadVideo():
    if 'video' in request.files:
        video_file = request.files['video']
        return {'message': 'Video uploaded successfully'}, 200
    else:
        return{'mesage': 'No Video sent'}, 400

@app.route('/process_video', methods=['POST'])
def process_video():
    if 'video' in request.files:
        video_file = request.files['video']
        if video_file.filename != '':

            filename = secure_filename(video_file.filename)
            # filename = video_file.filename
            video_filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            video_file.save(video_filepath)
            
            annotated_filepath = os.path.join(app.config['ANNOTATED_FOLDER'], filename)
            if os.path.exists(annotated_filepath):
                print("Already exists")

            else:
                print("New Video")
                print("Before processing")
                process_and_annotate_video(video_filepath, annotated_filepath)
                print("Done processing")

            # Check if the annotated_filepath already exists or not

            return send_file(annotated_filepath, as_attachment=True)
        
    return jsonify({'error': 'No video file in request'}), 400


def process_and_annotate_video(input_filepath, output_filepath):
    cap = cv2.VideoCapture(input_filepath)

    if not cap.isOpened():
        print("Error: Could not open video Capture")
    
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc= int(cap.get(cv2.CAP_PROP_FOURCC))
    out = cv2.VideoWriter(output_filepath, fourcc, fps, (width, height))

    timeInt = float(1 / fps)
    
    currentCount = 0
     ## OpenCV pose recognition and annotation code goes here
    detector = PoseDetector()

    lmList = []
    vidData = dict()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # This is the visual Pose estimation
        frame = detector.findPose(img=frame)
        coords = detector.getPosition(img=frame, draw=False)
        coords = createTimeSequence(coords)
        
        # Adding new timestamp to list of timestamps
        currentTime = timeInt * currentCount
        if currentCount == 0:
            vidData['time'] = [currentTime]
            for k, v in coords.items():
                vidData[k] = [v]
        else:
            vidData['time'].append(currentTime)
            for k, v in coords.items():
                vidData[k].append(v)
       
        currentCount = currentCount + 1
        out.write(frame)

    print(vidData)
    
    # Next: Seperate each landmark into it's own list, Normalizing the the keypoint location against the initial location so that we can see the movement of that landmark.

    # Go through the lmList and assign each frame[0][0] to its distinct list, timestamp can also be in it's own list for reference.
        # Make sure to subtract initial location from subsequent locations of same landmark.
    
    
    cap.release()
    out.release()

# @app.route('/annotated/<filename>')
def get_annotated_video(filename):
    print(filename)
    return send_file(filename, mimetype="video/mp4")
    # return send_from_directory(app.config['ANNOTATED_FOLDER'], filename)
    

def createTimeSequence(coords):
    coordDict = dict()
    for lm in coords:
        coordDict[lm[0]] = [lm[1], lm[2]]

    return coordDict


    # I have:  [[0, 871, 847], [1, 876, 828], [2, 881, 828], [3, 886, 827], [4, 858, 830], [5, 850, 831], [6, 842, 832], [7, 889, 833], [8, 830, 839], [9, 880, 865].....



    # I want to get back:
    # {
    #   0:[871, 847], 
    #   1:[876,828]....
    # }

if __name__ == "__main__":
    app.run()