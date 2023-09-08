from flask import Flask, make_response, request, jsonify, send_file
from werkzeug.utils import secure_filename
import json
import os
import cv2
from flask_cors import CORS
from PoseModule import PoseDetector
from fastdtw import fastdtw


app = Flask(__name__)

UPLOAD_FOLDER  = 'uploads'
ANNOTATED_FOLDER = 'annotated'
DATA_FOLDER = 'data'
TEMP_FOLDER = 'temp'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ANNOTATED_FOLDER'] = ANNOTATED_FOLDER
app.config['DATA_FOLDER'] = DATA_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER


CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@app.route('/')
def hello():
    print("HERE")
    return make_response({"response" : "Hello World"})

@app.route('/compare_videos', methods=["POST"])
def compareVideos():
    coach = request.form.get('Coach')
    user = request.files.get('User')
    # Get the names of the two videos we want to compare.
    # data = request.get_json()

    # # Check that we have two videos being sent over.
    if coach == None or user == None:
        return jsonify({'error': 'Need two videos'}), 400

    # # Get the Coach's video data
    coach_data_filepath = os.path.join(app.config['DATA_FOLDER'], coach)
    with open(coach_data_filepath, 'r') as openfile:
        coach_data = json.load(openfile)
    # print(coach_data)

    # Run processing on User's video to gather coordinates
    user_coords = get_coords(user)
    # print(user_coords)
    # Run comparison on two sets of coordinates
    comp_vals = coord_comp(user_coords, coach_data)
    return jsonify(comp_vals), 200

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
        print(video_file)
        if video_file.filename != '':
            filename = secure_filename(video_file.filename)
            # filename = video_file.filename
            video_filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            video_file.save(video_filepath)
            
            annotated_filepath = os.path.join(app.config['ANNOTATED_FOLDER'], filename)
            data_filepath = os.path.join(app.config['DATA_FOLDER'], filename)
            if os.path.exists(annotated_filepath):
                print("Already exists")

            else:
                print("New Video")
                print("Before processing")
                process_and_annotate_video(video_filepath, annotated_filepath, data_filepath)
                print("Done processing")

            # Check if the annotated_filepath already exists or not

            return send_file(annotated_filepath, as_attachment=True)
        
    return jsonify({'error': 'No video file in request'}), 400

# This is doing the same as process_and_annotate_video except it doesn't annotate, just gets coords and returns dict of coords
def get_coords(input):
    video_path = os.path.join(app.config['TEMP_FOLDER'], input.filename)
    input.save(video_path)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error: Could not open Video Capture")
    else:
        print("Everything seems fine")
    
    # fps = int(cap.get(cv2.CAP_PROP_FPS))
    # timeInt = float(1 / fps)

    currentCount = 0
     ## OpenCV pose recognition and annotation code goes here
    detector = PoseDetector()

    # Raw LM Coord Data from vid
    vidData = dict()
    startCoord = dict()
    relMovement = dict()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # This is the visual Pose estimation
        frame = detector.findPose(img=frame)
        coords = detector.getPosition(img=frame, draw=False)
        coords = createTimeSequence(coords)

        if currentCount == 0:
            for k, v in coords.items():
                vidData[k] = [v]
                startCoord[k] = v
                relMovement[k] = [[0,0]]
            
        else:
            for k, v in coords.items():
                vidData[k].append(v)
                relMovement[k].append([int(v[0]) - int(startCoord[k][0]), int(v[1]) - int(startCoord[k][1])])        
        currentCount = currentCount + 1

    cap.release()
    os.remove(video_path)
    return relMovement

def process_and_annotate_video(input_filepath, output_filepath, data_filepath):
    cap = cv2.VideoCapture(input_filepath)

    if not cap.isOpened():
        print("Error: Could not open video Capture")
    
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc= int(cap.get(cv2.CAP_PROP_FOURCC))
    out = cv2.VideoWriter(output_filepath, fourcc, fps, (width, height))

    # timeInt = float(1 / fps)
    
    currentCount = 0
     ## OpenCV pose recognition and annotation code goes here
    detector = PoseDetector()

    # Raw LM Coord Data from vid
    vidData = dict()
    # Relative movement of each LM from start Coord
    relMovement = dict()
    # Values of each LM at the start Coord
    startCoord = dict()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # This is the visual Pose estimation
        frame = detector.findPose(img=frame)
        coords = detector.getPosition(img=frame, draw=False)
        coords = createTimeSequence(coords)
        
        # Adding new timestamp to list of timestamps
        # currentTime = timeInt * currentCount
        if currentCount == 0:
            # vidData['time'] = [currentTime]
            for k, v in coords.items():

                vidData[k] = [v]
                startCoord[k] = v
                relMovement[k] = [[0,0]]
            
        else:
            # vidData['time'].append(currentTime)
            for k, v in coords.items():
                vidData[k].append(v)
                # Calculate relative movement from starting point
                relMovement[k].append([int(v[0]) - int(startCoord[k][0]), int(v[1]) - int(startCoord[k][1])])
       
        currentCount = currentCount + 1
        out.write(frame)
    
    json_object = json.dumps(relMovement, indent=4)
    with open(data_filepath, "w") as outfile:
        outfile.write(json_object)


    # print(f"Data: {vidData[0]}")
    # print(f"relMovement: {relMovement[0]}")

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

def coord_comp(user, coach):
    user_keys = user.keys()
    # coach_keys = coach.keys()
    dtw_list = list()
    dtw_distances = dict()
    for key in user_keys:
        distance, alignment_path = fastdtw(user[key], coach[str(key)])
        if key not in [1,3,4,6,9,10,17,18,19,20,21,22,29,30,31,32]:
            dtw_list.append(distance)
            dtw_distances[key] = distance

    max_observed_distance = max(dtw_list)

    for lm in dtw_distances:
        dtw_distances[lm] = 1 / (1 +(int(dtw_distances[lm]) / max_observed_distance))

    accuracy_rate = sum(dtw_distances.values()) / len(dtw_distances.values())
    returnVals = dict()
    returnVals['normalized'] = dtw_distances
    returnVals['accuracy'] = accuracy_rate
    
    return returnVals

if __name__ == "__main__":
    app.run()



    # When I circle back around to increasing the accuracy of my data for the coord comp I should look at the certainty of the landmarks from pose estimation. That might help me get rid of some weirddata or help eliminate some lm that get hidden throughout the movement