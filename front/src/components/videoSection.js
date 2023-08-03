import React, {useState, useEffect} from 'react';
import "../styles/Video.sass"

export default function VideoSection({type})
{
    const [selectedVideo, setSelectedVideo] = useState(null);
    /**
     * 1) Upload Video
     * 2) Pass Video to backend
     * 3) Get Video back from backend
     * 4) Display the video in video section
     */

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setSelectedVideo(file);
    }

    return (
        <div className="video_wrapper">
            <div className="top_section">
                <h1>Video Section: {type}</h1>
                <input type="file" accept='video/' onChange={handleVideoChange} />
            </div>
            <div className="video_section">
                {selectedVideo && 
                    <video controls width="400">
                        <source src={URL.createObjectURL(selectedVideo)} type="video/mp4" />
                    </video>
                }
            </div>
        </div>
    )
}