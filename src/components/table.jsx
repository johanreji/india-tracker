import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Card';
import './table.css';
import Axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';


let lastupdatedtime;
const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: '#636363',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: 'white',
        border:'none',
        cursor:"pointer"
      },
      '&:nth-of-type(even)': {
        backgroundColor: 'white',
        border:'none',
        cursor:"pointer"
      },
      '&:hover':{
        backgroundColor: 'lightgrey',
        border:'none',
      }
    },
  }))(TableRow);
class StateTable extends React.Component{
    constructor(props) {
        super(props);
    this.state={
      tableHeader : [],
      tableData : [],
      lastupdatedtime:0
    }
  }
 
  componentDidMount(){
    this.props.stateData.length &&
      this.setState({
        tableHeader : Object.keys(this.props.stateData[0]),
        tableData: this.props.stateData
      })
  }
  componentDidUpdate(prevProps){
    if(prevProps.selectedState !=  this.props.selectedState){
      if(this.props.selectedState == ""){
        this.setState({
          selectedState:"",
          tableHeader : Object.keys(this.props.stateData[0]),
          tableData: this.props.stateData
        })
      }else{
          this.setState({
            selectedState:this.props.selectedState,
            tableHeader : Object.keys(this.props.districtData[0]),
            tableData: this.props.districtData.filter(v => v.state == this.props.selectedState)
          })
        }
      }
  }
  handleStateClick =(state) => {
    if(this.props.districtData.length > 0){
    this.props.selectState(state);
  }
  }
  render(){
 
  return (this.state.tableHeader.length > 0 && this.state.tableData.length > 0) ?<Paper style={{
        width: '100%',
        overflowX: 'auto',
      }}>
      <Table  size="small" padding='checkbox' aria-label="a dense table">
        {lastupdatedtime && <caption>Last updated : {lastupdatedtime}</caption>}
        <TableHead > 
          <TableRow>
            {this.state.tableHeader.map(v => (v!= 'statecode' && v != 'lastupdatedtime' && (this.props.selectedState != ""? v!='state':true)) && v && <StyledTableCell  style={{fontWeight:"600"}}>{v}</StyledTableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.tableData.map((row) => 
            row.statecode != 'TT' && <StyledTableRow key={row.id} onClick = {() => !(this.props.selectedState != "" ) && this.handleStateClick(row['state'])} >
              {Object.keys(row).map(u => {
                  if('lastupdatedtime' == u ){
                    lastupdatedtime = row[u];
                  }
                  return ('statecode' != u && 'lastupdatedtime' != u && (this.props.selectedState != ""? u!='state':true) &&  u) && <TableCell component="th" scope="row" style={'state' == u?{}:{textAlign:'right'}}>
                {row[u]}
              </TableCell>
            })}
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </Paper>:
<Skeleton animation="wave"  height='100%'/>
  }
}

export default StateTable;
