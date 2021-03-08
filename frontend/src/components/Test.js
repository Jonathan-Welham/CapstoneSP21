// Unused, using for code reference - Jon

import React from 'react'

const Test = ({ test }) => {
    return (
        <div className="test">
            <h3 style={testStyle}>{test.testId} {test.status} {test.typeTest}</h3>
        </div>
    )
}

const testStyle = {
    color: "white",
    backgroundColor: "black",
    margin: "50px",
}

export default Test;