import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'

class Left extends Component {


    render(){
      
        return (
            <Box display='flex' style={leftStyle} border={1}>
                {/* Buttons will be dynamically created for how many applications there are */}
                {this.props.tests.map((name) => (
                    <Button key={name.name} onClick={this.props.getResults}>{name.name}</Button>
                ))}
            </Box>

        )
    }
}

const leftStyle = {
    backgroundColor: "royalblue",
    flex: '1',
    flexDirection: 'column',
    justifyContent: "center",
}

export default Left
