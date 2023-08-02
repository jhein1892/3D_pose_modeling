import React from "react"
import "../styles/Main.sass"
import VideoSection from "./videoSection"

export default function MainPage()
{

    return (
        <div className="main_wrapper">
            <div className="input_wrapper">    
                <VideoSection type={"Input"}/>
                <VideoSection type={"Output"}/>
            </div>
            <div className="comparison_wrapper">
                <h1>Comparison Score Section</h1>
            </div>

        </div>
    )
}