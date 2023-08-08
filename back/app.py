from flask import Flask, make_response, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import cv2
from flask_cors import CORS

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
            
            print("Done processing")
            return send_file(video_filepath, as_attachment=True)
            # print(video_filepath)
            # video_file.save(video_filepath)

            # annotated_filepath = os.path.join(app.config['ANNOTATED_FOLDER'], filename)
            # print("Before processing")
            # # process_and_annotate_video(video_filepath, annotated_filepath)

            # # I dont think that passing a URL is the way to do this. I think I should pass back a blob just like I do to get the Video back here in the first place.


            # # print(annotate_url)
            # return send_file(annotated_filepath, mimetype='video/quicktime')
        
    return jsonify({'error': 'No video file in request'}), 400


def process_and_annotate_video(input_filepath, output_filepath):
    cap = cv2.VideoCapture(input_filepath)
     
     ## OpenCV pose recognition and annotation code goes here

    out = cv2.VideoWriter(output_filepath, cv2.VideoWriter_fourcc(*'mp4v'), cap.get(cv2.CAP_PROP_FPS), (int(cap.get(3)), int(cap.get(4))))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        ## Perform pose recignition and annotation on the frame

        out.write(frame)
    
    cap.release()
    out.release()

# @app.route('/annotated/<filename>')
def get_annotated_video(filename):
    print(filename)
    return send_file(filename, mimetype="video/mp4")
    # return send_from_directory(app.config['ANNOTATED_FOLDER'], filename)
    



if __name__ == "__main__":
    app.run()