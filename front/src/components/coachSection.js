import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/Video.sass"

export default function CoachSection({setVideoTitle, setVidStartingPositions})
{
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [playVideo, setPlayVideo] = useState(null)
    const [options, setOptions] = useState([])
    const [newVid, setNewVid] = useState(true)
    // const [vidStartingPositions, setVidStartingPositions] = useState()
    // const [annotatedVideo, setAnnotatedVideo] = useState(null);

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if(!file){
            return
        } else {
            setVideoTitle(prev => ({...prev, 'Coach': file.name}));
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
        let vid_title = event.target.value
        setPlayVideo(null)
        if(vid_title != 'none'){            
            setNewVid(false)
            setVideoTitle(prev => ({...prev, "Coach": vid_title}))
            const videoRequest = axios.get(`http://127.0.0.1:5000/getAnnotated?vid_title=${vid_title}`,{responseType: 'arraybuffer'})
            const startRequest = axios.get(`http://127.0.0.1:5000/getStartingData?vid_title=${vid_title}`, {responseType: 'json'})

            Promise.all([videoRequest, startRequest])
            .then((responses) => {
                const blob = new Blob([responses[0].data], {type: "video/mp4"})
                const videoUrl = URL.createObjectURL(blob)
                setPlayVideo(videoUrl)

                const startingResponse = responses[1].data
                setVidStartingPositions(startingResponse)
            })
        } else {
            setNewVid(true)
            console.log('show option to upload new video')
        }
    }

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/getAvailableVideos")
        .then((response) => {
            setOptions(response.data.available_vids)
        })
        .catch((error) => {
            console.error("Error fetching available Videos", error)
        })
    },[])

    return (
        <div className="video_wrapper">
            <div className="top_section">
                <h1>Video Section: Coach</h1>
                <select defaultValue={'none'} onChange={handleChange}>
                    <option value='none' ></option>
                    {generateOptions()}
                </select>
                {newVid === true &&
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