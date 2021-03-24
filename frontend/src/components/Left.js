import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
import DehazeIcon from '@material-ui/icons/Dehaze';
// import { height } from '@material-ui/system'

class Left extends Component {


    render(){
      
        return (
            <Box className="left-box" display='flex' style={leftStyle}>
                <div class="dropdown">
                <Button className="dropbtn" color="inherit">Applications</Button>
                <div className="dropdown-content">
                {/* Buttons will be dynamically created for how many applications there are */}
                {this.props.apps.map((app) => (
                    <Button key={app.app} onClick={this.props.getResults}>{app.app}</Button>
                ))}
                </div>
                </div>
            </Box>

        )
    }
}

const leftStyle = {
    //backgroundColor: "royalblue",
    //flex: '1',
    flexDirection: 'column',
    justifyContent: "center",
}

export default Left
