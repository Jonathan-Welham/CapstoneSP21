//import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



const Left = ({ apps, getResults }) => { 


    return (
        <Box className="left-box">
                <FormControl>
                <InputLabel id="demo-customized-select-label">Apps</InputLabel>
                <Select labelId="demo-customized-select-label" 
                    id="demo-customized-select"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {/* Buttons will be dynamically created for how many applications there are */}
                    {apps.map((app) => (
                        <MenuItem value={app.app} key={app.app} onClick={app.getResults}>{app.app}</MenuItem>
                    ))}
                </Select>
                </FormControl>
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

    25: onClick={getResults}
}*/

export default Left
