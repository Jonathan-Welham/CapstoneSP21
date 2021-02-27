import React from 'react'
import Test from "./Test"



const Table = ({ tests }) => {
    return (
        <div className="Table">
            {tests.map((test) =>(
                <Test key={test.testId} test={test} />
            ))}
        </div>
    )
}


export default Table
