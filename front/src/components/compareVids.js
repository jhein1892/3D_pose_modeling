import React from 'react'
import classNames from 'classnames'
import "../styles/CompVids.sass"

export default function CompareVids({compAccuracy, dashArray})
{
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
        <div className="flex-wrapper">
            <div className="single-chart">
                <svg viewBox="0 0 36 36" className={circleColors}>
                <path className="circle-bg"
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
                    <text x="18" y="20.35" className="percentage">{compAccuracy}%</text>
                    :
                    <text x="18" y="20.35" className="percentage">NA</text>
                }
                </svg>
            </div>
        </div>
    )
}