import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/Video.sass"

export default function VideoSection({userType, setVideoTitle})
{
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [playVideo, setPlayVideo] = useState(null)
    const [options, setOptions] = useState([])
    // const [annotatedVideo, setAnnotatedVideo] = useState(null);

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if(!file){
            return
        } else {
            if(userType === "Coach"){
                setVideoTitle(prev => ({...prev, [userType]: file.name}));
            }
            else if (userType === "User"){
                setVideoTitle(prev => ({...prev, [userType]: file}))
            }
            const videoURL = URL.createObjectURL(file)
            setSelectedVideo(file)
            setPlayVideo(videoURL)
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
            console.log(response.data)
            const blob = new Blob([response.data], { type: "video/mp4" });
            console.log(response)
            const videoUrl = URL.createObjectURL(blob);

            setPlayVideo(videoUrl);
        })
        .catch((error) => {
            console.error("Error processing and annotating video: ", error);
        })

    }



    function generateOptions(){
        return options.map((vid) => {
            return (
                <option key={`${vid}-selection-option`} value={vid}>{vid}</option>
            )
        })
    }

    function handleChange(event){
        console.log(event.target.value)
    }

    useEffect(() => {
        if(userType === 'Coach'){
            axios.get("http://127.0.0.1:5000/getAvailableVideos")
            .then((response) => {
                setOptions(response.data.available_vids)
            })
            .catch((error) => {
                console.error("Error fetching available Videos", error)
            })
        }
    },[])

    return (
        <div className="video_wrapper">
            <div className="top_section">
                <h1>Video Section: {userType}</h1>
                {userType === 'Coach' ?
                    <select onChange={handleChange}>
                        <option value='none' selected></option>
                        {generateOptions()}
                    </select>
                    :
                    <input type="file" accept='video/' onClick={() => {setPlayVideo(null)}} onChange={handleVideoChange} />
                }
            </div>
            <div className="video_section">
                {playVideo && 
                    <video controls width='400' autoPlay loop muted>
                        <source src={playVideo} type="video/mp4" />
                    </video>
                }
            </div>
            {selectedVideo &&
                <button onClick={uploadVideo}>Upload Video</button>
            }
        </div>
    )
}