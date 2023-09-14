import React, {useState} from "react"
import axios from "axios"
import "../styles/Main.sass"
import VideoSection from "./videoSection"
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
        
        // setVideoTitle(prev => ({...prev, User: formData}))
        axios.post("http://127.0.0.1:5000/compare_videos", formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((response) => {
            console.log(response.data)
            // let totAccuracy = (response.data.accuracy * 100).toFixed(2)
            let totAccuracy = Math.round(response.data.accuracy * 100)
            // let totAccuracy = response.data.accuracy
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
                    {/* {lmAccuracy ? <span className={divClasses}>{lmAccuracy[score]}%</span>: <span>NA</span>} */}
                </div>
            )
        })
    }

    const circleClass = classNames({
        "circle": compAccuracy != null,
        "circle_NA": compAccuracy == null
    })

    const circleColors = classNames('circular-chart', {
        "red": compAccuracy && compAccuracy <= 50,
        "orange": compAccuracy && compAccuracy <= 60 && compAccuracy > 50,
        "yellow": compAccuracy && compAccuracy <= 70 && compAccuracy > 60,
        "greenYellow":compAccuracy && compAccuracy <= 80 && compAccuracy > 70,
        "green": compAccuracy && compAccuracy > 80
    })

    return (
        <div className="main_wrapper">
            <div className="input_wrapper">    
                <VideoSection userType={"User"} setVideoTitle={setVideoTitle}/>
                <div className="comp_section">
                <div class="flex-wrapper">
                    <div class="single-chart">
                        <svg viewBox="0 0 36 36" className={circleColors}>
                        <path class="circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className={circleClass}
                            strokeDasharray={dashArray}
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {compAccuracy ?
                            <text x="18" y="20.35" class="percentage">{compAccuracy}%</text>
                            :
                            <text x="18" y="20.35" class="percentage">NA</text>
                        }
                        </svg>
                    </div>
                </div>
                    {/* {compAccuracy&&
                        <h3>%{compAccuracy}</h3>
                    } */}
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