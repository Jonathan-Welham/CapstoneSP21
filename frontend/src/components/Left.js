//import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'
//import AppsRoundedIcon from '@material-ui/icons/AppsRounded';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));

const Left = ({ apps, getResults }) => { 

    const classes = useStyles();
    
    return (
        <Box className="left-box">
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Apps</InputLabel>
                <Select className="app-select" >
                    <option aria-label="None" value="" />
                    {/* Buttons will be dynamically created for how many applications there are */}
                    {apps.map((app) => (
                        <option value={app.app} key={app.app} onClick={getResults}>{app.app}</option>
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
}*/

export default Left
