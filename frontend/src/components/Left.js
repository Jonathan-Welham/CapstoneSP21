// import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
import DehazeIcon from '@material-ui/icons/Dehaze';
// import { height } from '@material-ui/system'

const Left = ({ apps, getResults }) => { 
    return (
        <Box display='flex' style={leftStyle} border={1}>
            {/* Buttons will be dynamically created for how many applications there are */}
            {apps.map((app) => (
                <Button value={app.app} key={app.app} onClick={getResults}>{app.app}</Button>
            ))}
        </Box>

    )
};


const leftStyle = {
    //backgroundColor: "royalblue",
    //flex: '1',
    flexDirection: 'column',
    justifyContent: "center",
}

export default Left
