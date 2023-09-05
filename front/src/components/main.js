import React, {useState} from "react"
import "../styles/Main.sass"
import VideoSection from "./videoSection"

export default function MainPage()
{

    const [videoTitle, setVideoTitle] = useState({"User":"", "Coach": ""})

    function handleVideoCompare(){
        console.log(videoTitle)
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