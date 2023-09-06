import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/Video.sass"

export default function VideoSection({userType, setVideoTitle})
{
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [annotatedVideo, setAnnotatedVideo] = useState(null);
    /**
     * 1) Upload Video
     * 2) Pass Video to backend
     * 3) Get Video back from backend
     * 4) Display the video in video section
     */

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if(userType === "Coach"){
            setVideoTitle(prev => ({...prev, [userType]: file.name}));
        }
        else if (userType === "User"){
            setVideoTitle(prev => ({...prev, [userType]: file}))
        }
        // I should check here if we have a video with that title already, and in that case, we don't need to upload, we just need to retrieve.
        setSelectedVideo(file);
    }

    const uploadVideo = () => {
        const formData = new FormData();
        formData.append('video', selectedVideo);
        // setAnnotatedVideo(selectedVideo)


        axios.post("http://127.0.0.1:5000/process_video", formData, {
            responseType: 'arraybuffer'
        })
        .then((response) => {
            const blob = new Blob([response.data], { type: "video/mp4" });
            console.log(response)
            const videoUrl = URL.createObjectURL(blob);

            setAnnotatedVideo(videoUrl);
        })
        .catch((error) => {
            console.error("Error processing and annotating video: ", error);
        })

    }

    return (
        <div className="video_wrapper">
            <div className="top_section">
                <h1>Video Section: {userType}</h1>
                <input type="file" accept='video/' onChange={handleVideoChange} />
            </div>
            <div className="video_section">
                {annotatedVideo && 
                    <video controls width='400' autoPlay loop>
                        <source src={annotatedVideo} type="video/mp4" />
                    </video>
                }
            </div>
            {selectedVideo &&
                <button onClick={uploadVideo}>Upload Video</button>
            }
        </div>
    )
}