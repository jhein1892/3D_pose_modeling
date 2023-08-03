import React, {useState, useEffect} from 'react';
import "../styles/Video.sass"

export default function VideoSection({type})
{


    return (
        <div className="video_wrapper">
            <div className="top_section">
                <h1>Video Section: {type}</h1>
                <input type="file"/>
            </div>
            <div className="video_section">
                <h3>This is the video display section</h3>
            </div>
        </div>
    )
}