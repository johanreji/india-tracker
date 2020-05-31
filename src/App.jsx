import React from 'react';
import Container from '@material-ui/core/Container';
import StateTable from './components/table';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import logo from './india-tracker-shadow.png';
import Axios from 'axios';
import Back from '@material-ui/icons/ArrowBack';

// url to a valid topojson file
const geoUrl =
  "https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json"
const MyAppBar = styled(AppBar)({
  background: 'linear-gradient(45deg, #636363 30%, #a2ab58 90%)',
  border: 0,
  boxShadow: '0 3px 5px 2px rgba(99, 99, 99, .3)',
  color: 'white',
  height: 55,
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
  constructor(props) {
    super(props);
    this.state = {
      stateData : [],
      districtData: [],
      selectedState: ""
    }
}

selectState = (state) => {
  this.setState({
    selectedState:state
  })
}

  componentDidMount(){
    Axios.get('https://script.google.com/macros/s/AKfycbxSoELl1el6cJHtsdNcldXYgh4Tn69ofoVyNSfKGj9n2ar5YV4/exec').then(response=>{
    this.setState({
      stateData:response.data
    });
  })
  Axios.get('https://script.google.com/macros/s/AKfycbyhiGiT67oOnupBAXW1ZFBkd6ZWVAbXiajVBkA7I2EEEMHrelGc/exec').then(response=>{
    this.setState({
      districtData:response.data
    });
  })
  }

  render(){

    return  <React.Fragment>
<HideOnScroll >
  <MyAppBar >
    <Toolbar>
      <Typography variant="h4">TRIFED</Typography>
      <img style={{marginLeft: 'auto',maxWidth: '130px',marginTop: '-10px'}} src={logo}/>
    </Toolbar>
    
  </MyAppBar>
</HideOnScroll>
<Toolbar />

  <Container>
  {/* <Box my={2}> */}
  {/* <Container fixed> */}
    { this.state.stateData.length > 0 && this.state.districtData.length >0 ? <Grid container spacing={3}>
    <Grid item xs={12} sm={12} lg={12}> 
      {this.state.selectedState != "" && <div  style={{display:"flex",alignItems:"center", cursor:"pointer"}} onClick={() => this.selectState("")}><Back/><h4>Go back to state table</h4></div>}
      </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <StateTable  stateData={this.state.stateData} districtData={this.state.districtData} selectedState = {this.state.selectedState} selectState={this.selectState}/>
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <MapComponent stateData={this.state.stateData} districtData={this.state.districtData} selectedState = {this.state.selectedState} selectState={this.selectState}/>
        </Grid>    
      </Grid>:
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
  >
      <Grid item xs={12} sm={12} lg={12}>
        <CircularProgress size={50} /></Grid>
      </Grid>}



  {/* </Container> */}
  {/* </Box> */}
</Container>
</React.Fragment>
  }
}

export default App;
