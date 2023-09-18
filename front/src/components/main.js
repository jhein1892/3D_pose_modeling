import React, {useState} from "react"
import axios from "axios"
import "../styles/Main.sass"
import VideoSection from "./videoSection"
import CompareVids from "./compareVids"
import classNames from 'classnames'

export default function MainPage()
{
    const [videoTitle, setVideoTitle] = useState({"User":null, "Coach": null})
    const [compAccuracy, setCompAccuracy] = useState(null);
    const [lmAccuracy, setLmAccuracy] = useState();
    const [dashArray, setDashArray] = useState('0,100')

    const lmNames = {
        0: "Nose",
        2: "Left Eye",
        5: "Right Eye",
        7: "Left Ear",
        8: "Right Ear",
        11: "Left Shoulder", 
        12: "Right Shoulder",
        13: "Left Elbow",
        14: "Right Elbow",
        15: "Left Wrist",
        16: "Right Wrist",
        23: "Left Hip",
        24: "Right Hip",
        25: "Left Knee",
        26: "Right Knee",
        27: "Left Ankle",
        28: "Right Ankle"
    }

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

    function generateScores(scores){
        return scores.map((score) => {
            const divClasses = classNames({
                'poor_acc':lmAccuracy && lmAccuracy[score] <= 0.5,
                'low-mid_acc': lmAccuracy && lmAccuracy[score] <=0.6 && lmAccuracy[score] > 0.5,
                'medium_acc':lmAccuracy && lmAccuracy[score] <= 0.7 && lmAccuracy[score] > 0.6,
                'mid-high_acc': lmAccuracy && lmAccuracy[score] <= 0.8 && lmAccuracy[score] > 0.7,
                'high_acc':lmAccuracy && lmAccuracy[score] > 0.8
            })
            return (
                <div className="parts_col">
                    <h4>{lmNames[score]}:</h4>
                    {lmAccuracy ? <span className={divClasses}>{(lmAccuracy[score] * 100).toFixed(2)}%</span>: <span>NA</span>}
                </div>
            )
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
            <div className="comparison_wrapper">
                <h1>Comparison Score Section</h1>
                <div className="parts_wrapper">
                    <div>
                        <h3>Upper Body</h3>
                        {generateScores([11,12,13,14,15,16])}
                    </div>
                    <div>
                        <h3>Lower Body</h3>
                        {generateScores([23,24,25,26,27,28])}
                    </div>
                </div>
            </div>

        </div>
    )
}