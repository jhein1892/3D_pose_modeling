import React from 'react';
import "../styles/Video.sass"

export default function VideoSection({type})
{


    return (
        <div className="video_wrapper">
            <h1>Video Section: {type}</h1>
        </div>
    )
}