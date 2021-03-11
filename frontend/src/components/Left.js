import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'

class Left extends Component {

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         tests: []
    //     };
    // }


    // getSuiteOne() {
    //     // GET suiteOne specific results
    //     this.props.updateResult;
    // }

    // componentDidMount(){
    //     this.setState(this.props.all);
    // }


    // onclick => API Call depending on suite returns newData => this.setState(newData)

    render(){
      
        return (
            <Box display='flex' style={leftStyle} border={1}>
                {/* Buttons will be dynamically created for how many applications there are */}
                {this.props.tests.map((name) => (
                    <Button key={name.name} onClick={this.props.getResults}>{name.name}</Button>
                    // <Button key={name.name}></Button>
                ))}
            </Box>

        )
    }
}

const leftStyle = {
    backgroundColor: "royalblue",
    // alignItems: "stretch",
    flex: '1',
    flexDirection: 'column',
    justifyContent: "center",
    // justifyContent: "space-around",
}

export default Left
