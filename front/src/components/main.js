import React, {useState} from "react"
import axios from "axios"
import "../styles/Main.sass"
import VideoSection from "./videoSection"
import CompareVids from "./compareVids"
import CompareScores from "./compareScores"

export default function MainPage()
{
    const [videoTitle, setVideoTitle] = useState({"User":null, "Coach": null})
    const [compAccuracy, setCompAccuracy] = useState(null);
    const [lmAccuracy, setLmAccuracy] = useState();
    const [dashArray, setDashArray] = useState('0,100')
    
    function handleVideoCompare(){
        // Need to pass a video to the backend
        const formData = new FormData();
        formData.append('User', videoTitle['User'])
        formData.append('Coach', videoTitle['Coach'])
    
        axios.post("http://127.0.0.1:5000/compare_videos", formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((response) => {
            let totAccuracy = Math.round(response.data.accuracy * 100)
            setDashArray(`${totAccuracy}, 100`)
            setCompAccuracy(totAccuracy)
            setLmAccuracy(response.data.normalized)
        })
    }

    return (
        <div className="main_wrapper">
            <div className="input_wrapper">    
                <VideoSection userType={"User"} setVideoTitle={setVideoTitle}/>
                <div className="comp_section">
                    <CompareVids compAccuracy={compAccuracy} dashArray={dashArray}/>
                    <button onClick={handleVideoCompare}>Compare Vids</button>
                </div>
                <VideoSection userType={"Coach"} setVideoTitle={setVideoTitle}/>
            </div>
            <CompareScores lmAccuracy={lmAccuracy}/>
        </div>
    )
}