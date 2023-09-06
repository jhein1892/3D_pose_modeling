import React, {useState} from "react"
import axios from "axios"
import "../styles/Main.sass"
import VideoSection from "./videoSection"

export default function MainPage()
{

    const [videoTitle, setVideoTitle] = useState({"User":null, "Coach": null})

    function handleVideoCompare(){
        // Need to pass a video to the backend
        const formData = new FormData();
        formData.append('User', videoTitle['User'])
        formData.append('Coach', videoTitle['Coach'])
        
        // setVideoTitle(prev => ({...prev, User: formData}))
        axios.post("http://127.0.0.1:5000/compare_videos", formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((response) => {
            console.log(response)
        })
    }

    return (
        <div className="main_wrapper">
            <div className="input_wrapper">    
                <VideoSection userType={"User"} setVideoTitle={setVideoTitle}/>
                <button onClick={handleVideoCompare}>Compare Vids</button>
                <VideoSection userType={"Coach"} setVideoTitle={setVideoTitle}/>
            </div>
            <div className="comparison_wrapper">
                <h1>Comparison Score Section</h1>
            </div>

        </div>
    )
}