import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'

class Left extends Component {


    render(){
      
        return (
            <div className="left-layout" display='flex' style={leftStyle} border={1}>
            <div class="dropdown">
                <button className="dropbtn">Applications</button>
                <div className="dropdown-content">
                    {/* Buttons will be dynamically created for how many applications there are */}
                    {this.props.apps.map((app) => (
                    <a key={app.app} onClick={this.props.getResults}>{app.app}</a>
                    ))}
                    <a>AAAAAAAAA</a>
                    <a>B</a>
                    <a>C</a>
                </div>
            </div>
            <img id="logo-img" src="./logo.jpg"/>
            </div>
        )
    }
}

const leftStyle = {
    //backgroundColor: "royalblue",
    backgroundColor: "white",
    //flex: '1',
    //flexDirection: 'column',
    //justifyContent: "center",
    //height:'100%'
}

export default Left
