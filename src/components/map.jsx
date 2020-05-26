import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import Axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import ReactTooltip from 'react-tooltip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LinearGradient from './LinearGradient.js';
import Skeleton from '@material-ui/lab/Skeleton';


const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = {
  scale: 1700,
  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618'
];
// let COLOR_RANGE = [
//     '#EDFD99',
//     '#dbea91',
//     '#cbd886',
//     '#b9c57a',
//     '#95a15a',
//     '#747e40',
//     '#58631e',
//     '#38400d',
//     '#1b2002'
//   ];

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }
function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }
const DEFAULT_COLOR = '#EEE';

// const 10 = () => {
//   return parseInt(Math.random() * 100);
// };

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

// let gradientData;
// let colorScale;
const StyledTabs = withStyles({
    root: {
        flexGrow:1
    },
    indicator: {

      backgroundColor: '#636363',

    },
  })((props) => <Tabs  {...props}  />);

  const StyledTab = withStyles((theme) => ({
    root: {

      color: '#fff',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),

      backgroundColor:'#a2ab58 ',
      '&$selected': {
        color:'white',
        opacity: 1,
        backgroundColor:'#636363 '
      },
      '&:focus': {
        color:'white',
        opacity: 1,
        backgroundColor:'#636363 '
      },
      '&:hover': {
        color:'white',
        opacity: 1,
      },
    },
    selected: {},
    
  }))((props) => <Tab disableRipple {...props} />);


class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipContent:'',
            data: [],
            gradientData:{},
            colorScale:{},
            selectedIndex:0
        }
    }
componentDidMount(){
    Axios.get('https://script.google.com/macros/s/AKfycbxSoELl1el6cJHtsdNcldXYgh4Tn69ofoVyNSfKGj9n2ar5YV4/exec').then(response=>{
        let resp = response.data.filter(v => v.statecode != 'TT');
        let categories = Object.keys(resp[0]).filter(v => !['state','statecode','lastupdatedtime'].includes(v));


        let colorArray = [];
        COLOR_RANGE.map(v => colorArray.push(v.substring(0, 1) + '0' + v.substring(1 + 1)))

        this.setState({
          data: resp,
          categories : categories,
          gradientData : {
            fromColor: colorArray[0],
            toColor: colorArray[colorArray.length -1],
            min: 0,
            max: resp.reduce((max, item) => (item[categories[this.state.selectedIndex]] > max ? item[categories[this.state.selectedIndex]] : max), 0)
          },
          colorScale : scaleQuantile()
          .domain(resp.map(d => d[categories[this.state.selectedIndex]]))
          .range(colorArray)
         
        })
       
        
           
        
      }).catch(error=>{
        //we can update state to an error to show meaningful message on screen
     });
}


   onMouseEnter = (geo, current)  =>{
    return () => {
      this.setState({
        tooltipContent:`${geo.properties.name}: ${current[this.state.categories[this.state.selectedIndex]] ? current[this.state.categories[this.state.selectedIndex]]:'NA'}`
      })
    };
  };

   onMouseLeave =  () => {
    this.setState({
        tooltipContent:`` 
      })
  };
handleCategoryChange = (event, newValue)=>{
    
    let colorArray = [];
    COLOR_RANGE.map(v => {
        let colorStr =v.substring(0, (newValue%6+1)) + newValue + v.substring((newValue%6+1) + 1);
        colorArray.push(colorStr.slice(0,7))})
console.log('colorArray',colorArray);
    this.setState({
        selectedIndex : newValue,
        gradientData : {
            fromColor: colorArray[0],
            toColor: colorArray[colorArray.length-1],
            min: 0,
            max: this.state.data.reduce((max, item) => (item[this.state.categories[newValue]] > max ? item[this.state.categories[newValue]] : max), 0)
          },
          colorScale : scaleQuantile()
          .domain(this.state.data.map(d => d[this.state.categories[newValue]]))
          .range(colorArray)
    })
}
render(){
  return (
      
   ( this.state.data.length > 0 && this.state.categories )? <div className="full-width-height container">
              <StyledTabs
          value={this.state.selectedIndex}
          onChange={this.handleCategoryChange}
          scrollButtons="on"
          variant="scrollable"
          aria-label="full width tabs example"
        >
            {this.state.categories.map((v,i) => <StyledTab label={v} {...a11yProps(i)} />)}

        </StyledTabs>
      {/* <h1 className="no-margin center">States and UTs</h1> */}
      <ReactTooltip>{this.state.tooltipContent}</ReactTooltip>
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          
          viewBox={  `50 -150 ${900} ${900}` }
          data-tip=""
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                //console.log(geo.id);
                const current = this.state.data.find(s => s.statecode === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? this.state.colorScale(current[this.state.categories[this.state.selectedIndex]]) : DEFAULT_COLOR}
                    style={geographyStyle}
                    onMouseEnter={this.onMouseEnter(geo, current)}
                    onMouseLeave={this.onMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
       {this.state.gradientData && <LinearGradient data={this.state.gradientData} />}
    </div>:
<Skeleton animation="wave"  height='800px'/>
  )}
}

export default MapComponent;