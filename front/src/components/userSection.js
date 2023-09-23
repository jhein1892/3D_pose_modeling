import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import "../styles/Video.sass"

export default function UserSection({setVideoTitle, vidStartingPositions})
{
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [playVideo, setPlayVideo] = useState(null)
    const [videoDimensions, setVideoDimensions] = useState(null)
    const canvasRef = useRef(null)
    

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if(!file){
            return
        } else {
            setVideoTitle(prev => ({...prev, 'User': file}))
            const videoURL = URL.createObjectURL(file)
            setPlayVideo(videoURL)
            setSelectedVideo(file)

            const fileReader = new FileReader();
            fileReader.onload = () => {
                const blob = new Blob([fileReader.result], {type: file.type});
                const video = document.createElement('video');

                video.addEventListener('loadedmetadata', () => {
                    const dimensions = {
                        width: video.videoWidth,
                        height: video.videoHeight
                    }
                    console.log(dimensions)
                    setVideoDimensions(dimensions);
                    URL.revokeObjectURL(video)
                })
                video.src = URL.createObjectURL(blob);
            }

            fileReader.readAsArrayBuffer(file);
        }
    }

    const uploadVideo = () => {
        setPlayVideo(null)
        const formData = new FormData();
        formData.append('video', selectedVideo);

        axios.post("http://127.0.0.1:5000/process_video", formData, {
            responseType: 'arraybuffer'
        })
        .then((response) => {
            const blob = new Blob([response.data], { type: "video/mp4" });
            const videoUrl = URL.createObjectURL(blob);
            setPlayVideo(videoUrl);
        })
        .catch((error) => {
            console.error("Error processing and annotating video: ", error);
        })

    }

    useEffect(() => {
        if(vidStartingPositions != undefined){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d')
            const circleRadius = 5;
            const circleColor = 'blue'

            function drawCircle(x,y){
                ctx.beginPath();
                ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = circleColor
                ctx.fill();
                ctx.closePath();
            }
    
            function drawCircles(){
                for(let key of Object.keys(vidStartingPositions)) {
                    let excludes_vals = [0,1,2,3,4,5,6,7,8,9,10,17,18,19,20,21,22,29,30,31,32]

                    if (!excludes_vals.includes(parseInt(key))){
                        drawCircle(vidStartingPositions[key][0], vidStartingPositions[key][1])

                    }
                }
            }
    
            ctx.clearRect(0,0,canvas.width, canvas.height);
    
            drawCircles();
        }
    },[vidStartingPositions])

    return (
        <div className="video_wrapper">
            <div className="top_section">
                <h1>Video Section: User</h1>
                <input type="file" accept='video/' onClick={() => {setPlayVideo(null)}} onChange={handleVideoChange} />
            </div>
            <div className="video_section">
                {playVideo &&
                    <video controls width='400' autoPlay loop muted>
                        <source src={playVideo} type="video/mp4" />
                    </video>
                }
                <canvas height={videoDimensions.height} width={videoDimensions.width} ref={canvasRef}></canvas>
            </div>
            {selectedVideo &&
                <button onClick={uploadVideo}>Upload Video</button>
            }
        </div>
    )
}