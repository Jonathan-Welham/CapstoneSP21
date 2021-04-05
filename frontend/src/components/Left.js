//import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';

const Left = ({ apps, getResults }) => { 
    
    return (
        <Box className="left-box">
            <div className="dropdown">
                <Button className="dropbtn" color="inherit"><AppsRoundedIcon />Applications</Button>
                <div className="dropdown-content">
                    {/* Buttons will be dynamically created for how many applications there are */}
                    {apps.map((app) => (
                        <Button value={app.app} key={app.app} onClick={getResults}>{app.app}</Button>
                    ))}
                </div>
            </div>
            <div id="logo-div">
                <img id="logo-img" src="./logo.jpg" />
            </div>
        </Box>

    )
};

/*display='flex' style={leftStyle}
const leftStyle = {
    //backgroundColor: "royalblue",
    flex: '1',
    flexDirection: 'column',
    justifyContent: "center",
}*/

export default Left
