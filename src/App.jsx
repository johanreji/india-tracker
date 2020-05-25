import React from 'react';
import Container from '@material-ui/core/Container';
import StateTable from './components/table';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Paper from '@material-ui/core/Paper';
import MapComponent from './components/map';
import Slide from "@material-ui/core/Slide";
import './App.css';
import 'axios';
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import logo from './intracker_logo.jpeg';

// url to a valid topojson file
const geoUrl =
  "https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json"
const MyAppBar = styled(AppBar)({
  background: 'linear-gradient(45deg, #636363 30%, #a2ab58 90%)',
  border: 0,
  boxShadow: '0 3px 5px 2px rgba(99, 99, 99, .3)',
  color: 'white',
  height: 48,
});
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
class App extends React.Component{

  render(){

    return  <React.Fragment>
<HideOnScroll >
  <MyAppBar >
    <Toolbar>
      <Typography variant="h6">India Tracker</Typography>
      <img style={{marginLeft: 'auto',maxWidth: '130px',marginTop: '-10px'}} src={logo}/>
    </Toolbar>
    
  </MyAppBar>
</HideOnScroll>
<Toolbar />

  <Container>
  {/* <Box my={2}> */}
  {/* <Container fixed> */}
      <Grid container spacing={3}>
      
        <Grid item xs={12} sm={12} lg={6}>
        <StateTable />
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
        <MapComponent/>
        </Grid>    
      </Grid>



  {/* </Container> */}
  {/* </Box> */}
</Container>
</React.Fragment>
  }
}

export default App;
